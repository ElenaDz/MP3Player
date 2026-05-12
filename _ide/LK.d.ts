declare class LK {
    public readonly $context: JQuery;

    constructor($context: JQuery);

    /**
     * Проверяет авторизацию через data-атрибут контекста
     */
    static is_authorized($context?: JQuery): boolean;

    /**
     * Создает или возвращает экземпляр LK для указанного контекста
     */
    static create($context?: JQuery): LK;
}

/**
 * Расширение стандартного интерфейса HTMLElement,
 * так как класс записывает ссылку на себя в DOM-узел
 */
interface HTMLElement {
    LK?: LK;
}