import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          dark: "hsl(var(--secondary-dark))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        'gradient-saffron': 'var(--gradient-saffron)',
        'gradient-teal': 'var(--gradient-teal)',
        'gradient-warm': 'var(--gradient-warm)',
        'gradient-card': 'var(--gradient-card)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'strong': 'var(--shadow-strong)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float-slow": {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px) scale(1)",
            opacity: "0.1",
          },
          "25%": {
            transform: "translateY(-20px) translateX(10px) scale(1.05)",
            opacity: "0.15",
          },
          "50%": {
            transform: "translateY(-10px) translateX(-5px) scale(0.95)",
            opacity: "0.2",
          },
          "75%": {
            transform: "translateY(-30px) translateX(15px) scale(1.1)",
            opacity: "0.12",
          },
        },
        "float-medium": {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px) rotate(0deg)",
            opacity: "0.12",
          },
          "33%": {
            transform: "translateY(-15px) translateX(-10px) rotate(2deg)",
            opacity: "0.18",
          },
          "66%": {
            transform: "translateY(-25px) translateX(8px) rotate(-1deg)",
            opacity: "0.15",
          },
        },
        "float-fast": {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px) scale(1) rotate(0deg)",
            opacity: "0.08",
          },
          "20%": {
            transform: "translateY(-12px) translateX(6px) scale(1.02) rotate(1deg)",
            opacity: "0.15",
          },
          "40%": {
            transform: "translateY(-8px) translateX(-4px) scale(0.98) rotate(-0.5deg)",
            opacity: "0.12",
          },
          "60%": {
            transform: "translateY(-18px) translateX(10px) scale(1.05) rotate(1.5deg)",
            opacity: "0.18",
          },
          "80%": {
            transform: "translateY(-5px) translateX(-8px) scale(0.95) rotate(-1deg)",
            opacity: "0.1",
          },
        },
        "float": {
          "0%, 100%": { 
            transform: "translateY(0px) rotate(0deg)",
            opacity: "0.3"
          },
          "25%": { 
            transform: "translateY(-20px) rotate(5deg)",
            opacity: "0.5"
          },
          "50%": { 
            transform: "translateY(-40px) rotate(-5deg)",
            opacity: "0.4"
          },
          "75%": { 
            transform: "translateY(-20px) rotate(3deg)",
            opacity: "0.6"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-medium": "float-medium 6s ease-in-out infinite",
        "float-fast": "float-fast 4s ease-in-out infinite",
        "float": "float 20s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
