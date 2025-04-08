import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/rubik-solver" : "",
};

export default nextConfig;
