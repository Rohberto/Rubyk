/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'rubyk.co' },
      { hostname: 'substackcdn.com' },
      { hostname: 'substack-post-media.s3.amazonaws.com' },
    ],
  },
}

module.exports = nextConfig
