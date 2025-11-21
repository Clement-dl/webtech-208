import 'dotenv/config'; // installe dotenv si ce n'est pas déjà fait avec `npm install dotenv`

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL n'est pas défini !");
}

const supabaseHost = new URL(supabaseUrl).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
      { protocol: 'https', hostname: 'www.abusdecine.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.ecranlarge.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
