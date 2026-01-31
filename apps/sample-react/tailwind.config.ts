import type { Config } from "tailwindcss"
import { dynamicIconsPlugin } from "@egoist/tailwindcss-icons"

export default {
  plugins: [dynamicIconsPlugin()],
} satisfies Config