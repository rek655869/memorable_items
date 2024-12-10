/**
 * Отображение сайдбара с поиском игрока
 */
function searchView(): void {
    let html = HtmlService
        .createHtmlOutputFromFile("html/Search")
        .setTitle("Поиск");
    UI.showSidebar(html);
}

/**
 * Поиск игрока по id на листе "Обладатели ПП"
 * @param input id игрока и его пол (false - мужчина, true - женщина)
 * @throws {Error} если игрока с таким ID не существует
 */
function search(input: any): string {
    let player = new Player(input.id, input.sex);
    player.activate();
    return JSON.stringify({
        player: player.toString(),
        code: ItemConstructor.getCode(player.items)
    });
}