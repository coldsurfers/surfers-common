const typescript = require('rollup-plugin-typescript2')
const alias = require('@rollup/plugin-alias')

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.web.js',
      format: 'cjs',
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    alias({
      entries: {
        'react-native': '../../alias',
      },
    }),
  ],
}
