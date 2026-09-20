import type { CardItem } from '@/cards.ts';
import { Card } from '@/components/card.tsx';

interface CardStageProps {
    cards: CardItem[];
}

export const CardStage = ({ cards }: CardStageProps) => {
    // 2 cards = original layout; 3-4 fit one row on >=992px, more wrap in rows of 4
    const perRow = Math.min(Math.max(cards.length, 2), 4);
    const wrap = cards.length > 2 ? ' phone-stage--wrap' : '';

    return (
        <div class={`phone-stage animated fadeInUp${wrap}`} data-per-row={perRow}>
            {cards.map((card, index) => (
                <Card key={index} card={card} />
            ))}
        </div>
    );
};
