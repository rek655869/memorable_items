import { Sheet } from './Sheet.ts';

export class ArchiveSheet extends Sheet {
  static init(): void {
    super.init('Архив');
  }

  /**
   * Добавляет новую строку (игрока) на лист
   * @param archiveRow
   */
  static addPlayer(archiveRow: any[]) {
    let newRowIndex = this.appendRow(archiveRow, 1);
    this.sheet.getRange(2, 1, newRowIndex - 1, 1).merge();
    this.sheet.getRange(newRowIndex, 2).activate();
    this.sheet
      .getRange(newRowIndex, 3)
      .setRichTextValue(Sheet.createNameCell(archiveRow[1], archiveRow[2]));
  }

  static sort() {
    this.sheet
      .getRange(2, 2, this.getData().length - 1, this.getData()[0].length - 1)
      .sort({ column: 5, ascending: true });
  }
}

ArchiveSheet.init();
