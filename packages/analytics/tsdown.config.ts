import { type UserConfig, defineConfig } from 'tsdown';

const commonConfigs: UserConfig = {
  outDir: 'dist',
  dts: true,
  external: ['react', 'zod'],
  treeshake: true,
  tsconfig: 'tsconfig.json',
};

export default defineConfig([
  {
    entry: {
      index: 'core/index.ts',
      next: 'next/index.ts',
    },
    format: ['esm', 'cjs'],
    ...commonConfigs,
  },
]);
