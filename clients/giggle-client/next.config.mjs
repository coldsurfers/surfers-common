import withTwin from './withTwin.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
}

export default withTwin(nextConfig)
