import type { NextConfig } from 'next';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_DOMAIN = SUPABASE_URL
  ? new URL(SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase 도메인
      ...(SUPABASE_DOMAIN
        ? [
            {
              protocol: 'https' as const,
              hostname: SUPABASE_DOMAIN,
            },
          ]
        : []),
      // 기타 외부 이미지 도메인들
      {
        protocol: 'https' as const,
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'hjjhgiuoyjsmhzsnogmg.supabase.co',
      },
      {
        protocol: 'https' as const,
        hostname: 'example.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;
