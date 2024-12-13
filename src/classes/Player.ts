import Range = GoogleAppsScript.Spreadsheet.Range;
import TextFinder = GoogleAppsScript.Spreadsheet.TextFinder;

class Player {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _sex: boolean;
    private readonly _rowIndex: number;
    private readonly _items: Item[] = [];

    constructor(_id: number, _sex: boolean) {
        this._id = _id;
        this._sex = _sex;

        let range: Range = PLAYERS_LIST.getRange(3, 2, PLAYERS_LIST.getLastRow() - 2, 1);
        let finder: TextFinder = range.createTextFinder(String(this._id)).matchEntireCell(true);
        let result: Range | null = finder.findNext();
        if (!result) {
            throw new Error("Игрока с таким ID не существует");
        }
        this._rowIndex = result.getRow();
        let rowData: any[] = PLAYERS_LIST.getRange(this._rowIndex, 3, 1, PLAYERS_LIST.getLastColumn() - 2).getValues()[0];
        this._name = rowData[0];
        this._items = this.updateItems(rowData);
    }

    /**
     * Сериализация объекта в строку JSON
     */
    public toString(): string {
       return JSON.stringify({
            id: this._id,
            name: this._name,
            items: JSON.stringify(this.items.map(item => item.name))
        });
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get sex(): boolean {
        return this._sex;
    }

    public get items(): Item[] {
        return this._items;
    }

    /**
     * Переводит активное выделение в таблице на строку с именем игрока
     */
    public activate(): void {
        PLAYERS_LIST.getRange(this._rowIndex, 3).activate();
    }

    /**
     * Получение актуального списка ПП игрока
     * @param rowData данные из строки с игроком на листе "Обладатели ПП"
     */
    private updateItems(rowData?: any[]): Item[] {
        if (rowData === undefined) {
            rowData = PLAYERS_LIST.getRange(this._rowIndex, 3, 1, PLAYERS_LIST.getLastColumn() - 2).getValues()[0];
        }
        // сопоставление ПП в заголовке "Обладатели ПП" со списком с листа "Актуальные"
        // затем фильтрация ПП по отмеченным чекбоксам в строке
        let header: any[] = PLAYERS_LIST.getRange(1, 3, 1, PLAYERS_LIST.getLastColumn() - 2).getValues()[0];
        return ItemConstructor.getAllItems(this.sex).filter((item) => {
            if (header.indexOf(item.name) !== -1) {
                if (rowData[header.indexOf(item.name)]) {
                    return true;
                }
            }
            return false;
        });
    }
}