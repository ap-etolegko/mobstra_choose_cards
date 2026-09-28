import type { ComponentChild } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { ContactForm, type SnackbarState } from '@/components/contact-form.tsx';
import { AlertIcon, CheckIcon, SpinnerIcon } from '@/components/icons.tsx';
import { Waves } from '@/components/waves.tsx';
import { ANIMATE_IN_VIEW_CLASS, useAnimateInView } from '@/hooks/use-animate-in-view.hook.ts';
import { useTexts } from '@/hooks/use-texts.hook.ts';

interface SnackbarContent {
    icon: ComponentChild;
    text: string;
}

/**
 * .form-output.snackbar — fixed bottom-left, slides in while active.
 * Must NOT be rendered inside an animated (transformed) ancestor, otherwise position: fixed breaks.
 */
const Snackbar = ({ state }: { state: SnackbarState }) => {
    // keep the last content so the slide-out is not an empty box
    const last = useRef<SnackbarContent | null>(null);
    const { form, messages } = useTexts();
    if (state.kind === 'sending') {
        last.current = { icon: <SpinnerIcon class="icon snackbar-icon" />, text: form.sending };
    } else if (state.kind === 'result') {
        last.current =
            state.code === 'MF000'
                ? { icon: <CheckIcon class="icon snackbar-icon" />, text: messages.MF000 }
                : {
                      icon: <AlertIcon class="icon snackbar-icon" />,
                      text: messages[state.code] ?? messages.MF255
                  };
    }
    const content = last.current;

    return (
        <div
            class={`form-output snackbar snackbar-secondary${state.kind !== 'hidden' ? ' active' : ''}`}
            role="status"
            aria-live="polite"
        >
            {content && (
                <div class="snackbar-inner">
                    <div class="snackbar-title">
                        {content.icon}
                        {content.text}
                    </div>
                </div>
            )}
        </div>
    );
};

export const Footer = () => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({ kind: 'hidden' });
    const textAnimation = useAnimateInView<HTMLDivElement>();
    const formAnimation = useAnimateInView<HTMLDivElement>();
    const year = new Date().getFullYear();
    const { contact, footer, nav } = useTexts();

    return (
        <footer class="footer bg-800 context-dark text-500 text-center position-relative pb-5">
            <Waves />
            <div class="container" id="contacts">
                <div class="row row-30 align-items-center">
                    <div
                        ref={textAnimation.ref}
                        data-animate=""
                        class={`col-md-4 col-lg-5 ${textAnimation.animated ? ANIMATE_IN_VIEW_CLASS : ''}`}
                    >
                        <h6>{contact.eyebrow}</h6>
                        <h2>{contact.title}</h2>
                        <p class="lead">{contact.lead}</p>
                    </div>
                    <div
                        ref={formAnimation.ref}
                        data-animate=""
                        class={`col-md-8 col-lg-7 ${formAnimation.animated ? ANIMATE_IN_VIEW_CLASS : ''}`}
                    >
                        <article class="box ml-xl-5">
                            <ContactForm onSnackbar={setSnackbar} />
                        </article>
                    </div>
                    <Snackbar state={snackbar} />
                </div>
            </div>

            <hr class="divider divider-sm footer-divider" />
            <div class="container">
                <div class="footer-panel">
                    <div class="group-x-30 group-y-10 d-flex flex-wrap align-items-center justify-content-center justify-content-xxl-between">
                        <div>
                            <ul class="list footer-list">
                                {nav.map((link) => (
                                    <li class="list-item" key={link.href}>
                                        <a class="list-link" href={link.href}>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <p class="rights text-xxl-left mt-2">
                        {footer.company}
                        <br />
                        {footer.reg}
                        <br />
                        {footer.address}
                        <br />
                        {footer.phoneLabel} <a href={`tel:${footer.phone}`}>{footer.phone}</a>
                    </p>
                    <p class="rights text-xxl-left mt-2">
                        <span>
                            © {footer.since} — {year} &nbsp;
                        </span>
                        <span>{footer.brand}</span>
                        <span>. {footer.rights}</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
