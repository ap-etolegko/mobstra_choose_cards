// jQuery 'swing' easing, as used by the original RD Navbar / to-top scroll animations.
const swing = (progress: number) => 0.5 - Math.cos(progress * Math.PI) / 2;

const CANCEL_EVENTS = ['wheel', 'touchstart', 'keydown'] as const;

let frame = 0;
let abort: (() => void) | null = null;

/**
 * Animates window scroll to `top`. Resolves with true when finished,
 * false when cancelled by user input or by a newer animateScrollTo() call.
 */
export const animateScrollTo = (top: number, duration: number): Promise<boolean> =>
    new Promise((resolve) => {
        abort?.();

        const start = window.scrollY;
        const delta = top - start;
        const startedAt = performance.now();

        const detach = () =>
            CANCEL_EVENTS.forEach((type) => window.removeEventListener(type, cancel));
        const cancel = () => {
            cancelAnimationFrame(frame);
            detach();
            abort = null;
            resolve(false);
        };
        abort = cancel;
        CANCEL_EVENTS.forEach((type) => window.addEventListener(type, cancel, { passive: true }));

        const step = (now: number) => {
            const progress = Math.min(1, (now - startedAt) / duration);
            window.scrollTo({ top: start + delta * swing(progress), behavior: 'instant' });
            if (progress < 1) {
                frame = requestAnimationFrame(step);
                return;
            }
            detach();
            abort = null;
            resolve(true);
        };
        frame = requestAnimationFrame(step);
    });
