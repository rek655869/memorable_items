import Player from '../classes/Player.ts';
import ItemConstructor from '../classes/ItemConstructor.ts';
import { PlayersSheet } from '../sheets/PlayersSheet.ts';

/**
 * Вызов с сайдбара обработки игроков, возвращает игрока, bb-код его ПП, все актуальные ПП
 * @param id
 * @throws {Error} если игрока с таким ID не существует
 */
export function search(id: number): {
  player: string;
  code: string;
  items: string;
} {
  let player = new Player(id);
  let data = player.getFromSpreadSheet();
  player.activate();
  try {
    player.getFromCatWar(false);
  } catch (e) {
    throw new Error('Не удалось получить профиль CatWar игрока с ID ' + id);
  }
  if (data) {
    try {
      player.getPlayersItems(data);
    } catch (e) {
      Logger.log(e);
      throw new Error('Не удалось получить список ПП игрока с ID ' + id);
    }
  }
  return {
    player: player.toString(),
    code: player.items ? ItemConstructor.getCode(player.items) : '',
    items: JSON.stringify(ItemConstructor.getAllItems(player.sex)),
  };
}

export function activateCell(rowIndex: number, columnIndex: number) {
  PlayersSheet.sheet.getRange(rowIndex, columnIndex + 3).activate();
}

export function updatePlayer(
  id: number,
  name: string,
  items: string[],
  clan: boolean | null
) {
  let player = new Player(id);
  player.name = name;
  if (clan) {
    try {
      player.update(items);
    } catch (e) {
      throw new Error(
        'Не удалось обновить данные игрока с ID ' + id + ' в таблице'
      );
    }
  } else {
    try {
      player.addToSpreadsheet(items);
    } catch (e) {
      throw new Error('Не удалось добавить игрока с ID ' + id + ' в таблицу');
    }
  }
  PlayersSheet.sort();
  player.getFromSpreadSheet();
  player.activate();
}
