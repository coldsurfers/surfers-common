/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    externalDir: true,
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
