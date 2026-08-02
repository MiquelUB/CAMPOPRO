import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        tertiary: "#341f00",
        "on-primary-fixed": "#001c3b",
        "secondary-container": "#fe932c",
        surface: "#faf9fc",
        "on-tertiary-container": "#c69b5f",
        "surface-dim": "#dad9dd",
        "surface-container-highest": "#e3e2e6",
        primary: {
          DEFAULT: "#022448",
          foreground: "#ffffff",
        },
        "on-error": "#ffffff",
        secondary: {
          DEFAULT: "#904d00",
          foreground: "#ffffff",
        },
        "primary-fixed-dim": "#adc8f5",
        "surface-container-high": "#e9e7eb",
        "tertiary-fixed-dim": "#edbf7f",
        "on-secondary-fixed": "#2f1500",
        "tertiary-fixed": "#ffddb2",
        "on-primary-container": "#8aa4cf",
        "on-tertiary-fixed-variant": "#60410c",
        "inverse-primary": "#adc8f5",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",
        "primary-fixed": "#d5e3ff",
        "surface-variant": "#e3e2e6",
        "surface-container": "#eeedf1",
        "on-surface": "#1a1c1e",
        "on-error-container": "#93000a",
        "primary-container": "#1e3a5f",
        "secondary-fixed-dim": "#ffb77d",
        "on-primary": "#ffffff",
        outline: "#74777f",
        "error-container": "#ffdad6",
        "surface-tint": "#455f87",
        error: "#ba1a1a",
        "on-primary-fixed-variant": "#2d486d",
        "on-surface-variant": "#43474e",
        "surface-bright": "#faf9fc",
        "surface-container-low": "#f4f3f7",
        "secondary-fixed": "#ffdcc3",
        "tertiary-container": "#503300",
        "on-background": "#1a1c1e",
        "on-secondary-container": "#663500",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#c4c6cf",
        "inverse-surface": "#2f3033",
        "inverse-on-surface": "#f1f0f4",
        "on-tertiary-fixed": "#291800",
        background: "#faf9fc",
        "on-secondary-fixed-variant": "#6e3900",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "sidebar-width": "240px",
        lg: "24px",
        sm: "8px",
        "sidebar-collapsed": "64px",
        xl: "32px",
        gutter: "16px",
        "base-unit": "8px",
        md: "16px",
        xs: "4px"
      },
      fontFamily: {
        "display-lg": ["var(--font-inter)", "sans-serif"],
        "body-base": ["var(--font-inter)", "sans-serif"],
        "label-caps": ["var(--font-inter)", "sans-serif"],
        "section-title": ["var(--font-inter)", "sans-serif"],
        "body-strong": ["var(--font-inter)", "sans-serif"],
        "data-tabular": ["var(--font-inter)", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "body-base": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-caps": ["11px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "section-title": ["22px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-strong": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "data-tabular": ["12px", { lineHeight: "16px", fontWeight: "400" }]
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
