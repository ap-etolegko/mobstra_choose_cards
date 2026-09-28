export interface ContactFields {
    name: string;
    email: string;
    question: string;
}

const MF_CODE = /^MF\d{3}$/;

/** Endpoint from index.html; '' means "do not send, just show success". */
export const getContactAction = (): string =>
    typeof window.CONTACT_FORM_ACTION === 'string' ? window.CONTACT_FORM_ACTION.trim() : '';

/**
 * POSTs the form the way rd-mailform did and resolves with an MF code.
 * Any 2xx without an MF code in the body counts as success (works with plain webhooks too).
 */
export const submitContact = async (action: string, fields: ContactFields): Promise<string> => {
    if (action === '') return 'MF000';

    const body = new FormData();
    body.append('name', fields.name);
    body.append('email', fields.email);
    body.append('question', fields.question);
    body.append('form-type', 'contact');

    try {
        const response = await fetch(action, { method: 'POST', body });
        if (!response.ok) return 'MF255';
        const text = (await response.text()).trim();
        return MF_CODE.test(text) ? text : 'MF000';
    } catch {
        return 'MF255';
    }
};
