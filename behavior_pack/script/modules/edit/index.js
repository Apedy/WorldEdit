/*!
 * Copyright (C) 2023 Apedy
 * This file is part of WorldEdit++.
 *
 * WorldEdit++ is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WorldEdit++ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this WorldEdit++. If not, see <https://www.gnu.org/licenses/>.
 */

import * as mc from '@minecraft/server';
import { World } from '../../lib/minecraft';

const mcLib = new World("overworld");


class Run {
	/**
	 * Fill the specified area with blocks.
	 * @param {mc.Player} player
	 * @param {(mc.BlockPermutation|mc.BlockType)|(mc.Block|mc.ItemStack)} block
	 * @param {mc.BlockFillOptions?} option
	 * @returns {number}
	 */
	fillBlocks(player, block, option) {
		/** @type string */
		let blockId = block?.typeId || "minecraft:air";

		if (block?.constructor === mc.BlockPermutation) blockId = block?.type.id;
		else if (block?.constructor === mc.BlockType) blockId = block?.id;

		try {
			if (block?.constructor === mc.BlockPermutation || block?.constructor === mc.BlockType) mcLib.dimension.fillBlocks(Edit.find(player).pos1, Edit.find(player).pos2, block, option);
			else mcLib.dimension.fillBlocks(Edit.find(player).pos1, Edit.find(player).pos2, mc.BlockPermutation.resolve(blockId), option);

			player.onScreenDisplay.setActionBar(`§a[SUCCESS] §fFill block: §l§b${blockId}§r`);
		}
		catch {
			player.onScreenDisplay.setActionBar(`§c[ERROR] §l§fF-100§r`);
		}
	}
}

export class Edit {
	/**
	 * @param {mc.Player} player
	 */
	constructor(player) {
		this.player = player.nameTag;
		this.isBlockSelectionMode = false;
		/** @type mc.Vector3 */
		this.pos1;
		/** @type mc.Vector3 */
		this.pos2;
		/** @type mc.BlockPermutation */
		this.savedBlock;

		mcLib.runCommands("title @s times 0 2 0", player);
	}
	static toolTag = {
		sel: ["§r§dWorld Edit++§s§e§l§r"],
		tp: ["§r§dWorld Edit++§t§p§r§9(BETA)§r"]
	};
	static contents = [];
	/**
	 * Returns whether the player has a tool.
	 * @param {mc.Player} player
	 * @param {string} tag
	 */
	static hasTool(player, tag) {
		return mcLib.hasItem(player)?.getLore().toString() === this.toolTag[tag].toString();
	}
	/**
	 * Set pos1.
	 * @param {mc.Player} player
	 * @param {mc.Vector3} location
	 */
	static setPos1(player, location) {
		const pos = location;

		if (pos !== this.find(player).pos1) {
			this.find(player).pos1 = pos;
			player.onScreenDisplay.setActionBar(`§7[LOG] §fPos1: §l§c${pos.x} ${pos.y} ${pos.z}§r`);
		}
	}
	/**
	 * Set pos2.
	 * @param {mc.Player} player
	 * @param {mc.Vector3} location
	 */
	static setPos2(player, location) {
		const pos = location;

		if (pos !== this.find(player).pos2) {
			this.find(player).pos2 = pos;
			player.onScreenDisplay.setActionBar(`§7[LOG] §fPos2: §l§c${pos.x} ${pos.y} ${pos.z}§r`);
		}
	}
	/**
	 * Save the block temporarily.
	 * @param {mc.Player} player
	 * @param {mc.BlockPermutation} block
	 */
	static saveBlock(player, block) {
		this.find(player).savedBlock = block;
	}
	/**
	 * Search for player content.
	 * @param {mc.Player} player
	 * @returns {Edit}
	 */
	static find(player) {
		return this.contents.find(content => content.player === player.nameTag) || this.contents[this.contents.push(new this(player))];
	}
	static run = new Run();
}
