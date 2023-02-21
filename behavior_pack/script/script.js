import * as mc from '@minecraft/server';
import { World } from './lib/minecraft';
import * as worldEdit from './modules/world-edit';

const mcLib = new World("overworld");
const Edit = worldEdit.Edit;

mcLib.runCommands(mcLib.dimension, "title @a times 0 2 0");

mc.world.events.beforeChat.subscribe(eventData => {
	const { sender, message } = eventData;

	if (message.startsWith("\\")) {
		eventData.cancel = true;

		if (/wand$/.test(message)) {
			mcLib.giveItem(sender, new mc.ItemStack(mc.MinecraftItemTypes.woodenAxe), Edit.axeTag);

			mcLib.runCommands(sender, "tellraw @s {\"rawtext\": [{\"text\": \"§l§6>> §fleft click: set point1§r\n§l§6>> §fright click: set point2\"}]}");
		}
		if (/set$/.test(message)) {
			Edit.find(sender).isBlockSelectionMode = true;

			mcLib.runCommands(sender, "tellraw @s {\"rawtext\": [{\"text\": \"§lblock selection mode: §bON§r\n§l§6>>§r Place the block you want to set.\"}]}");
		}
		if (/set\?$/.test(message)) {
			Edit.find(sender).isBlockSelectionMode = false;

			mcLib.runCommands(sender, "tellraw @s {\"rawtext\": [{\"text\": \"§lblock selection mode: §7OFF§r\"}]}");
		}
		if (/place$/.test(message)) {
			const Item = mcLib.hasItem(sender);
			const ItemId = Item?.typeId || "minecraft:air";

			worldEdit.fill(sender, Item).then(() => {
				mcLib.runCommands(sender, `title @s actionbar §a[SUCCESS] §fFill block: §l${ItemId}`);
			}).catch(() => {
				mcLib.runCommands(sender, `title @s actionbar §c[ERROR] §fF-101`);
			});
		}
	}
});

mc.world.events.blockBreak.subscribe(eventData => {
	const { player, block, brokenBlockPermutation } = eventData;

	if (mcLib.hasItem(player)?.typeId === mc.MinecraftItemTypes.woodenAxe.id && mcLib.hasItem(player)?.getLore().toString() === Edit.axeTag.toString()) {
		block.setPermutation(brokenBlockPermutation);

		Edit.setPoint1(player, block.location);
	}
});

mc.world.events.beforeItemUseOn.subscribe(eventData => {
	const { source, blockLocation } = eventData;

	if (mcLib.hasItem(source)?.typeId === mc.MinecraftItemTypes.woodenAxe.id && mcLib.hasItem(source)?.getLore().toString() === Edit.axeTag.toString()) {
		eventData.cancel = true;

		Edit.setPoint2(source, blockLocation);
	}
});

mc.world.events.blockPlace.subscribe(eventData => {
	const { player, block } = eventData;
	const Item = mcLib.hasItem(player);
	const ItemId = Item?.typeId || "minecraft:air";
	const blockLocation = `${block.location.x} ${block.location.y} ${block.location.z}`;

	if (Edit.find(player).isBlockSelectionMode) {
		mcLib.runCommands(player, `setblock ${blockLocation} air`);

		worldEdit.fill(player, Item).then(() => {
			mcLib.runCommands(player, `title @s actionbar §a[SUCCESS] §fFill block: §l${ItemId}`);
		}).catch(() => {
			mcLib.runCommands(player, "title @s actionbar §c[ERROR] §fF-100");
		});

		if (player.isSneaking) {
			Edit.find(player).isBlockSelectionMode = false;

			mcLib.runCommands(player, "tellraw @s {\"rawtext\": [{\"text\": \"§lBlock Selection Mode: §7OFF§r\"}]}");
		}
	}
});

mc.system.run(function tick() {
	mc.system.run(tick);

	mcLib.getPlayerList().forEach(player => Edit.find(player)?.isBlockSelectionMode ? mcLib.runCommands(mcLib.dimension, "title @a title §fBlock Selection Mode") : null);
});
