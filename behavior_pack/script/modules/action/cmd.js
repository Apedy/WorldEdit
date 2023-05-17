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

import { Edit } from '../edit/index';

const mcLib = new World("overworld");


export class Option {
	/**
	 * @typedef {Object.<string, string>} state
	 * @typedef {state[]} status
	 */

	/** @param {string[]} used */
	constructor(used) {
		this.used = used;
	}

	/** @type status */
	#status = [];

	/**
	 * Register option.
	 * @param {state} option
	 */
	entry(option) {
		this.#status.push(option);
		return this;
	}
	/**
	 * Returns whether the option is used.
	 * @param {string} name
	 * @returns {boolean}
	 */
	isUsed(name) {
		return this.used.includes(this.#status.find(state => state[name])[name]);
	}
}

class Run {
	/**
	 * @param {mc.Player} player
	 * @param {Option?} option
	 */
	static wand(player, option) {
		mcLib.giveItem(player, mc.MinecraftItemTypes.woodenAxe, { lore: Edit.toolTag.sel, nameTag: "§r§l§fAxe§r" });
		mcLib.giveItem(player, mc.MinecraftItemTypes.woodenPickaxe, {lore: Edit.toolTag.tp, nameTag: "§r§l§fPickaxe§r"});

		player.sendMessage("\n§l§fAxe:§r\n§l§6>> §fleft click: set pos1§r\n§l§6>> §fright click: set pos2§r");
		player.sendMessage("\n§l§fPickaxe:§r\n§l§6>> §fright click: Teleport to a viewpoint§r");
	}
	/**
	 * @param {mc.Player} player
	 * @param {Option?} option
	 */
	static save(player, option) {
		Edit.saveBlock(player, player.getBlockFromViewDirection()?.permutation);

		player.onScreenDisplay.setActionBar(`§7[LOG] §fSave block: §l§b${Edit.find(player).savedBlock.type.id}`);
	}
	/**
	 * @param {mc.Player} player
	 * @param {Option?} option
	 */
	static set(player, option) {
		Edit.find(player).isBlockSelectionMode = true;

		player.sendMessage("§lblock selection mode: §bON§r\n§l§6>>§r Place the block you want to fill.§r");
	}
	/**
	 * @param {mc.Player} player
	 * @param {Option?} option
	 */
	static unSet(player, option) {
		Edit.find(player).isBlockSelectionMode = false;

		player.sendMessage("§lblock selection mode: §7OFF§r");
	}
	/**
	 * @param {mc.Player} player
	 * @param {Option?} option
	 */
	static place(player, option) {
		if (option.isUsed("replace")) {
			option.isUsed("saved") ? Edit.run.fillBlocks(player, Edit.find(player).savedBlock, {matchingBlock: mc.BlockPermutation.resolve(mcLib.hasItem(player).typeId)}) : Edit.run.fillBlocks(player, mcLib.hasItem(player), {matchingBlock: Edit.find(player).savedBlock});
		}
		else option.isUsed("saved") ? Edit.run.fillBlocks(player, Edit.find(player).savedBlock) : Edit.run.fillBlocks(player, mcLib.hasItem(player));
	}
	/**
	 * @param {mc.Player} player
	 * @param {Option?} option
	 */
	static dist(player, option) {
		const pos1 = Edit.find(player).pos1,
					pos2 = Edit.find(player).pos2;

		const distance = option?.isUsed("include") ? (pos1.x === pos2.x ? 1 : Math.abs(pos1.x - pos2.x) + 1) + (pos1.z === pos2.z ? 1 : Math.abs(pos1.z - pos2.z) + 1) - 1
								: (pos1.x === pos2.x ? 1 : Math.abs(pos1.x - pos2.x) + 1) + (pos1.z === pos2.z ? 1 : Math.abs(pos1.z - pos2.z) + 1) - 3;

		player.onScreenDisplay.setActionBar(`§a[SUCCESS] §l§f${distance}M§r`);
	}
	#diff() {}
}

export const run = Run;
