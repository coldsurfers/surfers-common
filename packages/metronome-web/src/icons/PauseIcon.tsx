import { FC } from 'react'
import { IconProps } from '../types/iconProps'

const PauseIcon: FC<IconProps> = ({ className, style }) => (
    <img
        alt="pause-icon"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAXklEQVRIie2WUQqAIBAFx06XdP8LuN5DfwwKUhA2kHoD+yPjzu+C+DMHkIHSxoDo6Hexy5JzkpcfBovK5J8pfxuEX0VhhRVWWGGFFV47nB/ezNHvErnfUQnYHX3xcSrwEiKQG9/iJwAAAABJRU5ErkJggg=="
        className={className}
        style={style}
    />
)

export default PauseIcon
