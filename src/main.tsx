import '@/styles.css';
import { render } from 'preact';
import { App } from '@/app.tsx';
import { loadCards } from '@/cards.ts';
import { CardsError } from '@/components/cards-error.tsx';

const result = loadCards();
if (!result.ok) console.error('[CARDS]', result.error);

render(
    result.ok ? <App cards={result.cards} /> : <CardsError message={result.error} />,
    document.getElementById('app')!
);
