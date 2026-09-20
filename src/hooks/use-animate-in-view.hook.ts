import { useEffect, useRef, useState } from 'preact/hooks';

export const ANIMATE_IN_VIEW_CLASS = 'animated fadeInUp';

/**
 * Port of the theme's [data-animate] component: the element stays hidden (CSS `[data-animate]`)
 * until 50% of it is in the viewport, then `animated` is flipped once.
 * Usage: <div ref={ref} data-animate="" class={animated ? ANIMATE_IN_VIEW_CLASS : ''}>
 */
export const useAnimateInView = <T extends HTMLElement>() => {
    const ref = useRef<T>(null);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || animated) return;
        if (typeof IntersectionObserver === 'undefined') {
            setAnimated(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setAnimated(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [animated]);

    return { ref, animated };
};
