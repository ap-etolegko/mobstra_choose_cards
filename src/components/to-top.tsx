import { useEffect, useState } from 'preact/hooks';
import { ChevronUpIcon } from '@/components/icons.tsx';
import { useTexts } from '@/hooks/use-texts.hook.ts';
import { animateScrollTo } from '@/lib/scroll.ts';

const SCROLL_TOP_MS = 500;

/** Appears once the page is scrolled by more than one viewport; hidden on touch devices via CSS. */
export const ToTop = () => {
    const [show, setShow] = useState(false);
    const { toTopLabel } = useTexts();

    useEffect(() => {
        const update = () => setShow(window.scrollY > window.innerHeight);
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <button
            type="button"
            class={`to-top${show ? ' show' : ''}`}
            aria-label={toTopLabel}
            tabIndex={show ? 0 : -1}
            onClick={() => void animateScrollTo(0, SCROLL_TOP_MS)}
        >
            <ChevronUpIcon />
        </button>
    );
};
