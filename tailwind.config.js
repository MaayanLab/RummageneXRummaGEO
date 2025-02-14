/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ["Comic Sans MS", "Comic Sans", "system-ui"],
      mono: ["Comic Mono", "system-ui"],
    },
    extend: {
      borderWidth: {
        '3': '3px', 
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
     'light'
    ],
  },

}