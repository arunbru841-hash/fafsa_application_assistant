import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ===== U.S. Web Design System (USWDS) Colors =====
        // Used by StudentAid.gov - Exact Color Values
        
        // Primary - Navy Blue (Federal Standard)
        primary: {
          lightest: '#eff6fb',
          lighter: '#d9e8f6',
          light: '#73b3e7',
          DEFAULT: '#005ea2',
          vivid: '#0050d8',
          dark: '#1a4480',
          darker: '#162e51',
          darkest: '#0b1526',
          50: '#eff6fb',
          100: '#d9e8f6',
          200: '#a9cce9',
          300: '#73b3e7',
          400: '#2378c3',
          500: '#005ea2',
          600: '#0050d8',
          700: '#1a4480',
          800: '#162e51',
          900: '#0b1526',
          950: '#050d18',
        },
        // Secondary - Red (USWDS Secondary)
        secondary: {
          lightest: '#fef2f2',
          lighter: '#f3e1e4',
          light: '#f2938c',
          DEFAULT: '#d83933',
          vivid: '#e41d3d',
          dark: '#b50909',
          darker: '#8b0a03',
          50: '#fef2f2',
          100: '#f3e1e4',
          200: '#f2a9a5',
          300: '#f2938c',
          400: '#e52207',
          500: '#d83933',
          600: '#b50909',
          700: '#8b0a03',
          800: '#5c0000',
          900: '#3d0000',
        },
        // Accent Cool - Cyan/Teal (StudentAid.gov accent)
        'accent-cool': {
          lightest: '#f0f9fb',
          lighter: '#e1f3f8',
          light: '#97d4ea',
          DEFAULT: '#00bde3',
          dark: '#28a0cb',
          darker: '#07648d',
          darkest: '#002d3f',
          50: '#f0f9fb',
          100: '#e1f3f8',
          200: '#b8e4f4',
          300: '#97d4ea',
          400: '#52c5e8',
          500: '#00bde3',
          600: '#28a0cb',
          700: '#07648d',
          800: '#074b69',
          900: '#002d3f',
        },
        // Accent Warm - Orange (USWDS accent warm)
        'accent-warm': {
          lightest: '#f2e4d4',
          lighter: '#f2e4d4',
          light: '#ffbc78',
          DEFAULT: '#fa9441',
          dark: '#c05600',
          darker: '#775540',
          50: '#f2e4d4',
          100: '#f2e4d4',
          200: '#ffbc78',
          300: '#ffbc78',
          400: '#fa9441',
          500: '#fa9441',
          600: '#c05600',
          700: '#775540',
        },
        // Success - Use Primary Blue instead of green (FAFSA doesn't use green)
        success: {
          lightest: '#d9e8f6',
          lighter: '#73b3e7',
          light: '#2378c3',
          DEFAULT: '#005ea2',
          dark: '#1a4480',
          darker: '#162e51',
          50: '#d9e8f6',
          100: '#d9e8f6',
          200: '#73b3e7',
          500: '#005ea2',
          600: '#1a4480',
          700: '#162e51',
        },
        // Warning - Gold/Yellow (USWDS)
        warning: {
          lightest: '#fef0c8',
          lighter: '#ffe396',
          light: '#ffbe2e',
          DEFAULT: '#e5a000',
          dark: '#936f38',
          darker: '#7a591a',
          50: '#fef0c8',
          100: '#ffe396',
          500: '#e5a000',
          600: '#936f38',
          700: '#7a591a',
        },
        // Error - Red (USWDS)
        error: {
          lightest: '#f4e3db',
          lighter: '#f39268',
          light: '#f39268',
          DEFAULT: '#d54309',
          dark: '#b50909',
          darker: '#6f3331',
          50: '#f4e3db',
          100: '#f4e3db',
          200: '#f39268',
          500: '#d54309',
          600: '#b50909',
          700: '#6f3331',
        },
        // Base/Neutral - Gray (USWDS Base)
        base: {
          lightest: '#f0f0f0',
          lighter: '#dfe1e2',
          light: '#a9aeb1',
          DEFAULT: '#71767a',
          dark: '#565c65',
          darker: '#3d4551',
          darkest: '#1b1b1b',
          50: '#f0f0f0',
          100: '#dfe1e2',
          200: '#c6cace',
          300: '#a9aeb1',
          400: '#8d9297',
          500: '#71767a',
          600: '#565c65',
          700: '#3d4551',
          800: '#2d2d2d',
          900: '#1b1b1b',
          950: '#0d0d0d',
        },
        // Keep neutral as alias for compatibility
        neutral: {
          50: '#f0f0f0',
          100: '#dfe1e2',
          200: '#c6cace',
          300: '#a9aeb1',
          400: '#8d9297',
          500: '#71767a',
          600: '#565c65',
          700: '#3d4551',
          800: '#2d2d2d',
          900: '#1b1b1b',
          950: '#0d0d0d',
        },
        // Ink - Dark text color
        ink: '#1b1b1b',
        // White
        white: '#ffffff',
      },
      fontFamily: {
        // USWDS uses Source Sans Pro and Merriweather
        sans: ['Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Roboto', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        display: ['Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(8, 145, 178, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [
    forms,
    typography,
  ],
}

export default config
