// Path data copied verbatim from the original bundle (index.html, .wave-dark svg).
// No transform-box: the CSS transform-origin percentages rely on the default view-box.
const WAVE_1 =
    'M1920 463.314V713H0V414.325C0.0515862 414.316 0.103105 414.308 0.154556 414.299C59.8232 467.769 270.664 573.445 636.676 568.392C873.316 565.126 1040.4 505.514 1188.57 452.65C1326.86 403.309 1448.68 359.846 1595.21 373.565C1727.41 385.944 1837.94 423.471 1920 463.314Z';
const WAVE_2 =
    'M1920 463.988V713H0V234.66C102.275 199.182 221.353 170.486 354.422 158.026C584.381 136.494 775.567 204.707 992.611 282.146C1225.15 365.113 1373 457.092 1858.75 463.796C1879.49 464.082 1899.9 464.142 1920 463.988Z';
const WAVE_3 =
    'M1920 85.9538V713H0V310.063C15.2357 310.099 30.6508 310.012 46.2454 309.796C417.632 304.67 679.852 211.113 912.389 128.146C1129.43 50.7068 1320.62 -17.5061 1550.58 4.02629C1690.21 17.1004 1814.43 48.0502 1920 85.9538Z';

export const Waves = () => (
    <svg
        class="wave-dark"
        width="1920"
        height="713"
        viewBox="0 0 1920 713"
        fill="none"
        aria-hidden="true"
        focusable="false"
    >
        <path class="wave-path wave-path-1" d={WAVE_1} fill="white" />
        <path class="wave-path wave-path-2" d={WAVE_2} fill="white" />
        <path class="wave-path wave-path-3" d={WAVE_3} fill="white" />
    </svg>
);
