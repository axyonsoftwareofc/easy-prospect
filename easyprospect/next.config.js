/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  // ADICIONE ESTAS LINHAS:
  trailingSlash: false,
  output: 'standalone', // ou 'export' se quiser static
}

module.exports = nextConfig