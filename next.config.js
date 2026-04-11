/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from Google (for user profile photos)
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
