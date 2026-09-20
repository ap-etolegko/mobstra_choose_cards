import type { CardItem } from '@/cards.ts';
import { CardStage } from '@/components/card-stage.tsx';
import { Waves } from '@/components/waves.tsx';
import { SUBTITLE, TITLE } from '@/content.ts';

interface HeroProps {
    cards: CardItem[];
}

export const Hero = ({ cards }: HeroProps) => (
    <section class="hero" id="about">
        <div class="hero__bg">
            <Waves />
        </div>
        <div class="container">
            <div class="hero__text animated fadeInUp">
                <h1>{TITLE}</h1>
                <p class="hero__subtitle">{SUBTITLE}</p>
            </div>
            <CardStage cards={cards} />
        </div>
    </section>
);
