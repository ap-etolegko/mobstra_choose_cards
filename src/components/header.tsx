import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { useTexts } from '@/hooks/use-texts.hook.ts';
import { animateScrollTo } from '@/lib/scroll.ts';
import type { NavLink } from '@/texts.ts';

/*
 * Port of RD Navbar 2.2.5 as configured on the original site:
 *  - one breakpoint at 1200px: below → "fixed" layout (56px bar + hamburger + off-canvas drawer),
 *    at/above → "static" layout that sticks (position: fixed) as soon as the page is scrolled;
 *  - stick-up is disabled on iOS, as in the original;
 *  - anchor links scroll smoothly (400ms, swing) and the current section's item is highlighted.
 */

type Layout = 'static' | 'fixed';

const STATIC_QUERY = '(min-width: 1200px)';
const IS_IOS = /iP(hone|ad|od)/.test(navigator.userAgent);
const ANCHOR_SCROLL_MS = 400;

const useLayout = (): Layout => {
    const [layout, setLayout] = useState<Layout>(() =>
        window.matchMedia(STATIC_QUERY).matches ? 'static' : 'fixed'
    );

    useEffect(() => {
        const query = window.matchMedia(STATIC_QUERY);
        const update = () => setLayout(query.matches ? 'static' : 'fixed');
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    return layout;
};

const useStickUp = (enabled: boolean): boolean => {
    const [stuck, setStuck] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setStuck(false);
            return;
        }
        // original stickUpOffset: '1px'
        const update = () => setStuck(window.scrollY >= 1);
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [enabled]);

    return enabled && stuck;
};

const useActiveAnchor = (nav: NavLink[]): string | null => {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        const lastHref = nav[nav.length - 1].href;
        const update = () => {
            const scrollTop = window.scrollY;
            // Near the document bottom the last anchor wins (upstream RD Navbar behaviour).
            if (scrollTop + window.innerHeight > document.documentElement.scrollHeight - 50) {
                setActive(lastHref);
                return;
            }
            for (const link of nav) {
                const target = document.querySelector<HTMLElement>(link.href);
                if (!target) continue;
                const top = target.getBoundingClientRect().top + scrollTop;
                if (top <= scrollTop && top + target.offsetHeight > scrollTop) {
                    setActive(link.href);
                    return;
                }
            }
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [nav]);

    return active;
};

export const Header = () => {
    const layout = useLayout();
    const stuck = useStickUp(layout === 'static' && !IS_IOS);
    const { logo, nav, menuLabel } = useTexts();
    const active = useActiveAnchor(nav);
    const [open, setOpen] = useState(false);

    const wrapRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const stuckRef = useRef(stuck);
    stuckRef.current = stuck;

    // linkedElements: ["html"] → html.rd-navbar-<layout>-linked (drives .page padding-top in fixed mode)
    useLayoutEffect(() => {
        const className = `rd-navbar-${layout}-linked`;
        document.documentElement.classList.add(className);
        return () => document.documentElement.classList.remove(className);
    }, [layout]);

    // autoHeight: keep the wrapper as tall as the nav so nothing jumps when the nav goes fixed
    useLayoutEffect(() => {
        const wrap = wrapRef.current;
        const nav = navRef.current;
        if (!wrap || !nav) return;
        if (layout !== 'static') {
            wrap.style.height = '';
            return;
        }
        const measure = () => {
            if (!stuckRef.current) wrap.style.height = `${nav.offsetHeight}px`;
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(nav);
        return () => {
            observer.disconnect();
            wrap.style.height = '';
        };
    }, [layout]);

    useEffect(() => setOpen(false), [layout]);

    // Click anywhere outside the <nav> closes the drawer (links inside keep it open, as in the original).
    useEffect(() => {
        if (!open) return;
        const close = (event: MouseEvent) => {
            if (!navRef.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [open]);

    const onAnchorClick = (event: MouseEvent) => {
        const href = (event.currentTarget as HTMLAnchorElement).getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;
        event.preventDefault();
        // anchorNavOffset 0 + the original's hard-coded +1px
        const top = target.getBoundingClientRect().top + window.scrollY + 1;
        void animateScrollTo(top, ANCHOR_SCROLL_MS).then((finished) => {
            if (!finished) return;
            try {
                history.pushState({ anchorId: href }, '', href);
            } catch {
                // history is unavailable on file:// — ignore
            }
        });
    };

    const navClass = `rd-navbar rd-navbar-dark rd-navbar-original rd-navbar-${layout}${
        stuck ? ' rd-navbar--is-stuck' : ''
    }`;

    return (
        <header>
            <div class="rd-navbar-wrap bg-800" ref={wrapRef}>
                <nav class={navClass} ref={navRef}>
                    <div class="rd-navbar-main-outer">
                        <div class="rd-navbar-main">
                            <div class="rd-navbar-panel">
                                <button
                                    type="button"
                                    class={`rd-navbar-toggle${open ? ' active' : ''}`}
                                    aria-label={menuLabel}
                                    aria-expanded={open}
                                    aria-controls="rd-navbar-nav"
                                    onClick={() => setOpen((value) => !value)}
                                >
                                    <span />
                                </button>
                                <div class="rd-navbar-brand">
                                    <a class="logo-link" href={logo.href}>
                                        <img
                                            src={logo.src}
                                            alt={logo.alt}
                                            width={logo.width}
                                            height={logo.height}
                                        />
                                    </a>
                                </div>
                            </div>
                            <div class="rd-navbar-main-element">
                                <div
                                    id="rd-navbar-nav"
                                    class={`rd-navbar-nav-wrap${open ? ' active' : ''}`}
                                >
                                    <ul class="rd-navbar-nav">
                                        {nav.map((link) => (
                                            <li
                                                key={link.href}
                                                class={`rd-nav-item${active === link.href ? ' active' : ''}`}
                                            >
                                                <a
                                                    class="rd-nav-link"
                                                    href={link.href}
                                                    onClick={onAnchorClick}
                                                >
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};
