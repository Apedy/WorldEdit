import * as mc from '@minecraft/server';

export const world = {
	dimension: mc.world.getDimension("overworld"),
	/**
	 * 複数のコマンドを実行します。
	 * @param {(mc.Player|mc.Dimension)} caller 実行元
	 * @param {...string} syntaxes 構文
	 */
	runCommands(caller, ...syntaxes) {
		syntaxes.forEach(async function(syntax) {
			await caller.runCommandAsync(syntax);
		});
	},
	/**
	 * プレイヤーが手に持っているアイテムを返します。
	 * @param {mc.Player} player プレイヤー
	 * @returns {mc.ItemStack}
	 */
	hasItem(player) {
		return player.getComponent("minecraft:inventory").container.getItem(player.selectedSlot);
	},
	/**
	 * プレイヤーに指定したアイテムを持たせます。
	 * @param {mc.Player} player プレイヤー
	 * @param {mc.ItemStack} ItemStack
	 * @param {?string[]} lore 説明
	 */
	giveItem(player, ItemStack, lore) {
		if (lore) ItemStack.setLore(lore);

		player.getComponent("minecraft:inventory").container.addItem(ItemStack);
	}
};
