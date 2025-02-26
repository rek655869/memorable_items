import Item from './Item.ts';
import ItemConstructor from './ItemConstructor.ts';
import { PlayersSheet } from '../sheets/PlayersSheet.ts';
import { ArchiveSheet } from '../sheets/ArchiveSheet.ts';

class Player {
  public readonly id: number;
  public name: string = '';
  public sex: boolean = true; // true - кошка, false - кот
  private dieDate: Date = new Date();
  public clan: boolean | null = null;
  public rowIndex: number | null = null;
  public items: Item[] = [];

  constructor(_id: number) {
    this.id = _id;
  }

  /**
   * Получение информации из таблицы (наличие в ней и целая строка)
   * @return индекс и строка из таблицы, если есть
   */
  public getFromSpreadSheet(): any[] | null {
    let result: { index: number; data: any } | null =
      PlayersSheet.findPlayerById(this.id);
    if (result) {
      this.clan = true;
      this.rowIndex = result.index + 1;
    }
    return result?.data;
  }

  /**
   * Получение информации (имени, пола, должности) об игроке с CatWar
   * @param findOutMembership определять ли должность
   */
  getFromCatWar(findOutMembership: boolean): void {
    // @ts-ignore
    let cw = CatWar.init();
    let html;
    if (findOutMembership) {
      html = cw.getPlayerHtml(this.id);
    } else {
      html = cw.getPlayerNoCookie(this.id);
    }
    if (!html)
      throw new Error('Не удалось получить профиль игрока с ID ' + this.id);

    const pMatch = html.match(/<p[^>]*\s+data-cat='([^']+)'[^>]*>/);
    if (pMatch && pMatch[1] === this.id.toString()) {
      // получаем имя
      const bigMatch = html.match(/<big>(.*?)<\/big>/s);
      try {
        this.name = bigMatch[1].trim();
      } catch (error) {
        throw new Error(
          'Не удалось получить имя игрока с ID ' +
            this.id +
            '.\nПрофиль: ' +
            html
        );
      }

      // получаем пол
      const sexMatch = html.match(/solid\s+([\w-]+)/s);
      try {
        this.sex = sexMatch[1].trim() === 'pink';
      } catch (error) {
        throw new Error(
          'Не удалось получить имя игрока с ID ' +
            this.id +
            '.\nПрофиль: ' +
            html
        );
      }

      // получаем должность в клане
      if (findOutMembership) {
        const clanMatch = html.match(/<i>(.*?)<\/i>/s);
        this.clan = !!clanMatch;
      }

      // получаем дату смерти персонажа
      let age: number;
      const afterRebirth = html.match(
        /<tr>\s*<td><img\s+[^>]*title='Возраст \(после перерождения\)'[^>]*><\/td>\s*<td><b>(\d+(?:\.\d+)?)\s+([а-яА-ЯёЁ]+)<\/b><\/td>\s*<\/tr>/s
      );
      if (afterRebirth) {
        age = Number(afterRebirth[1].trim());
      } else {
        age = Number(
          html
            .match(
              /<tr>\s*<td><img\s+[^>]*title='Возраст'[^>]*><\/td>\s*<td><b>(\d+(?:\.\d+)?)\s+([а-яА-ЯёЁ]+)<\/b><\/td>\s*<\/tr>/s
            )[1]
            .trim()
        );
      }
      if (!age) {
        throw new Error(
          'Не удалось получить возраст игрока с ID ' +
            this.id +
            '.\nПрофиль: ' +
            html
        );
      }
      let days = (280 - age) * 4; // сколько лун осталось жить + переводим в дни
      // определяем дату
      const now = new Date();
      now.setTime(now.getTime() + days * 24 * 60 * 60 * 1000);
      this.dieDate = now;
    }
  }

  /**
   * Получение списка ПП игрока
   */
  public getPlayersItems(rowData: any[]) {
    let header: any[] = PlayersSheet.getData()[0];
    this.items = ItemConstructor.getAllItems(this.sex)
      .map((item) => {
        let columnIndex = header.indexOf(item.name);
        if (columnIndex !== -1 && rowData[columnIndex]) {
          item.columnIndex = columnIndex + 1;
          return item;
        }
      })
      .filter((entry): entry is Item => entry !== undefined);
  }

  /**
   * Сериализация объекта в строку JSON
   */
  public toString(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      sex: this.sex,
      row: this.rowIndex,
      clan: this.clan,
      items: JSON.stringify(this.items),
    });
  }

  /**
   * Переводит активное выделение в таблице на строку с именем игрока
   */
  public activate(): void {
    if (this.rowIndex === null) return;
    PlayersSheet.sheet.getRange(this.rowIndex, 3).activate();
  }

  /**
   * Обновление списка ПП игрока
   * @param itemTitles названия имеющихся ПП
   */
  public update(itemTitles: string[]): void {
    this.rowIndex = 0;
    let rowData = this.getFromSpreadSheet();
    if (!rowData) {
      throw new Error('Не удалось получить строку с игроком с ID ' + this.id);
    }
    let header: any[] = PlayersSheet.getData()[0];
    rowData.forEach((_, index) => {
      if (index > 2) {
        rowData[index] = itemTitles.includes(header[index]);
      }
    });
    if (rowData) {
      rowData[2] = this.name;
      PlayersSheet.update(this.rowIndex, rowData);
    }
  }

  /**
   * Добавление игрока на лист
   * @param itemTitles названия имеющихся ПП
   */
  addToSpreadsheet(itemTitles: string[]): void {
    let rowData: any[] = ['', this.id, this.name];
    let header: any[] = PlayersSheet.getData()[0].slice(3);
    header.forEach((title) => {
      if (itemTitles.indexOf(title) !== -1) {
        rowData.push(true);
      } else {
        rowData.push(false);
      }
    });
    PlayersSheet.addPlayer(rowData);
  }

  /**
   * Перемещение игрока в архив
   */
  delete() {
    this.activate();
    try {
      this.getFromCatWar(false);
    } catch (e) {
      Logger.log(e);
      throw new Error(
        'Не удалось получить профиль CatWar игрока с ID ' + this.id
      );
    }
    let data = PlayersSheet.findPlayerById(this.id)!.data;
    try {
      this.getPlayersItems(data);
    } catch (e) {
      Logger.log(e);
      throw new Error('Не удалось получить список ПП игрока с ID ' + this.id);
    }
    let items = this.items.map((item) => item.name);
    let archiveRow = [
      '',
      data[1],
      data[2],
      items.join(', '),
      this.dieDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
      new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
    ];
    try {
      ArchiveSheet.addPlayer(archiveRow);
    } catch (e) {
      Logger.log(e);
      throw new Error('Не удалось добавить игрока в архив');
    }
    try {
      PlayersSheet.deleteRow(this.rowIndex!);
    } catch (e) {
      Logger.log(e);
      throw new Error('Не удалось удалить строку с игроком с ID ' + this.id);
    }
    this.activate();
  }
}

export default Player;
