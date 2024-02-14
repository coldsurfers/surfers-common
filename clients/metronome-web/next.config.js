/** @type {import('next').NextConfig} */

const path = require('path')

const nextConfig = {
  output: 'standalone',
  experimental: {
    externalDir: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  webpack: (config) => {
    return config
  },
}

module.exports = nextConfig
