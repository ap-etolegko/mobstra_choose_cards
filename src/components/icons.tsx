// Inline replacements for the FontAwesome / Material Design Icons glyphs used by the original.
interface IconProps {
    class?: string;
}

const svgProps = {
    viewBox: '0 0 24 24',
    width: '1em',
    height: '1em',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true'
} as const;

/** fa-circle-o-notch fa-spin */
export const SpinnerIcon = ({ class: cls = '' }: IconProps) => (
    <svg {...svgProps} class={`${cls} snackbar-icon--spin`.trim()}>
        <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
);

/** mdi-check */
export const CheckIcon = ({ class: cls }: IconProps) => (
    <svg {...svgProps} class={cls}>
        <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
);

/** mdi-alert-outline */
export const AlertIcon = ({ class: cls }: IconProps) => (
    <svg {...svgProps} class={cls}>
        <path d="M12 3.5 2.5 20.5h19L12 3.5z" />
        <path d="M12 9.5v5M12 17.5v.5" />
    </svg>
);

/** fa-angle-up */
export const ChevronUpIcon = ({ class: cls }: IconProps) => (
    <svg {...svgProps} class={cls} stroke-width="3">
        <path d="M6 15l6-6 6 6" />
    </svg>
);
