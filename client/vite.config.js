import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: isDevelopment
            ? "http://localhost:8080"
            : "https://chatapp-api-six.vercel.app",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },
    plugins: [react()],
    define: {
      "process.env": {
        NODE_ENV: mode,
      },
    },
  };
});
