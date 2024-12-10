class ItemsError extends Error {
    message: string = 'Не удалось получить список ПП';
    cause: any;

    constructor(cause?: any) {
        super();
        this.cause = cause;
    }
}

class ItemsOtherError extends ItemsError {
    constructor(cause: any) {
        super(cause);
        this.message += ':\n' + cause;
    }
}

class ItemsNotFoundError extends ItemsError {
    constructor() {
        super();
        this.message += ':\n' + 'Не найден ни один ПП. Проверьте лист "Актуальные"';
    }
}