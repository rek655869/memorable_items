/**
 * Класс, представляющий собой памятный предмет
 */
class Item {
  /**
   * Название ПП
   */
  public readonly name: string;

  /**
   * Ссылка на изображение
   */
  public readonly url: string;

  /**
   * BB-код для изображения
   */
  public img: string;

  /**
   * BB-код для описания
   */
  public description: string;

  public columnIndex: number | null = null;

  constructor(_name: string, _url: string, _img: string, _description: string) {
    this.name = _name;
    this.url = _url;
    this.img = _img;
    this.description = _description;
  }
}

export default Item;
