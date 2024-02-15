import styled from '@emotion/styled'
import type { NextPage } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react'
import media from '../lib/media'

const Layout = styled.main`
  min-width: 100vw;
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`

const ToolBox = styled.div<{ bpm: number }>`
  width: 450px;
  height: 450px;
  border-radius: 50%;
  background-color: #f1f3f5;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);

  padding: 24px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  &.pulse {
    animation: ${(p) => `pulse-animation ${60 / p.bpm}s infinite`};
  }

  @keyframes pulse-animation {
    0% {
      box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
      box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
    }
  }

  ${media.medium} {
    width: 300px;
    height: 300px;
    font-size: 17px;
  }
`

const SeekBarLayout = styled.div`
  display: flex;
  align-items: center;
`

const CircleButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 28px;
  font-weight: bold;
  background-color: #ffffff;
  border: 1px solid #868e96;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #adb5bd;
  }
  &:active {
    background-color: #495057;
    color: #ffffff;
  }

  ${media.medium} {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`

const PlayButton = styled(CircleButton)`
  width: 120px;
  height: 120px;
  margin-left: auto;
  margin-right: auto;
  font-size: 23px;

  ${media.medium} {
    width: 80px;
    height: 80px;
    font-size: 17px;
  }
`

const SeekBar = styled.div`
  flex: 1;
  background-color: #343a40;
  height: 3.5px;
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`

const Seeker = styled.span`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #ffffff;
  z-index: 50;
  cursor: pointer;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
`

const BpmMarker = styled.h1`
  font-weight: 500;
  font-size: 120px;
  width: 100%;
  text-align: center;
  user-select: none;

  ${media.medium} {
    font-size: 70px;
  }
`

const MINIMUM_BPM = 20
const MAXIMUM_BPM = 240
const BEATS_PER_BAR = 4
const LOOK_AHEAD = 25
const SCHEDULE_AHEAD_TIME = 0.1

const Home: NextPage = () => {
  const seekerRef = useRef<HTMLSpanElement>(null)
  const seekBarRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentBeatInBarRef = useRef<number>(0)
  const nextNoteTimeRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const playPauseButtonRef = useRef<HTMLButtonElement>(null)

  const [isSeeking, setIsSeeking] = useState<boolean>(false)
  const [seekerLeftPercentage, setSeekerLeftPercentage] = useState<number>(50)
  const [bpm, setBpm] = useState<number>(
    MINIMUM_BPM + (seekerLeftPercentage / 100) * (MAXIMUM_BPM - MINIMUM_BPM)
  )
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const nextBeat = useCallback(() => {
    const secondsPerBeat = 60 / bpm
    nextNoteTimeRef.current += secondsPerBeat

    if (currentBeatInBarRef.current + 1 === BEATS_PER_BAR) {
      currentBeatInBarRef.current = 0
    } else {
      currentBeatInBarRef.current += 1
    }
  }, [bpm])

  const scheduleNote = useCallback((beatNumber: number, time: number) => {
    const { current: audioContext } = audioContextRef
    if (!audioContext) return
    const osc = audioContext.createOscillator()
    const envelope = audioContext.createGain()

    osc.frequency.value = beatNumber % BEATS_PER_BAR === 0 ? 1000 : 800
    envelope.gain.value = 1
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001)
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02)

    osc.connect(envelope)
    envelope.connect(audioContext.destination)

    osc.start(time)
    osc.stop(time + 0.03)
  }, [])

  const onClickPlay = useCallback(() => {
    setIsPlaying(true)

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)()
    }
    nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.05

    intervalRef.current = setInterval(() => {
      if (!audioContextRef.current) return
      while (
        nextNoteTimeRef.current <
        audioContextRef.current.currentTime + SCHEDULE_AHEAD_TIME
      ) {
        scheduleNote(currentBeatInBarRef.current, nextNoteTimeRef.current)
        nextBeat()
      }
    }, LOOK_AHEAD)
  }, [nextBeat, scheduleNote])

  const onClickPause = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const onClickBpmPlus = useCallback(() => {
    const nextBpm = bpm + 1
    if (nextBpm > MAXIMUM_BPM) {
      return
    }
    setBpm(nextBpm)
    setSeekerLeftPercentage(
      ((nextBpm - MINIMUM_BPM) / (MAXIMUM_BPM - MINIMUM_BPM)) * 100
    )
    if (isPlaying) {
      onClickPause()
    }
  }, [bpm, isPlaying, onClickPause])

  const onClickBpmMinus = useCallback(() => {
    const nextBpm = bpm - 1
    if (nextBpm < MINIMUM_BPM) {
      return
    }
    setBpm(nextBpm)
    setSeekerLeftPercentage(
      ((nextBpm - MINIMUM_BPM) / (MAXIMUM_BPM - MINIMUM_BPM)) * 100
    )
    if (isPlaying) {
      onClickPause()
    }
  }, [bpm, isPlaying, onClickPause])

  useEffect(() => {
    const controlMouse = (e: MouseEvent) => {
      const { current: seekBarRefCurrent } = seekBarRef
      if (!seekBarRefCurrent) {
        return
      }
      const { clientWidth, offsetLeft } = seekBarRefCurrent
      let percentage = ((e.clientX - offsetLeft) / clientWidth) * 100
      if (percentage < 0) {
        percentage = 0
      }
      if (percentage > 100) {
        percentage = 100
      }

      setSeekerLeftPercentage(percentage)
      setBpm(MINIMUM_BPM + (percentage / 100) * (MAXIMUM_BPM - MINIMUM_BPM))
    }
    const controlTouch = (e: TouchEvent) => {
      const { current: seekBarRefCurrent } = seekBarRef
      if (!seekBarRefCurrent) {
        return
      }
      const { clientWidth, offsetLeft } = seekBarRefCurrent
      let percentage = ((e.touches[0].clientX - offsetLeft) / clientWidth) * 100
      if (percentage < 0) {
        percentage = 0
      }
      if (percentage > 100) {
        percentage = 100
      }

      setSeekerLeftPercentage(percentage)
      setBpm(MINIMUM_BPM + (percentage / 100) * (MAXIMUM_BPM - MINIMUM_BPM))
    }
    const onMouseDown = (e: MouseEvent) => {
      if (seekBarRef.current?.contains(e.target as Node)) {
        setIsSeeking(true)
        onClickPause()
        controlMouse(e)
      }
    }
    const onTouchStart = (e: TouchEvent) => {
      if (seekBarRef.current?.contains(e.target as Node)) {
        setIsSeeking(true)
        onClickPause()
        controlTouch(e)
      }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (isSeeking) {
        controlMouse(e)
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (isSeeking) {
        controlTouch(e)
      }
    }
    const onMouseUp = () => {
      if (isSeeking) {
        setIsSeeking(false)
      }
    }
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        if (document.activeElement === playPauseButtonRef.current) {
          return
        }
        if (isPlaying) {
          onClickPause()
        } else {
          onClickPlay()
        }
      }
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchstart', onTouchStart)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onMouseUp)
    document.addEventListener('keypress', onKeyPress)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onMouseUp)
      document.removeEventListener('keypress', onKeyPress)
    }
  }, [isSeeking, onClickPause, onClickPlay, isPlaying])

  return (
    <Layout>
      <ToolBox className={isPlaying ? 'pulse' : undefined} bpm={bpm}>
        <BpmMarker>{Math.ceil(bpm)}</BpmMarker>
        <SeekBarLayout>
          <CircleButton onClick={onClickBpmMinus}>&lt;</CircleButton>
          <SeekBar ref={seekBarRef}>
            <Seeker
              ref={seekerRef}
              style={{
                left: `calc(${seekerLeftPercentage}% - (16px / 2))`,
              }}
            />
          </SeekBar>
          <CircleButton onClick={onClickBpmPlus} style={{ marginLeft: 'auto' }}>
            &gt;
          </CircleButton>
        </SeekBarLayout>
        <PlayButton
          ref={playPauseButtonRef}
          onClick={isPlaying ? onClickPause : onClickPlay}
        >
          {isPlaying ? 'Stop' : 'Start'}
        </PlayButton>
      </ToolBox>
    </Layout>
  )
}

export default Home
