import type { CardItem } from '@/cards.ts';

interface CardProps {
    card: CardItem;
}

export const Card = ({ card }: CardProps) => (
    <a class="phone" href={card.href} aria-label={card.title}>
        <img src={card.image} alt={card.title} decoding="async" />
    </a>
);
