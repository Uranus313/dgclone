/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.escuelajs.co',
                port: '',
                pathname: '/api/v1/files/**',
            },
        ],
    },
}

module.exports = nextConfig

