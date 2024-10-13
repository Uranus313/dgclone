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

        domains: ['dkstatics-public.digikala.com'],

    },
}

module.exports = nextConfig

