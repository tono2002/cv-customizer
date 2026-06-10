/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["puppeteer", "@anthropic-ai/sdk"],
  },
};

export default nextConfig;
