import { Format } from 'style-dictionary'

const formatterName = 'typescript/object' as const

type Formatters = Record<typeof formatterName, Format>

const formatters: Formatters = {
  'typescript/object': {
    name: 'typescript/object',
    formatter: (params) => {
      const { dictionary, file, options, platform } = params
      console.log(dictionary.tokens)
      console.log(dictionary.allTokens)
      const tokens: Record<
        string,
        Record<
          string,
          {
            value: string
          }
        >
      > = {}
      Object.keys(dictionary.tokens).forEach((category) => {
        tokens[category] = {}
      })
      dictionary.allTokens.forEach((token) => {
        const category = token.path[0]
        tokens[category][token.name] = token.value
      })
      return `export const variables = ${JSON.stringify(tokens, null, 2)}`
    },
  },
}

export default formatters
