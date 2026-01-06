/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.9816 0 0)',
        foreground: 'oklch(0.1221 0 0)',
        card: 'oklch(0.9911 0 0)',
        'card-foreground': 'oklch(0.1221 0 0)',
        primary: 'oklch(0.6498 0.1868 29.2339)',
        'primary-foreground': 'oklch(0.9911 0 0)',
        secondary: 'oklch(0.5793 0.2508 260.8178)',
        'secondary-foreground': 'oklch(0.9911 0 0)',
        muted: 'oklch(0.9700 0 0)',
        'muted-foreground': 'oklch(0.5560 0 0)',
        accent: 'oklch(0.6036 0.2461 142.4953)',
        'accent-foreground': 'oklch(0.9911 0 0)',
        destructive: 'oklch(0.6498 0.1868 25.2339)',
        'destructive-foreground': 'oklch(0.9911 0 0)',
        border: 'oklch(0.9288 0 0)',
        input: 'oklch(0.9491 0 0)',
        ring: 'oklch(0.6498 0.1868 29.2339)',
      },
      borderRadius: {
        lg: '1.25rem',
        md: '1rem',
        sm: '0.75rem',
      },
      boxShadow: {
        'smooth': '0 4px 20px 0px hsl(0 0% 0% / 0.05)',
        'smooth-hover': '0 10px 30px 0px hsl(0 0% 0% / 0.1)',
      },
    },
  },
  plugins: [],
}