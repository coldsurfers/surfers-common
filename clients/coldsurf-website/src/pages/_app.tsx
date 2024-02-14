import type { AppProps } from 'next/app'
import emotionReset from 'emotion-reset'
import { Global, css } from '@emotion/react'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Global
                styles={css`
                    @import url('//fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&display=swap');
                    ${emotionReset}
                    body {
                        font-family: 'Inconsolata', monospace;
                    }
                    p {
                        font-size: 1.5rem;
                        font-weight: bold;
                    }
                `}
            />
        </>
    )
}

export default MyApp
