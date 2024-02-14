import type { NextPage } from 'next'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'

const Home: NextPage = () => {
    return (
        <Parallax pages={2} style={{ top: '0', left: '0' }}>
            <ParallaxLayer
                offset={0}
                speed={2.5}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <p>Welcome to ColdSurfers</p>
            </ParallaxLayer>

            <ParallaxLayer
                offset={1}
                speed={2}
                style={{ backgroundColor: '#ff6d6d' }}
            />

            <ParallaxLayer
                offset={1}
                speed={0.5}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                }}
            >
                <p>Something cool is coming</p>
            </ParallaxLayer>
        </Parallax>
    )
}

export default Home
