import { v4 as uuidv4 } from 'uuid';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Tắt strict mode để giảm các warning không cần thiết
    reactStrictMode: false,
    
    // Bỏ qua lỗi TypeScript
    typescript: {
        ignoreBuildErrors: true
    },
    
    // Bỏ qua lỗi ESLint
    eslint: {
        ignoreDuringBuilds: true
    },

    generateBuildId: async () => {
        return uuidv4(); // hoặc return 'custom-build-id' nếu bạn muốn cố định
    },

    // Các cấu hình khác...
    onDemandEntries: {
        // Thời gian trang được giữ trong bộ nhớ
        maxInactiveAge: 25 * 1000,
        // Số lượng trang được giữ trong bộ nhớ
        pagesBufferLength: 2,
    },

    // Bỏ qua lỗi runtime trong production
    productionBrowserSourceMaps: false,
    
    // Bỏ qua lỗi trong quá trình build
    swcMinify: true,

    // Tắt hiển thị lỗi trong development
    devIndicators: {
        buildActivity: false
    },

    // Tắt overlay hiển thị lỗi
    webpackDevMiddleware: config => {
        config.dev = {
            ...config.dev,
            overlay: false
        };
        return config;
    }
};

export default nextConfig;
