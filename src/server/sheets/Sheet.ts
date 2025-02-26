import { CACHE_EXPIRATION } from '../constants.ts';

/**
 * Представляет собой лист GoogleSheets
 */
export abstract class Sheet {
  public static sheet: GoogleAppsScript.Spreadsheet.Sheet;
  protected static data: any[][] = [];
  protected static lastUpdated: number = 0;

  /**
   * Инициализирует лист
   * @param sheetName название листа
   * @protected
   */
  protected static init(sheetName: string): void {
    this.sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)!;
    if (!this.sheet) throw new Error(`Лист "${sheetName}" не найден!`);
  }

  /**
   * Обновляет кэш данных листа каждые CACHE_EXPIRATION минут
   * @param force обновить принудительно
   * @protected
   */
  protected static updateCache(force: boolean = false): void {
    let now = Date.now();

    // Если кэш есть и не просрочен, не обновляем
    if (!force && this.data && now - this.lastUpdated < CACHE_EXPIRATION) {
      return;
    }

    this.data = this.sheet
      .getRange(1, 1, this.sheet.getMaxRows(), this.sheet.getMaxColumns())
      .getValues();
    this.lastUpdated = now;
  }

  /**
   * Возвращает данные листа
   */
  public static getData(): any[][] {
    if (!this.sheet)
      throw new Error(this.constructor.name + ' не инициализирован');
    this.updateCache();
    return this.data;
  }

  /**
   * Создаёт ячейку со ссылкой
   * @param id ID игрока
   * @param name имя игрока
   */
  static createNameCell(id: number, name: string) {
    return SpreadsheetApp.newRichTextValue()
      .setText(name)
      .setLinkUrl('https://catwar.net/cat' + id)
      .setTextStyle(
        SpreadsheetApp.newTextStyle().setForegroundColor('black').build()
      )
      .build();
  }

  /**
   * Добавляет новую строку (или определяет первую незаполненную), заполняет и возвращает её индекс
   * @param rowData данные для добавления
   * @param col столбец, по которому определять пустую строку
   * @param slice кол-во строк, которое нужно пропустить в начале
   */
  public static appendRow(
    rowData: any[],
    col: number = 0,
    slice: number = 1
  ): number {
    let lastRowIndex = this.getData()
      .slice(slice)
      .findIndex((row: any[]) => row[col] === '');
    if (lastRowIndex === -1) {
      lastRowIndex = this.getData().length;
      this.sheet.appendRow(rowData);
      this.updateCache(true);
    } else {
      lastRowIndex = lastRowIndex === 0 ? lastRowIndex : lastRowIndex;
      lastRowIndex += slice;
      if (rowData.length > this.sheet.getMaxColumns()) {
        throw new Error(
          `Слишком много данных: ${
            rowData.length
          }, а колонок ${this.sheet.getMaxColumns()}`
        );
      }
      this.sheet
        .getRange(lastRowIndex + 1, 1, 1, rowData.length)
        .setValues([rowData]);
    }
    return lastRowIndex + 1;
  }
}
