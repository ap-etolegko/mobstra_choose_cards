import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { getContactAction, submitContact, type ContactFields } from '@/contact.ts';
import { FORM } from '@/content.ts';

export type SnackbarState =
    { kind: 'hidden' } | { kind: 'sending' } | { kind: 'result'; code: string };

type Field = keyof ContactFields;
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'success';

// regula's @Email pattern, verbatim
const EMAIL =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const EMPTY: ContactFields = { name: '', email: '', question: '' };
const FIELDS: Field[] = ['name', 'email', 'question'];
// rd-mailform hides the result snackbar after 3.5s
const RESULT_TIMEOUT_MS = 3500;

const validateField = (field: Field, value: string): string | undefined => {
    if (value.trim() === '') return FORM.errors.required;
    if (field === 'email' && !EMAIL.test(value)) return FORM.errors.email;
    return undefined;
};

const validateAll = (values: ContactFields): Errors => {
    const errors: Errors = {};
    for (const field of FIELDS) {
        const error = validateField(field, values[field]);
        if (error) errors[field] = error;
    }
    return errors;
};

interface NukaButtonProps {
    sending: boolean;
    children: ComponentChildren;
}

/** .btn-nuka: the hover circle grows from the point where the cursor entered the button. */
const NukaButton = ({ sending, children }: NukaButtonProps) => {
    const overlay = useRef<HTMLSpanElement>(null);
    const place = (event: MouseEvent) => {
        if (!overlay.current) return;
        overlay.current.style.top = `${event.offsetY}px`;
        overlay.current.style.left = `${event.offsetX}px`;
    };
    return (
        <button
            type="submit"
            class="btn btn-round btn-secondary btn-nuka"
            aria-busy={sending}
            onMouseEnter={place}
            onMouseLeave={place}
        >
            {children}
            <span class="btn-overlay" ref={overlay} />
        </button>
    );
};

interface ContactFormProps {
    onSnackbar: (state: SnackbarState) => void;
}

export const ContactForm = ({ onSnackbar }: ContactFormProps) => {
    const [values, setValues] = useState<ContactFields>(EMPTY);
    const [errors, setErrors] = useState<Errors>({});
    const [status, setStatus] = useState<Status>('idle');
    // refs mirror the state so event handlers never read a stale closure (input + submit in one tick)
    const valuesRef = useRef<ContactFields>(EMPTY);
    const statusRef = useRef<Status>('idle');
    const requestId = useRef(0);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const changeStatus = (next: Status) => {
        statusRef.current = next;
        setStatus(next);
    };

    const changeValues = (next: ContactFields) => {
        valuesRef.current = next;
        setValues(next);
    };

    const setFieldError = (field: Field, value: string) =>
        setErrors((prev) => {
            const next = { ...prev };
            const error = validateField(field, value);
            if (error) next[field] = error;
            else delete next[field];
            return next;
        });

    const onInput = (field: Field) => (event: Event) => {
        const value = (event.currentTarget as HTMLInputElement | HTMLTextAreaElement).value;
        changeValues({ ...valuesRef.current, [field]: value });
        // regula re-validates on input only for fields that already show an error
        if (errors[field] && statusRef.current !== 'success') setFieldError(field, value);
    };

    const onBlur = (field: Field) => (event: Event) => {
        // validation is suspended while the form is in its "success" state, as in the original
        if (statusRef.current === 'success') return;
        setFieldError(field, (event.currentTarget as HTMLInputElement | HTMLTextAreaElement).value);
    };

    const onSubmit = async (event: Event) => {
        event.preventDefault();
        if (statusRef.current === 'sending') return;

        const current = valuesRef.current;
        const found = validateAll(current);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        changeStatus('sending');
        onSnackbar({ kind: 'sending' });
        const id = ++requestId.current;
        const code = await submitContact(getContactAction(), current);
        if (id !== requestId.current) return;

        onSnackbar({ kind: 'result', code });
        if (code === 'MF000') {
            changeStatus('success');
            // blur first (validation is suspended), then clear — otherwise empty fields turn red
            (document.activeElement as HTMLElement | null)?.blur();
            changeValues(EMPTY);
        } else {
            changeStatus('idle');
        }
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            onSnackbar({ kind: 'hidden' });
            changeStatus('idle');
        }, RESULT_TIMEOUT_MS);
    };

    const groupClass = (field: Field) => `form-group${errors[field] ? ' has-error' : ''}`;

    return (
        <form class="rd-mailform box-form" noValidate onSubmit={onSubmit}>
            <div class="row row-20 gutters-20">
                <div class="col-xs-6 col-md-12 col-lg-6">
                    <div class={groupClass('name')}>
                        <input
                            class="form-control"
                            type="text"
                            name="name"
                            placeholder={FORM.placeholders.name}
                            value={values.name}
                            aria-invalid={errors.name ? 'true' : undefined}
                            onInput={onInput('name')}
                            onBlur={onBlur('name')}
                        />
                        <span class="form-validation">{errors.name}</span>
                    </div>
                </div>
                <div class="col-xs-6 col-md-12 col-lg-6">
                    <div class={groupClass('email')}>
                        <input
                            class="form-control"
                            type="email"
                            name="email"
                            placeholder={FORM.placeholders.email}
                            value={values.email}
                            aria-invalid={errors.email ? 'true' : undefined}
                            onInput={onInput('email')}
                            onBlur={onBlur('email')}
                        />
                        <span class="form-validation">{errors.email}</span>
                    </div>
                </div>
                <div class="col-12">
                    <div class={groupClass('question')}>
                        <textarea
                            class="form-control"
                            name="question"
                            rows={5}
                            placeholder={FORM.placeholders.question}
                            value={values.question}
                            aria-invalid={errors.question ? 'true' : undefined}
                            onInput={onInput('question')}
                            onBlur={onBlur('question')}
                        />
                        <span class="form-validation">{errors.question}</span>
                    </div>
                </div>
            </div>
            <div class="box-btn">
                <NukaButton sending={status === 'sending'}>{FORM.submit}</NukaButton>
            </div>
        </form>
    );
};
