import { FC } from 'react'
import { IconProps } from '../types/iconProps'

const PlayIcon: FC<IconProps> = ({ className, style }) => (
    <img
        alt="play-icon"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAxElEQVRIie3WMWpCURBG4Q8FSRrtbC2SPhvICmzchVuwtXQLbsE2pVUIkjqQHVgqNmIj6EvxGHhFQAIvcxt/OPVhhrlzh3sKZ4MvTLLFVYNPvJYQB294LiGucMYSw2xxcMQcj9niYIsputni4BvjEuJgjZcS4goXrDDKFgcnLDDIFgd7zNDLFgfvTUHnL23ISJuV7iS3Ooarn1VxkeeUvkDSV2b6J3FQT+pDW8Jb4vRD4Kqe1Kf/Ev4mTj32PhQ6b+9pPT+XHgysHrPM6QAAAABJRU5ErkJggg=="
        className={className}
        style={style}
    />
)

export default PlayIcon
