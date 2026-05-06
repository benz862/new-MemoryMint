import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        brand: "var(--brand)",
        "brand-hover": "var(--brand-hover)",
        "sunset-mid": "var(--sunset-mid)",
        "hero-deep": "var(--hero-deep)",
        "showcase-ivory": "#F7F3EE",
        "showcase-charcoal": "#1E1E1E",
        "showcase-teal": "#6FB7B2",
        "showcase-gold": "#D4AF63",
        "showcase-divider": "#E5DDD3",
        "showcase-mist": "#EDE8E1",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
