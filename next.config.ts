import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
