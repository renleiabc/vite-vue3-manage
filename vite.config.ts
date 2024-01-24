import { mergeConfig } from 'vite';
import viteConfigbase from './config/vite.config.base';
import viteConfigDev from './config/vite.config.dev';
import viteConfigProd from './config/vite.config.prod';
// https://vitejs.dev/config/
export default ({ mode, command }) => {
  console.log('🚀 ~ file: vite.config.ts:6 ~ mode:', mode);
  console.log('🚀 ~ file: vite.config.ts:6 ~ command:', command);
  const viteConfig =
    mode === viteConfigDev.mode ? viteConfigDev : viteConfigProd;
  return mergeConfig(viteConfig, viteConfigbase);
};
