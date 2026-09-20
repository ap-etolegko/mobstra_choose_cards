interface CardsErrorProps {
    message: string;
}

export const CardsError = ({ message }: CardsErrorProps) => (
    <main class="cards-error" role="alert">
        <h1>window.CARDS error</h1>
        <pre>{message}</pre>
        <p>Fix the array in the &lt;script&gt; inside index.html and reload.</p>
    </main>
);
