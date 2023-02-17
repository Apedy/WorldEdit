import * as mc from '@minecraft/server';
import * as admin from './@apedy/minecraft';

const edit = {
	set: false,
	axeTag: ["§r§dWorld Edit++"]
};
const spot = {
	startLocation: null,
	endLocation: null
};

mc.world.events.beforeChat.subscribe(eventData => {
	const { sender, message } = eventData;

	if (message.startsWith("\\")) {
		eventData.cancel = true;

		if (/wand$/.test(message)) {
			admin.world.giveItem(sender, new mc.ItemStack(mc.MinecraftItemTypes.woodenAxe), edit.axeTag);
		}
		if (/set$/.test(message)) {
			edit.set = true;

			admin.world.runCommands(sender, "tellraw @s {\"rawtext\": [{\"text\": \"§lblock selection mode: §bON§r\n§l§6>>§r Place the block you want to set.\"}]}");
		}
		if (/set\?$/.test(message)) {
			edit.set = false;

			admin.world.runCommands(sender, "tellraw @s {\"rawtext\": [{\"text\": \"§lblock selection mode: §7OFF§r\"}]}");
		}
		if (/place$/.test(message)) {
			const blockId = admin.world.hasItem(sender)?.typeId || "minecraft:air";
			edit.set = false;

			admin.world.runCommands(sender, `title @s actionbar §a[SUCCESS] §fblock: §l${blockId}`, `fill ${spot.startLocation} ${spot.endLocation} ${blockId}`);
		}
	}
});

mc.world.events.blockBreak.subscribe(eventData => {
	const { player, block, brokenBlockPermutation } = eventData;
	const point = `${block.location.x} ${block.location.y} ${block.location.z}`;

	if (admin.world.hasItem(player)?.typeId === mc.MinecraftItemTypes.woodenAxe.id && admin.world.hasItem(player)?.getLore().toString() === edit.axeTag.toString()) {
		block.setPermutation(brokenBlockPermutation);

		if (point !== spot.startLocation) {
			spot.startLocation = point;
			admin.world.runCommands(player, `title @s actionbar §f[LOG] Start: §l${spot.startLocation}`);
		}
	}
});

mc.world.events.beforeItemUseOn.subscribe(eventData => {
	const { source, blockLocation } = eventData;
	const point = `${blockLocation.x} ${blockLocation.y} ${blockLocation.z}`;

	if (admin.world.hasItem(source)?.typeId === mc.MinecraftItemTypes.woodenAxe.id && admin.world.hasItem(source)?.getLore().toString() === edit.axeTag.toString()) {
		eventData.cancel = true;

		if (point !== spot.endLocation) {
			spot.endLocation = point;
			admin.world.runCommands(source, `title @s actionbar §f[LOG] End: §l${spot.endLocation}`);
		}
	}
});

mc.world.events.blockPlace.subscribe(eventData => {
	const { player, block } = eventData;
	const Item = admin.world.hasItem(player);
	const blockLocation = `${block.location.x} ${block.location.y} ${block.location.z}`;

	if (edit.set && spot.startLocation && spot.endLocation) {
		admin.world.runCommands(player,
			`title @s actionbar §a[SUCCESS] §fblock: §l${Item.typeId}`,
			`setblock ${blockLocation} air`,
			`fill ${spot.startLocation} ${spot.endLocation} ${Item.typeId} ${Item.data}`
		);

		if (player.isSneaking) {
			edit.set = false;

			admin.world.runCommands(player, "tellraw @s {\"rawtext\": [{\"text\": \"§lblock selection mode: §7OFF§r\"}]}");
		}
	}
	else if (edit.set) admin.world.runCommands(player, "title @s actionbar §e[WRONG] Set a point.", `setblock ${blockLocation} air`);
});

mc.system.run(function tick() {
	mc.system.run(tick);
});
