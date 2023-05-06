/*!
 * minecraft.js v1.0.2
 *
 * Copyright (c) 2023 Apedy
 *
 * This software is released under the minecraft.js.
 * see https://opensource.org/license/MIT
 */

import * as mc from '@minecraft/server';

export class World {
	/**
	 * @param {string} dimensionId
	 */
	constructor(dimensionId) {
		this.dimension = mc.world.getDimension(dimensionId);
	}
	/**
	 * 複数のコマンドを実行します。
	 * @param {(mc.Player|mc.Dimension)?} caller 実行元
	 * @param {...string} syntaxes 構文
	 * @returns {Promise<mc.CommandResult>[]}
	 */
	runCommands(caller = this.dimension, ...syntaxes) {
		return syntaxes.map(syntax => caller.runCommandAsync(syntax));
	}
	/**
	 * プレイヤーリストを取得します。
	 * @param {mc.EntityQueryOptions?} options
	 * @returns {mc.Player[]}
	 */
	getPlayerList(options) {
		return options ? Array.from(mc.world.getPlayers(options)) : mc.world.getAllPlayers();
	}
	/**
	 * プレイヤーが手に持っているアイテムを返します。
	 * @param {mc.Player} player プレイヤー
	 * @returns {mc.ItemStack}
	 */
	hasItem(player) {
		return player.getComponent("minecraft:inventory").container.getItem(player.selectedSlot);
	}
	/**
	 * プレイヤーに指定したアイテムを持たせます。
	 * @param {mc.Player} player プレイヤー
	 * @param {mc.ItemStack} ItemStack
	 * @param {?string[]} lore 説明
	 */
	giveItem(player, ItemStack, lore = "") {
		ItemStack.setLore(lore);
		player.getComponent("minecraft:inventory").container.addItem(ItemStack);
	}
	/**
	 * Apply motion to the player.
	 * @param {mc.Player|mc.Entity} player
	 * @param {mc.Vector3} vector
	 */
	applyMotion(player, { x, y, z }) {
		player.applyKnockback(x, z, Math.sqrt(x ** 2 + z ** 2) * 0.4, y < 1 ? 0.5 : y * 0.25);
	}
}
