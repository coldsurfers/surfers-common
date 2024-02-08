/** @type {import('next').NextConfig} */

const path = require('path')

const nextConfig = {
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web',
      'styled-components': path.resolve(
        __dirname,
        './node_modules/styled-components'
      ),
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]

    return config
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
