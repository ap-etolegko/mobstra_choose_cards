import '@/styles.css';
import { render } from 'preact';
import { App } from '@/app.tsx';
import { loadCards } from '@/cards.ts';
import { ConfigError } from '@/components/config-error.tsx';
import { loadTexts } from '@/texts.ts';

const cards = loadCards();
const texts = loadTexts(window.TEXTS);
const errors = [cards, texts].flatMap((result) => (result.ok ? [] : [result.error]));
if (errors.length > 0) console.error('[CONFIG]', errors.join('\n'));

render(
    cards.ok && texts.ok ? (
        <App cards={cards.cards} texts={texts.texts} />
    ) : (
        <ConfigError message={errors.join('\n')} />
    ),
    document.getElementById('app')!
);
