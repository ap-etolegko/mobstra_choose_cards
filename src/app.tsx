import type { CardItem } from '@/cards.ts';
import { Footer } from '@/components/footer.tsx';
import { Header } from '@/components/header.tsx';
import { Hero } from '@/components/hero.tsx';
import { ToTop } from '@/components/to-top.tsx';
import { TextsContext } from '@/hooks/use-texts.hook.ts';
import type { Texts } from '@/texts.ts';

interface AppProps {
    cards: CardItem[];
    texts: Texts;
}

export const App = ({ cards, texts }: AppProps) => (
    <TextsContext.Provider value={texts}>
        <div class="page">
            <Header />
            <Hero cards={cards} />
            <Footer />
        </div>
        <ToTop />
    </TextsContext.Provider>
);
