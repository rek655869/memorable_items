import Item from './Item.ts';
import { ActualSheet } from '../sheets/ActualSheet.ts';

/**
 * Класс для сборки всех ПП игрока в один BB-код
 */
class ItemConstructor {
  /**
   * Возвращает список всех ПП с листа "Актуальные"
   * @param sex пол (true - кошка, false - кот)
   * @returns {Item[]} список всех ПП
   * @throws {Error} если не удалось получить общий список ПП
   */
  public static getAllItems(sex: boolean): Item[] {
    let data: any[][];
    try {
      data = ActualSheet.getData()
        .filter((row) => row[0] !== '')
        .slice(1);
    } catch (e: any) {
      if (e.message === 'Диапазон должен содержать как минимум одну строку.') {
        throw new Error('Не найден ни один ПП. Проверьте лист "Актуальные"');
      }
      throw e;
    }

    let items: Item[] = [];
    data.forEach((row) => {
      let url = row[3].match(/\[img\](https?:\/\/[^\s\[\]]+)\[\/img\]/);
      let desc = row[4];
      if (sex && row[5].length !== 0) {
        desc = row[5];
      }
      items.push(new Item(row[2], url[1], row[3], desc));
    });
    return items;
  }

  /**
   * Возвращает код для всех ПП игрока
   * @param items список ПП
   * @returns {string} код
   */
  public static getCode(items: Item[]): string {
    let code: string = '[table=0]\n';
    let header: string =
      '[tr][td][color=transparent]///[/color][/td][td] [header=пп][img]https://i.imgur.com/0ZiO3xf.png[/img][/header][/td]\n[td][color=transparent]—[/color][/td]';
    let block: string =
      '[tr][td]   [/td]\n[td] [header=пп][img]https://i.imgur.com/2dyNDBm.png[/img][/header][/td]\n\n';

    items.forEach((item, i) => {
      // в ряду не больше 5 ПП
      if (i > 2 && i % 5 === 0) {
        header =
          header.substring(0, header.lastIndexOf('[td] [/td]')) + '[td] [/td]';
        header +=
          '[/tr]\n\n' +
          block +
          '[/tr]\n\n' +
          '[tr][td] [/td][td]   [/td][/tr]\n\n' +
          '[tr][td] [/td]\n[td]   [/td][td][color=transparent]—[/color][/td]\n';
        block = '[tr][td]   [/td][td]   [/td]';
      }
      header += item.img + '\n';
      block += item.description + '\n\n';
    });

    if (items.length < 6) {
      header =
        header.substring(0, header.lastIndexOf('[td] [/td]')) + '[td]   [/td]';
    }
    block += '[/tr]\n';
    header += '[/tr]\n\n';
    code += `${header}${block}[/table]`;
    return code;
  }
}

export default ItemConstructor;
