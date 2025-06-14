/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  safelist: [
    // widths & heights generated at runtime for hearts/confetti
    { pattern: /^w-(4|5|6|8|10|12|14|16|20|24|32)$/ },
    { pattern: /^h-(4|5|6|8|10|12|14|16|20|24|32)$/ },
    // text / bg colour utility classes we create dynamically
    { pattern: /^text-(pink|red|purple)-(100|200|300|400|500)$/ },
    { pattern: /^bg-(pink|purple|rose|yellow|blue|green|red)-(100|200|300|400|500)$/ },
  ],
};
