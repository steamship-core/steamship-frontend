/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
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
        border: "hsl(var(--steamship-border))",
        input: "hsl(var(--steamship-input))",
        ring: "hsl(var(--steamship-ring))",
        background: "hsl(var(--steamship-background))",
        foreground: "hsl(var(--steamship-foreground))",
        primary: {
          DEFAULT: "hsl(var(--steamship-primary))",
          foreground: "hsl(var(--steamship-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--steamship-secondary))",
          foreground: "hsl(var(--steamship-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--steamship-destructive))",
          foreground: "hsl(var(--steamship-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--steamship-muted))",
          foreground: "hsl(var(--steamship-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--steamship-accent))",
          foreground: "hsl(var(--steamship-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--steamship-popover))",
          foreground: "hsl(var(--steamship-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--steamship-card))",
          foreground: "hsl(var(--steamship-card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--steamship-radius)",
        md: "calc(var(--steamship-radius) - 2px)",
        sm: "calc(var(--steamship-radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
