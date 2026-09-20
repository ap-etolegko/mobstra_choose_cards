export interface CardItem {
    title: string;
    image: string;
    href: string;
}

export type CardsResult = { ok: true; cards: CardItem[] } | { ok: false; error: string };

const REQUIRED_KEYS: Array<keyof CardItem> = ['title', 'image', 'href'];

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0;

const toCard = (item: unknown, index: number): CardItem | null => {
    if (typeof item !== 'object' || item === null) {
        console.warn(`[CARDS] item ${index} skipped: not an object`);
        return null;
    }
    const record = item as Record<string, unknown>;
    for (const key of REQUIRED_KEYS) {
        if (!isNonEmptyString(record[key])) {
            console.warn(`[CARDS] item ${index} skipped: missing "${key}"`);
            return null;
        }
    }
    // href is passed through untouched: it may contain Keitaro macros like {offer}
    return {
        title: record.title as string,
        image: record.image as string,
        href: record.href as string
    };
};

export const loadCards = (source: unknown = window.CARDS): CardsResult => {
    if (!Array.isArray(source)) {
        return {
            ok: false,
            error: 'window.CARDS is not an array (check the <script> in index.html)'
        };
    }
    const cards = source.map(toCard).filter((card): card is CardItem => card !== null);
    if (cards.length === 0) {
        return { ok: false, error: 'window.CARDS has no valid cards' };
    }
    return { ok: true, cards };
};
