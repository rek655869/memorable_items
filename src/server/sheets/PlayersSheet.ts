import { Sheet } from './Sheet.ts';

export class PlayersSheet extends Sheet {
  static init(): void {
    super.init('Обладатели ПП');
  }

  /**
   * Возвращает строку и её ID с листа "Обладатели ПП", соответствующую игроку
   * @param id ID игрока
   */
  public static findPlayerById(
    id: number
  ): { index: number; data: any } | null {
    const data = this.getData();
    const index = data.findIndex((row) => row[1] === id);
    if (index !== -1) {
      return { index, data: data[index] };
    }
    return null;
  }

  /**
   * Обновляет строку с игроком
   * @param rowIndex индекс строки
   * @param rowData данные для вставки (двумерный массив)
   */
  static update(rowIndex: number, rowData: any[]) {
    this.sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    this.sheet
      .getRange(rowIndex, 3)
      .setRichTextValue(this.createNameCell(rowData[1], rowData[2]));
  }

  /**
   * Добавляет нового игрока на лист
   * @param rowData данные для вставки (двумерный массив)
   */
  static addPlayer(rowData: any[]) {
    let newRowIndex = this.appendRow(rowData, 1, 2);
    let lastRowIndex = newRowIndex - 1;
    this.sheet.getRange(3, 1, lastRowIndex - 3 + 1, 1).merge();
    this.sheet.getRange(newRowIndex, 3).activate();
    this.sheet
      .getRange(lastRowIndex, 2, 1, rowData.length - 1)
      .copyTo(
        this.sheet.getRange(newRowIndex, 2),
        SpreadsheetApp.CopyPasteType.PASTE_FORMAT,
        false
      );
    this.sheet
      .getRange(newRowIndex, 3)
      .setRichTextValue(Sheet.createNameCell(rowData[1], rowData[2]));
  }

  /**
   * Сортировка игроков по имени
   */
  static sort() {
    this.sheet
      .getRange(3, 2, this.getData().length - 2, this.getData()[0].length - 1)
      .sort({ column: 3, ascending: true });
    this.updateCache(true);
  }

  /**
   * Удаление строки
   * @param rowIndex индекс строки
   */
  static deleteRow(rowIndex: number) {
    this.sheet.deleteRow(rowIndex);
  }

  /**
   * Обновление данных в диапазоне
   * @param row первая строка
   * @param column первый столбец
   * @param data данные
   */
  static updateRange(row: number, column: number, data: any[][]) {
    this.sheet
      .getRange(row, column, data.length, data[0].length)
      .setValues(data);
  }
}

PlayersSheet.init();
