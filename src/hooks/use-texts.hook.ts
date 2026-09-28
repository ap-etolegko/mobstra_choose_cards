import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { Texts } from '@/texts.ts';

export const TextsContext = createContext<Texts | null>(null);

/** Texts validated from window.TEXTS, provided once by <App>. */
export const useTexts = (): Texts => {
    const texts = useContext(TextsContext);
    if (!texts) throw new Error('useTexts() called outside <TextsContext.Provider>');
    return texts;
};
