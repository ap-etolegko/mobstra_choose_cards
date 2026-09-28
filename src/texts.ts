export interface NavLink {
    label: string;
    href: string;
}

/** rd-mailform result codes → snackbar texts. MF000 (success) and MF255 (generic error) are required. */
export interface Messages {
    MF000: string;
    MF255: string;
    [code: string]: string | undefined;
}

export interface Texts {
    logo: { src: string; alt: string; href: string; width: number; height: number };
    nav: NavLink[];
    menuLabel: string;
    toTopLabel: string;
    hero: { title: string; subtitle: string };
    contact: { eyebrow: string; title: string; lead: string };
    form: {
        placeholders: { name: string; email: string; question: string };
        submit: string;
        sending: string;
        errors: { required: string; email: string };
    };
    footer: {
        company: string;
        reg: string;
        address: string;
        phoneLabel: string;
        phone: string;
        since: number;
        brand: string;
        rights: string;
    };
    messages: Messages;
}

export type TextsResult = { ok: true; texts: Texts } | { ok: false; error: string };

const ROOT = 'window.TEXTS';
// header.tsx passes nav hrefs to querySelector(), anything but "#id" would throw there
const ANCHOR = /^#[\w-]+$/;

const invalid = (path: string, rule: string): Error => new Error(`${path} ${rule}`);

const readObject = (value: unknown, path: string): Record<string, unknown> => {
    if (value === undefined) throw invalid(path, 'is missing');
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw invalid(path, 'must be an object');
    }
    return value as Record<string, unknown>;
};

const readString = (value: unknown, path: string): string => {
    if (value === undefined) throw invalid(path, 'is missing');
    if (typeof value !== 'string' || value.trim() === '') {
        throw invalid(path, 'must be a non-empty string');
    }
    return value;
};

const readInteger = (value: unknown, path: string): number => {
    if (value === undefined) throw invalid(path, 'is missing');
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
        throw invalid(path, 'must be a positive integer');
    }
    return value;
};

const readAnchor = (value: unknown, path: string): string => {
    const href = readString(value, path);
    if (!ANCHOR.test(href)) throw invalid(path, 'must be an anchor like "#about"');
    return href;
};

const readNav = (value: unknown, path: string): NavLink[] => {
    if (value === undefined) throw invalid(path, 'is missing');
    if (!Array.isArray(value) || value.length === 0)
        throw invalid(path, 'must be a non-empty array');
    return value.map((item: unknown, index) => {
        const itemPath = `${path}[${index}]`;
        const link = readObject(item, itemPath);
        return {
            label: readString(link.label, `${itemPath}.label`),
            href: readAnchor(link.href, `${itemPath}.href`)
        };
    });
};

const readMessages = (value: unknown, path: string): Messages => {
    const record = readObject(value, path);
    const messages: Messages = {
        MF000: readString(record.MF000, `${path}.MF000`),
        MF255: readString(record.MF255, `${path}.MF255`)
    };
    for (const code of Object.keys(record)) {
        messages[code] = readString(record[code], `${path}.${code}`);
    }
    return messages;
};

/** Validates the window.TEXTS payload from index.html; the error names the offending key. */
export const loadTexts = (source: unknown): TextsResult => {
    if (source === undefined) {
        return { ok: false, error: `${ROOT} is missing (check the <script> in index.html)` };
    }
    try {
        const root = readObject(source, ROOT);
        const logo = readObject(root.logo, `${ROOT}.logo`);
        const hero = readObject(root.hero, `${ROOT}.hero`);
        const contact = readObject(root.contact, `${ROOT}.contact`);
        const form = readObject(root.form, `${ROOT}.form`);
        const placeholders = readObject(form.placeholders, `${ROOT}.form.placeholders`);
        const errors = readObject(form.errors, `${ROOT}.form.errors`);
        const footer = readObject(root.footer, `${ROOT}.footer`);
        return {
            ok: true,
            texts: {
                logo: {
                    src: readString(logo.src, `${ROOT}.logo.src`),
                    alt: readString(logo.alt, `${ROOT}.logo.alt`),
                    href: readString(logo.href, `${ROOT}.logo.href`),
                    width: readInteger(logo.width, `${ROOT}.logo.width`),
                    height: readInteger(logo.height, `${ROOT}.logo.height`)
                },
                nav: readNav(root.nav, `${ROOT}.nav`),
                menuLabel: readString(root.menuLabel, `${ROOT}.menuLabel`),
                toTopLabel: readString(root.toTopLabel, `${ROOT}.toTopLabel`),
                hero: {
                    title: readString(hero.title, `${ROOT}.hero.title`),
                    subtitle: readString(hero.subtitle, `${ROOT}.hero.subtitle`)
                },
                contact: {
                    eyebrow: readString(contact.eyebrow, `${ROOT}.contact.eyebrow`),
                    title: readString(contact.title, `${ROOT}.contact.title`),
                    lead: readString(contact.lead, `${ROOT}.contact.lead`)
                },
                form: {
                    placeholders: {
                        name: readString(placeholders.name, `${ROOT}.form.placeholders.name`),
                        email: readString(placeholders.email, `${ROOT}.form.placeholders.email`),
                        question: readString(
                            placeholders.question,
                            `${ROOT}.form.placeholders.question`
                        )
                    },
                    submit: readString(form.submit, `${ROOT}.form.submit`),
                    sending: readString(form.sending, `${ROOT}.form.sending`),
                    errors: {
                        required: readString(errors.required, `${ROOT}.form.errors.required`),
                        email: readString(errors.email, `${ROOT}.form.errors.email`)
                    }
                },
                footer: {
                    company: readString(footer.company, `${ROOT}.footer.company`),
                    reg: readString(footer.reg, `${ROOT}.footer.reg`),
                    address: readString(footer.address, `${ROOT}.footer.address`),
                    phoneLabel: readString(footer.phoneLabel, `${ROOT}.footer.phoneLabel`),
                    phone: readString(footer.phone, `${ROOT}.footer.phone`),
                    since: readInteger(footer.since, `${ROOT}.footer.since`),
                    brand: readString(footer.brand, `${ROOT}.footer.brand`),
                    rights: readString(footer.rights, `${ROOT}.footer.rights`)
                },
                messages: readMessages(root.messages, `${ROOT}.messages`)
            }
        };
    } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
};
