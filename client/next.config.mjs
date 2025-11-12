// next.config.mjs
const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next 15 : utiliser remotePatterns (domains est déprécié)
    remotePatterns: [
      // Toutes les images publiques du bucket Supabase
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
      // (Optionnel) autoriser des sites d'images externes que tu utilises
      { protocol: 'https', hostname: 'www.abusdecine.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.ecranlarge.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
