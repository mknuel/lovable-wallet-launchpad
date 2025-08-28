
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { fileURLToPath } from "url";
import svgr from "vite-plugin-svgr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [
		react(),
		svgr(),
		tailwindcss(),
		mode === "development" && componentTagger(),
	].filter(Boolean),
	server: {
		host: "::",
		allowedHosts: true,
		port: 8080,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			onwarn(warning, warn) {
				if (warning.message.includes("@__PURE__")) return;
				warn(warning);
			},
		},
	},
}));

