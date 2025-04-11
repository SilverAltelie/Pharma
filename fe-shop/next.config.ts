import { v4 as uuidv4 } from 'uuid';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

    generateBuildId: async () => {
        return uuidv4(); // hoặc return 'custom-build-id' nếu bạn muốn cố định
    },

    // Các cấu hình khác...
    eslint: {
        ignoreDuringBuilds: true,
    },

};

export default nextConfig;
