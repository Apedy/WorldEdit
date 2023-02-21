
import * as mc from '@minecraft/server';
import { World } from '../lib/minecraft';

const mcLib = new World("overworld");

export class Edit {
	/**
	 * @param {mc.Player} player プレイヤー
	 */
	constructor(player) {
		this.player = player.nameTag;
		this.isBlockSelectionMode = false;
		this.point1 = null;
		this.point2 = null;
	}
	static axeTag = ["§r§dWorld Edit++"];
	static contents = [];
	/**
	 * Set a point1.
	 * @param {mc.Player} player プレイヤー
	 * @param {mc.Location|mc.BlockLocation} location
	 */
	static setPoint1 = (player, location) => {
		const point = `${location.x} ${location.y} ${location.z}`;

		if (point !== this.find(player).point1) {
			this.find(player).point1 = point;
			mcLib.runCommands(player, `title @s actionbar §f[LOG] Point1: §l§c${Edit.find(player).point1}`);
		}
	};
	/**
	 * Set a point2.
	 * @param {mc.Player} player プレイヤー
	 * @param {mc.Location|mc.BlockLocation} location
	 */
	static setPoint2 = (player, location) => {
		const point = `${location.x} ${location.y} ${location.z}`;

		if (point !== this.find(player).point2) {
			this.find(player).point2 = point;
			mcLib.runCommands(player, `title @s actionbar §f[LOG] Point2: §l§c${Edit.find(player).point2}`);
		}
	};
	/**
	 * Find content.
	 * @param {mc.Player} player プレイヤー
	 * @returns {Edit}
	 */
	static find = (player) => {
		return this.contents.find(content => content.player === player.nameTag) || this.contents[this.contents.push(new this(player))];
	};
}
/**
 * 指定した範囲をブロックで埋めます。
 * @param {mc.Player} player プレイヤー
 * @param {mc.ItemStack} block ブロック
 * @returns {Promise<mc.CommandResult>}
 */
export const fill = (player, block) => {
	const blockId = block?.typeId || "minecraft:air";
	const blockDataValue = block?.data || 0;

	return mcLib.runCommands(mcLib.dimension, `fill ${Edit.find(player)?.point1} ${Edit.find(player)?.point2} ${blockId} ${blockDataValue}`)[0];
};
