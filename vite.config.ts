import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "popup.html"),
        content: path.resolve(__dirname, "src/content/content.ts"),
        background: path.resolve(__dirname, "src/background/background.ts"),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "popup") return "popup.js";
          if (chunk.name === "content") return "content.js";
          if (chunk.name === "background") return "background.js";
          return "[name].js";
        },
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
