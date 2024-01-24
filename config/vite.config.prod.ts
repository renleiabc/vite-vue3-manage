import { defineConfig } from 'vite';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configImageminPlugin from './plugin/imagemin';

export default defineConfig({
  mode: 'production',
  plugins: [
    configCompressPlugin('gzip'),
    configVisualizerPlugin(),
    configArcoResolverPlugin(),
    configImageminPlugin(),
  ],
  css: {
    devSourcemap: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          arco: ['@arco-design/web-vue'],
          chart: ['echarts', 'vue-echarts'],
          vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
});
