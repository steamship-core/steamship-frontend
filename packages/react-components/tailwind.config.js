/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "steamship-",
  content: ["./*.tsx", "./**/*.tsx"],
  presets: [require("tailwind-config/preset.js")],
};
