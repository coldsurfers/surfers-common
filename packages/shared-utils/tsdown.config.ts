import { type UserConfig, defineConfig } from 'tsdown';

const commonConfigs: UserConfig = {
  outDir: 'dist',
  dts: true,
  external: [
    'next',
    'next/link',
    'next/navigation',
    'react',
    'react-dom',
    'lucide-react',
    'framer-motion',
    '@emotion/css',
    '@emotion/native',
    '@emotion/react',
    '@emotion/styled',
    'react-native',
    'react-native-reanimated',
    'react-native-svg',
    'lucide-react-native',
    '@coldsurfers/ocean-road-design-tokens',
  ],
  treeshake: true,
  tsconfig: 'tsconfig.json',
};

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['esm', 'cjs'],
    ...commonConfigs,
  },
]);
