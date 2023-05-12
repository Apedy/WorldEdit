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
import { Edit } from './modules/edit/index';

import './modules/action/index';

const mcLib = new World("overworld");


mc.system.runInterval(() => {
	mcLib.getPlayerList().forEach(player => Edit.find(player)?.isBlockSelectionMode ? player.onScreenDisplay.setActionBar("§b[MODE] §l§fBlock Selection") : null);
}, 1);
