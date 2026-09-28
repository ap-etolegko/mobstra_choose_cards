interface ConfigErrorProps {
    message: string;
}

/** Shown instead of the page when window.CARDS or window.TEXTS in index.html is broken. */
export const ConfigError = ({ message }: ConfigErrorProps) => (
    <main class="config-error" role="alert">
        <h1>index.html config error</h1>
        <pre>{message}</pre>
        <p>Fix the &lt;script&gt; inside index.html and reload.</p>
    </main>
);
