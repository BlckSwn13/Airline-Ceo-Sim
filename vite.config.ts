import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the Airline CEO Simulator project.
// We enable TypeScript, React and configure alias resolution.  
// The build outputs to the default `dist` folder.  
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": "/src/components",
      "@hooks": "/src/hooks",
      "@types": "/src/types"
    }
  },
  define: {
    // Expose environment variables at build time.  
    // At runtime, values such as VITE_OPENAI_KEY are read from Netlify.  
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  server: {
    port: 5173,
    open: true
  }
});