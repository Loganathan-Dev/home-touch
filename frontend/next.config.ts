import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabling these experimental features fixes the Next.js 16 validation bugs
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;