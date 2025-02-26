import {
  onOpen,
  openCheckingDialog,
  openSearchSidebar,
  openDeletePlayersSidebar,
} from './ui';

import { search, activateCell, updatePlayer } from './functions/search';

import { getIdToDelete, deletePlayer } from './functions/deletePlayer';

import { getCurrentPlayers, startChecking } from './functions/cheking';

import { sortArchive } from './functions/sortArchive.ts';

export {
  onOpen,
  openCheckingDialog,
  openSearchSidebar,
  openDeletePlayersSidebar,
  search,
  activateCell,
  updatePlayer,
  getIdToDelete,
  deletePlayer,
  getCurrentPlayers,
  startChecking,
  sortArchive,
};
