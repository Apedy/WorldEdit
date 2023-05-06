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
import { World } from './lib/minecraft';
import { Edit, fill } from './modules/edit';

const mcLib = new World("overworld");

mcLib.runCommands(mcLib.dimension, "title @a times 0 2 0");

mc.world.events.beforeChat.subscribe(eventData => {
	const { sender, message } = eventData;

	if (message.startsWith("\\")) {
		eventData.cancel = true;

		if (/wand$/.test(message)) {
			mcLib.giveItem(sender, new mc.ItemStack(mc.MinecraftItemTypes.woodenAxe), Edit.toolTag);

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

			fill(sender, Item).then(() => {
				mcLib.runCommands(sender, `title @s actionbar §a[SUCCESS] §fFill block: §l${ItemId}`);
			}).catch(() => {
				mcLib.runCommands(sender, `title @s actionbar §c[ERROR] §fF-101`);
			});
		}
	}
});

mc.world.events.blockBreak.subscribe(eventData => {
	const { player, block, brokenBlockPermutation } = eventData;

	if (Edit.hasTool(player)) {
		block.setPermutation(brokenBlockPermutation);

		Edit.setPoint1(player, block.location);
	}
});

mc.world.events.beforeItemUseOn.subscribe(eventData => {
	const { source } = eventData;

	if (Edit.hasTool(source)) {
		eventData.cancel = true;

		Edit.setPoint2(source, source.getBlockFromViewDirection().location);
	}
});

mc.world.events.blockPlace.subscribe(eventData => {
	const { player, block } = eventData;
	const Item = mcLib.hasItem(player);
	const ItemId = Item?.typeId || "minecraft:air";
	const blockLocation = `${block.location.x} ${block.location.y} ${block.location.z}`;

	if (Edit.find(player).isBlockSelectionMode) {
		mcLib.runCommands(player, `setblock ${blockLocation} air`);

		fill(player, Item).then(() => {
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
