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

import * as Cmd from './cmd';

const mcLib = new World("overworld");


mc.world.events.beforeChat.subscribe(eventData => {
	const { sender } = eventData;

	if (eventData.message.startsWith("\\")) {
		eventData.cancel = true;

		const cmd = eventData.message.split(" "),
				cmdType = cmd.find(cmd => /^\\\w+/.test(cmd))?.replace("\\", ""),
				cmdOpt = cmd.filter(cmd => /^-\w+/.test(cmd));

		switch (cmdType) {
			case "wand": return Cmd.run.wand(sender);
			case "save": return Cmd.run.save(sender);
			case "set": return Cmd.run.set(sender);
			case "set?": return Cmd.run.unSet(sender);
			case "place": return Cmd.run.place(sender, new Cmd.Option(cmdOpt).entry({"saved": "-s"}).entry({"replace": "-r"}));
			case "dist": return Cmd.run.dist(sender, new Cmd.Option(cmdOpt).entry({"include": "-i"}));
		}
	}
});

mc.world.events.blockBreak.subscribe(eventData => {
	const { player, block, brokenBlockPermutation } = eventData;

	if (Edit.hasTool(player, "sel")) {
		block.setPermutation(brokenBlockPermutation);

		Edit.setPos1(player, block.location);
	}
	else return;
});

mc.world.events.beforeItemUseOn.subscribe(eventData => {
	const { source } = eventData;

	if (Edit.hasTool(source, "sel")) {
		eventData.cancel = true;

		Edit.setPos2(source, source.getBlockFromViewDirection().location);
	}
	else return;
});

mc.world.events.beforeItemUse.subscribe(eventData => {
	const { source } = eventData;
	const block = source.getBlockFromViewDirection();

	if (Edit.hasTool(source, "tp")) {
		eventData.cancel = true;

		source.teleport(block?.location || source.location, source.getBlockFromViewDirection()?.dimension || source.dimension, source.getRotation().x, source.getRotation().y);
	}
});

mc.world.events.blockPlace.subscribe(eventData => {
	const { player, block } = eventData;

	if (Edit.find(player).isBlockSelectionMode) {
		mcLib.runCommands([`setblock ${block.location.x} ${block.location.y} ${block.location.z} air`]);
		Edit.run.fillBlocks(player, block.permutation);

		if (player.isSneaking) {
			Edit.find(player).isBlockSelectionMode = false;

			player.sendMessage("§lBlock Selection Mode: §7OFF§r");
		}
	}
});
