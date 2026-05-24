import { withMysticUI } from "mystic-ui/tailwind/setup";
import type { Config } from "tailwindcss";

const config = withMysticUI({
  darkMode: "selector",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        copper: "#B45309",
        signal: "#047857",
      },
    },
  },
}) satisfies Config;

export default config;
