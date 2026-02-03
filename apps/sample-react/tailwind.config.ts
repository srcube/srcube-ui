import { dynamicIconsPlugin } from "@egoist/tailwindcss-icons";
import type { Config } from "tailwindcss";

export default {
	plugins: [dynamicIconsPlugin()],
} satisfies Config;
