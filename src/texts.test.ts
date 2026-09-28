import { describe, expect, test } from 'bun:test';
import { loadTexts } from './texts.ts';

// A fresh, fully valid window.TEXTS payload for every test.
const valid = () => ({
    logo: { src: 'logo.webp', alt: 'ABC Mobile', href: './', width: 600, height: 110 },
    nav: [
        { label: 'About', href: '#about' },
        { label: 'Contacts', href: '#contacts' }
    ],
    menuLabel: 'Menu',
    toTopLabel: 'Scroll to top',
    hero: { title: 'the Mobile Content Provider', subtitle: 'International Company' },
    contact: { eyebrow: 'Contact Our Team', title: 'Get in touch with us', lead: 'Feel free.' },
    form: {
        placeholders: {
            name: 'Your name *',
            email: 'Your e-mail address *',
            question: 'Your question'
        },
        submit: 'Send',
        sending: 'Sending',
        errors: {
            required: 'The text field is required.',
            email: 'The email is not a valid email.'
        }
    },
    footer: {
        company: 'ABCMobile OÜ',
        reg: 'Reg No 14710834',
        address: 'Adress: Peterburi tee 71',
        phoneLabel: 'Phone:',
        phone: '+3726093464',
        since: 2017,
        brand: 'ABC Mobile Group',
        rights: 'All rights reserved'
    },
    messages: { MF000: 'Successfully sent!', MF001: 'Recipients are not set!', MF255: 'Aw, snap!' }
});

const error = (source: unknown): string => {
    const result = loadTexts(source);
    if (result.ok) throw new Error('expected a failure');
    return result.error;
};

describe('loadTexts', () => {
    test('accepts a valid payload and returns it unchanged', () => {
        expect(loadTexts(valid())).toEqual({ ok: true, texts: valid() });
    });

    test('reports a missing window.TEXTS', () => {
        expect(error(undefined)).toBe('window.TEXTS is missing (check the <script> in index.html)');
    });

    test('reports a non-object window.TEXTS', () => {
        expect(error('nope')).toBe('window.TEXTS must be an object');
    });

    test('reports a missing key by its path', () => {
        const texts = valid() as { footer: Partial<ReturnType<typeof valid>['footer']> };
        delete texts.footer.phone;
        expect(error(texts)).toBe('window.TEXTS.footer.phone is missing');
    });

    test('rejects an empty string', () => {
        const texts = valid();
        texts.hero.title = '   ';
        expect(error(texts)).toBe('window.TEXTS.hero.title must be a non-empty string');
    });

    test('rejects a non-integer number', () => {
        const texts = valid() as { footer: { since: unknown } };
        texts.footer.since = '2017';
        expect(error(texts)).toBe('window.TEXTS.footer.since must be a positive integer');
    });

    test('rejects an empty nav', () => {
        const texts = valid();
        texts.nav = [];
        expect(error(texts)).toBe('window.TEXTS.nav must be a non-empty array');
    });

    test('rejects a nav href that is not an anchor', () => {
        const texts = valid();
        texts.nav[1].href = 'https://example.com';
        expect(error(texts)).toBe('window.TEXTS.nav[1].href must be an anchor like "#about"');
    });

    test('requires MF000 and MF255 in messages', () => {
        const texts = valid() as { messages: Partial<ReturnType<typeof valid>['messages']> };
        delete texts.messages.MF255;
        expect(error(texts)).toBe('window.TEXTS.messages.MF255 is missing');
    });

    test('rejects a non-string message', () => {
        const texts = valid() as { messages: Record<string, unknown> };
        texts.messages.MF001 = 42;
        expect(error(texts)).toBe('window.TEXTS.messages.MF001 must be a non-empty string');
    });
});
