import type { NextConfig } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_DOMAIN = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    domains: SUPABASE_DOMAIN ? [SUPABASE_DOMAIN] : [],
  },
};

export default nextConfig;
