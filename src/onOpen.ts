function onOpen(): void {
    UI
        .createMenu('Обновление')
        .addItem('Поиск', 'searchView')
        .addToUi();

    let errors: string = " ";

    if (!PLAYERS_LIST) {
        errors += 'Не удалось получить доступ к листу "Обладатели ПП". Проверьте имя листа.\n'
    }
    if (!ITEMS_LIST) {
        errors += 'Не удалось получить доступ к листу "Актуальные". Проверьте имя листа.\n'
    }
    if (errors.length > 0) {
        showAlert(errors.substring(0 , errors.length - 1));
    }
}

function showAlert(text: string): void {
    UI.alert(text);
}