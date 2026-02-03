import { defineConfig } from "tsup";

export default defineConfig((opts) => ({
	entryPoints: ["src/**/index.ts"],
	splitting: true,
	format: ["esm"],
	dts: true,
	clean: !opts.watch,
	minify: false,
	outDir: "dist",
	sourcemap: true,
	target: "es2024",
}));
