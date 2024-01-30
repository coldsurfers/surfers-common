import StyleDictionary from 'style-dictionary'
import formatters from './formatter'

const dict = StyleDictionary.registerFormat(
  formatters['typescript/object']
).extend({
  source: ['src/lib/token-builder/tokens.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'src/lib/tokens/scss/',
      files: [
        {
          destination: 'variables.scss',
          format: 'scss/variables',
        },
      ],
    },
    css: {
      transformGroup: 'css',
      buildPath: 'src/lib/tokens/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
    ts: {
      buildPath: 'src/lib/tokens/ts/',
      files: [
        {
          destination: 'variables.ts',
          format: 'typescript/object',
        },
      ],
    },
  },
})

dict.buildAllPlatforms()
