export default {
  // Base URL for assets and sources
  base: "/",

  // Configure Vite plugins or custom behavior
  plugins: [],

  // Define custom build options
  build: {
    // Output directory for production builds
    outDir: "dist",

    // Emit index.html as-is without any transformations
    rollupOptions: {
      input: {
        // Your main entry point (index.html)
        index: "/index.html",
        // Your watchlist entry point (pages/watchlist.html)
        watchlist: "/pages/watchlist.html",
      },
    },
  },
};
