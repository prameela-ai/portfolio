import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on the AIAGENTECHX droplet (aiagentechx-infra, service
  // `prameela-portfolio-web`). The Dockerfile runs .next/standalone/server.js
  // and fails the image build if this is missing.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
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
