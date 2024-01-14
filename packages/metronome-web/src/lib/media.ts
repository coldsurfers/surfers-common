interface MediaSize {
    small: string
    medium: string
    large: string
    xlarge: string
}

const size: MediaSize = {
    small: '375px',
    medium: '768px',
    large: '1280px',
    xlarge: '1728px',
}

const mediaQuery = (maxWidth: string) => `@media (max-width: ${maxWidth})`

const media = {
    small: mediaQuery(size.small),
    medium: mediaQuery(size.medium),
    large: mediaQuery(size.large),
    xlarge: mediaQuery(size.xlarge),
}

export default media
