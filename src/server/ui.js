import { UI } from './constants';

export const onOpen = () => {
  const menu = UI.createMenu('Обновление')
    .addItem('Поиск игрока', 'openSearchSidebar')
    .addItem('Удаление игроков', 'openDeletePlayersSidebar')
    .addSeparator()
    .addItem('Проверка игроков', 'openCheckingDialog')
    .addItem('Сортировка архива', 'sortArchive');
  menu.addToUi();
};

export const openCheckingDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('checking-dialog')
    .setWidth(400)
    .setHeight(150);
  UI.showModalDialog(html, 'Проверка игроков');
};

export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('sidebar-about-page');
  UI.showSidebar(html);
};

export const openSearchSidebar = () => {
  const html =
    HtmlService.createHtmlOutputFromFile('search-sidebar').setTitle(
      'Поиск игрока'
    );
  UI.showSidebar(html);
};

export const openDeletePlayersSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile(
    'delete-players-sidebar'
  ).setTitle('Удаление игроков');
  UI.showSidebar(html);
};
