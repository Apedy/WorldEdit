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
import { World } from '../lib/minecraft';

const mcLib = new World("overworld");

export class Edit {
	/**
	 * @param {mc.Player} player
	 */
	constructor(player) {
		this.player = player.nameTag;
		this.isBlockSelectionMode = false;
		this.point1 = null;
		this.point2 = null;
	}
	static toolTag = ["§r§dWorld Edit++§t§o§o§l§r"];
	static contents = [];
	/**
	 * Returns whether player has the tool.
	 * @param {mc.Player} player
	 */
	static hasTool(player) {
		return mcLib.hasItem(player)?.getLore().toString() === this.toolTag.toString();
	}
	/**
	 * Set point1.
	 * @param {mc.Player} player
	 * @param {mc.Vector3} location
	 */
	static setPoint1(player, location) {
		const point = `${location.x} ${location.y} ${location.z}`;

		if (point !== this.find(player).point1) {
			this.find(player).point1 = point;
			mcLib.runCommands(player, `title @s actionbar §f[LOG] Point1: §l§c${this.find(player).point1}`);
		}
	}
	/**
	 * Set point2.
	 * @param {mc.Player} player
	 * @param {mc.Vector3} location
	 */
	static setPoint2(player, location) {
		const point = `${location.x} ${location.y} ${location.z}`;

		if (point !== this.find(player).point2) {
			this.find(player).point2 = point;
			mcLib.runCommands(player, `title @s actionbar §f[LOG] Point2: §l§c${this.find(player).point2}`);
		}
	}
	/**
	 * Search for player content.
	 * @param {mc.Player} player
	 * @returns {Edit}
	 */
	static find(player) {
		return this.contents.find(content => content.player === player.nameTag) || this.contents[this.contents.push(new this(player))];
	}
}
/**
 * 指定した範囲をブロックで埋めます。
 * @param {mc.Player} player
 * @param {mc.ItemStack} block
 * @returns {Promise<mc.CommandResult>}
 */
export const fill = (player, block) => {
	const blockId = block?.typeId || "minecraft:air";

	return mcLib.runCommands(mcLib.dimension, `fill ${Edit.find(player)?.point1} ${Edit.find(player)?.point2} ${blockId}`)[0];
};
