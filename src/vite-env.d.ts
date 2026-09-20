/// <reference types="vite/client" />

interface Window {
    /** Cards payload declared inline in index.html. Validated at runtime by loadCards(). */
    CARDS?: unknown;
    /** Contact form endpoint declared inline in index.html. Empty string = no request. */
    CONTACT_FORM_ACTION?: unknown;
}
