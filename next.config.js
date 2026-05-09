/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Don't block builds on lint warnings during hackathon
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
