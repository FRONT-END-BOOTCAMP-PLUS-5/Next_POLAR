import type { NextConfig } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_DOMAIN = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: SUPABASE_DOMAIN
      ? [
        {
          protocol: 'https',
          hostname: SUPABASE_DOMAIN,
          // pathname: '/**', // 필요시 전체 경로 허용
        },
      ]
      : [],
    domains: [
      "images.unsplash.com",
      // unplash 이미지로 더미 데이터 활용 위해 추가, 배포 시 삭제해도 됩니다

    ],
  },
};


export default nextConfig;
