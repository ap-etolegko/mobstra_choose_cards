import type { CardItem } from '@/cards.ts';
import { CardStage } from '@/components/card-stage.tsx';
import { Waves } from '@/components/waves.tsx';
import { useTexts } from '@/hooks/use-texts.hook.ts';

interface HeroProps {
    cards: CardItem[];
}

export const Hero = ({ cards }: HeroProps) => {
    const { hero } = useTexts();
    return (
        <section class="hero" id="about">
            <div class="hero__bg">
                <Waves />
            </div>
            <div class="container">
                <div class="hero__text animated fadeInUp">
                    <h1>{hero.title}</h1>
                    <p class="hero__subtitle">{hero.subtitle}</p>
                </div>
                <CardStage cards={cards} />
            </div>
        </section>
    );
};
