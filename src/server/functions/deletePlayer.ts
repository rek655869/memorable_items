import Player from '../classes/Player.ts';

export function getIdToDelete(deleteProperty: boolean) {
  const userProperties = PropertiesService.getUserProperties();
  let result = userProperties.getProperty('ID_TO_DELETE');
  if (deleteProperty) {
    userProperties.deleteProperty('ID_TO_DELETE');
  }
  return result;
}

export function deletePlayer(id: number) {
  let player = new Player(id);
  if (!player.getFromSpreadSheet()) {
    throw new Error('Не удалось получить игрока с ID ' + id + ' из таблицы');
  }
  player.delete();
}
