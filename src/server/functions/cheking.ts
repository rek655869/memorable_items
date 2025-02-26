import { PlayersSheet } from '../sheets/PlayersSheet.ts';
import Player from '../classes/Player.ts';

export function getCurrentPlayers(): number | null {
  const userProperties = PropertiesService.getUserProperties();
  let result = userProperties.getProperty('COUNT_ID');
  return result === null ? null : Number(result);
}

/**
 * Входная точка функции проверки таблицы
 */
export function startChecking() {
  let data = PlayersSheet.getData().slice(2);
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('COUNT_ID', data.length.toString());
  checkPlayers(userProperties, data);
}

/**
 * Построчная обработка всех игроков в таблице
 * @param userProperties объект свойств пользователя
 * @param data данные с листа
 */
function checkPlayers(
  userProperties: GoogleAppsScript.Properties.Properties,
  data: any[]
) {
  let noClan = new Set<number>();
  data.forEach((row: any[], index: number) => {
    let id = Number(row[1]);
    let player = new Player(id);
    try {
      player.getFromCatWar(true);
    } catch (error) {
      noClan.add(id);
    }
    if (!player.clan) {
      noClan.add(id);
    }
    if (player.name) {
      row[2] = player.name;
    }
    userProperties.setProperty(
      'COUNT_ID',
      (data.length - index + 1).toString()
    );
  });
  PlayersSheet.updateRange(3, 1, data);
  userProperties.setProperty('COUNT_ID', '-1');
  data.forEach((row: any[], index: number) => {
    PlayersSheet.update(2 + index + 1, row.slice(0, 3));
  });
  userProperties.setProperty('COUNT_ID', '-2');
  PlayersSheet.sort();
  userProperties.deleteProperty('COUNT_ID');
  userProperties.setProperty('ID_TO_DELETE', Array.from(noClan).toString());
  return noClan;
}
