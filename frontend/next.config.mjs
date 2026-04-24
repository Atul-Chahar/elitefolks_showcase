import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            '@headlessui/react',
            'recharts',
            'appwrite',
            'node-appwrite',
            'react-icons/si',
            'react-icons/fa',
            'react-icons/lu',
            'react-icons/go',
            'react-icons/md',
            'react-icons/fa6'
        ],
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'ui-avatars.com' },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/v1/telemetry/static/:path*',
                destination: 'https://us-assets.i.posthog.com/static/:path*',
            },
            {
                source: '/api/v1/telemetry/:path*',
                destination: 'https://us.i.posthog.com/:path*',
            },
            {
                source: '/api/v1/telemetry/decide',
                destination: 'https://us.i.posthog.com/decide',
            },
        ];
    },
};

export default nextConfig;
