import { type UserConfig, defineConfig } from 'tsdown';
import pkg from './package.json' with { type: 'json' };

const { peerDependencies } = pkg;
const peerDepsArray = Object.keys(peerDependencies);

const commonConfigs: UserConfig = {
  outDir: 'dist',
  dts: true,
  minify: true,
  external: peerDepsArray,
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
  {
    entry: {
      'next/index': 'src/next/index.ts',
    },
    format: ['esm', 'cjs'],
    ...commonConfigs,
  },
]);
