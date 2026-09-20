import type { CardItem } from '@/cards.ts';
import { Footer } from '@/components/footer.tsx';
import { Header } from '@/components/header.tsx';
import { Hero } from '@/components/hero.tsx';
import { ToTop } from '@/components/to-top.tsx';

interface AppProps {
    cards: CardItem[];
}

export const App = ({ cards }: AppProps) => (
    <>
        <div class="page">
            <Header />
            <Hero cards={cards} />
            <Footer />
        </div>
        <ToTop />
    </>
);
