import type { AppProps } from 'next/app'
import { Global, css } from '@emotion/react'
import emotionReset from 'emotion-reset'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Global
        styles={css`
          @import url('//fonts.googleapis.com/css2?family=Water+Brush&display=swap');
          ${emotionReset}

          *, *::after, *::before {
            box-sizing: border-box;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            font-smoothing: antialiased;
          }

          body {
            font-family: 'Water Brush', cursive;
          }

          button {
            font-family: 'Water Brush', cursive;
          }
        `}
      />
    </>
  )
}

export default MyApp
