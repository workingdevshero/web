/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors from Hero mascot
        primary: {
          DEFAULT: '#4A1942',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#7C3AED',
          600: '#4A1942',
          700: '#3D1536',
          800: '#2E1029',
          900: '#1E0A1B',
        },
        // Secondary purple accent
        secondary: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Accent amber/gold for CTAs
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Dark indigo for backgrounds
        dark: {
          DEFAULT: '#1E1B4B',
          50: '#312E81',
          100: '#2E2A6E',
          200: '#28255D',
          300: '#23204D',
          400: '#1E1B4B',
          500: '#1A1740',
          600: '#151336',
          700: '#110F2B',
          800: '#0C0A20',
          900: '#070616',
        },
        // Hero orange from Sidekick mascot
        hero: {
          DEFAULT: '#D35400',
          50: '#FEF2E7',
          100: '#FDE6CF',
          200: '#FBCC9F',
          300: '#F9B36F',
          400: '#F7993F',
          500: '#F58000',
          600: '#D35400',
          700: '#A34100',
          800: '#732E00',
          900: '#431B00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray.700'),
            '--tw-prose-headings': theme('colors.primary.DEFAULT'),
            '--tw-prose-links': theme('colors.secondary.DEFAULT'),
            '--tw-prose-bold': theme('colors.gray.900'),
            '--tw-prose-code': theme('colors.secondary.600'),
            '--tw-prose-pre-bg': theme('colors.dark.DEFAULT'),
            '--tw-prose-pre-code': theme('colors.gray.100'),
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              backgroundColor: theme('colors.primary.50'),
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray.300'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.accent.400'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-code': theme('colors.accent.300'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
