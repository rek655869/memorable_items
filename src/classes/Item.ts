/**
 * Класс, представляющий собой памятный предмет
 */
class Item {
    private readonly _name: string;

    /**
     * BB-код для изображения
     */
    public img: string;

    /**
     * BB-код для описания
     */
    public description: string;

    constructor(_name: string, _img: string, _description: string) {
        this._name = _name;
        this.img = _img;
        this.description = _description;
    }

    /**
     * Название ПП
     */
    public get name(): string {
        return this._name;
    }
}