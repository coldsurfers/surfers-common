import { type UserConfig, defineConfig } from 'tsdown';

const commonConfigs: UserConfig = {
  outDir: 'dist',
  dts: true,
  external: ['jwt-decode', 'schema-dts', 'zod'],
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
