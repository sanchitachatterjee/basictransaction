// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      turbopack: false,
    },
    images: {
      domains: ['your-image-host.com'],
    },
  };
  
  export default nextConfig;
  