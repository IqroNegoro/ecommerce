/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{html,js,vue}"],
  theme: {
    extend: {
      fontFamily: {
        "nunito": ["Nunito", "sans-serif"]
      },
      animation: {
        "entering": "entering ease-in 0.2s",
        "Leaving": "leaving ease-in 0.2s"
      },
      keyframes: {
        "entering": {
          from: {opacity: "0"},
          to: {opacity: "100%"},
        },
        "Leaving": {
          from: {opacity: "100%"},
          to: {opacity: "0"},
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms")
  ],
}

