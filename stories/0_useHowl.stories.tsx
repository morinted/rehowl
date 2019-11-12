import React, { useState, useEffect, useRef } from 'react'
import { action } from '@storybook/addon-actions'
import { useHowl, Play } from '../src'
// @ts-ignore
import sound1 from './static/audio/sound1.mp3'
// @ts-ignore
import sound2mp3 from './static/audio/sound2.mp3'
// @ts-ignore
import sound2web from './static/audio/sound2.webm'

export default {
  title: 'Hook: useHowl',
};

export const mountUnmountPlay = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [play, setPlay] = useState(false)
  return (
    <>
      <p>State: {state}</p>
      <button onClick={() => setPlay(!play)}>
        {play ? 'Unmount!' : 'Mount!'}
      </button>
      {play &&
        <Play howl={howl}>{
          ({ playing }) => <>Playing: {playing().toString()}</>
        }</Play>
      }
    </>
  )
}


export const noPreload = () => {
  const { howl, state, load, error } = useHowl({ src: sound1, preload: false })
  const [play, setPlay] = useState(false)
  useEffect(() => {
    action(state)()
  }, [state])
  return (
    <>
      <p>State: {state}</p>
      {error && <p>Error: {[error.id, error.message].filter(x => x).join(' ')} </p>}
      { state === 'unloaded' &&
        <button onClick={() => load()}>
          Load
        </button>
      }
      <button onClick={() => setPlay(!play)}>
        {play ? 'Unmount!' : 'Mount!'}
      </button>
      {play &&
        <Play howl={howl} onPlayError={action('onPlayError')}>{
          ({ playing }) => <>Playing: {playing().toString()}</>
        }</Play>
      }
    </>
  )
}

export const toggleStop = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [stop, setStop] = useState(true)
  return (
    <>
      <p>State: {state}</p>
      <button onClick={() => setStop(!stop)}>
        {stop ? 'Start' : 'Stop'}
      </button>
      <Play howl={howl} stop={stop} onStop={action('onStop')} onPlay={action('onPlay')}>{
        ({ playing }) => <>Playing: {playing().toString()}</>
      }</Play>
    </>
  )
}

export const setRate = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [rate, setRate] = useState(2)
  const decreaseRate = () => setRate(rate => Math.max(rate - 0.5, 0.5))
  const increaseRate = () => setRate(rate => Math.min(rate + 0.5, 4))
  return (
    <>
      <p>State: {state}</p>
      <p>Rate: {rate * 100}%</p>
      <button onClick={decreaseRate} disabled={rate <= 0.5}>
        -0.5
      </button>
      <button onClick={increaseRate} disabled={rate >= 4}>
        +0.5
      </button>
      <Play howl={howl} rate={rate} onRate={action('onRate')}>{
        ({ playing }) => <>Playing: {playing().toString()}</>
      }</Play>
    </>
  )
}

export const togglePause = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [play, setPlay] = useState(false)
  return (
    <>
      <p>State: {state}</p>
      <button onClick={() => setPlay(!play)}>
        {play ? 'Pause!' : 'Play!'}
      </button>
      <Play
        howl={howl}
        pause={!play}
        onPlay={action('onPlay')}
        onPause={action('onPause')}
      >{
          ({ playing }) => <>Playing: {playing().toString()}</>
        }</Play>
    </>
  )
}

export const toggleMute = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [mute, setMute] = useState(true)
  return (
    <>
      <p>State: {state}</p>
      <button onClick={() => setMute(!mute)}>
        {mute ? 'Unmute' : 'Mute'}
      </button>
      <Play
        howl={howl}
        mute={mute}
        onPlay={action('onPlay')}
        onMute={action('onMute')}
      >{
        ({ playing }) => <>Playing: {playing().toString()}</>
      }</Play>
    </>
  )
}

export const toggleFade = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [silent, setSilent] = useState<undefined | boolean>(undefined)
  const [fading, setFading] = useState(false)

  // Request animation frames during fade.
  const [, setTime] = useState(0)
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef(0)
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      setTime(deltaTime)
    }
    previousTimeRef.current = time;
    if (fading) {
      requestRef.current = requestAnimationFrame(animate)
    }
  }
  useEffect(() => {
    if (!fading) return
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [fading])

  return (
    <>
      <p>State: {state}</p>
      <button
        disabled={fading}
        onClick={() => {
          setFading(true)
          setSilent(!silent)
        }}
      >
        {fading ?
          silent ? 'Fading out...' : 'Fading in...' :
          silent ? 'Fade in!' : 'Fade out!'}
      </button>
      <Play
        howl={howl}
        fade={silent === undefined ?
          undefined : silent ?
            [1, 0, 2000] : [0, 1, 2000]
        }
        onFade={() => setFading(false)}
      >{
        ({ volume }) => <p>Volume is at { (volume() * 100).toFixed(0) }%</p>
      }</Play>
    </>
  )
}

export const onSeekScrubberBar = () => {
  const { howl } = useHowl({ src: sound1 })
  const [targetSeek, setTargetSeek] = useState(0)
  const [pause, setPause] = useState(true)
  const [scrubbing, setScrubbing] = useState(false)
  const [pauseDuringScrub, setPauseDuringScrub] = useState(true)

  // Request animation frames in order to render seek smoothly.
  const [, setTime] = useState(0)
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef(0)
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      setTime(deltaTime)
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate)
  }
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  return (
    <>
      <div>
        <input
          type='checkbox'
          checked={pauseDuringScrub}
          onChange={event => setPauseDuringScrub(event.target.checked)}
          id='pause-during-scrub'
        />
        <label htmlFor='pause-during-scrub'>Pause while scrubbing</label>
      </div>
      <button onClick={() => setPause(pause => !pause)}>
        { pause ? '▶️' : '⏸' }
      </button>
      <Play
        howl={howl}
        seek={targetSeek}
        pause={pause || (pauseDuringScrub && scrubbing)}
        onEnd={() => setPause(true)}
        onSeek={action('onSeek')}
      >{ ({ seek, duration }) => {
        const position = scrubbing && targetSeek !== undefined ?
            targetSeek :
            seek()
        const length = duration()
        return (
          <div>
            <p>{ position.toFixed(1) } / { length.toFixed(1) }</p>
            <input
              type='range'
              min={0}
              max={length}
              value={position}
              step={0.1}
              onChange={e => {
                const changedPosition = parseFloat(e.target.value)
                // Remove false positives caused by slow seek() update time.
                setTargetSeek(changedPosition)
              }}

              onMouseDown={() => setTimeout(() => setScrubbing(true), 0)}
              onMouseUp={() => setTimeout(() => setScrubbing(false), 0)}
            />
          </div>
        )
      }}</Play>
    </>
  )
}

export const simpleSprite = () => {
  const [digit, setDigit] = useState(1)
  const [loop, setLoop] = useState(false)
  const { howl, state } = useHowl({
    src: [sound2web, sound2mp3],
    sprite: {
      1: [0, 450],
      2: [2000, 250],
      3: [4000, 350],
      4: [6000, 380],
      5: [8000, 340],
    }
  })
  return (
    <>
      <p>State: {state}</p>
      <div>
        {[1, 2, 3, 4, 5].map(digit =>
          <button key={digit} onClick={() => {
            setDigit(digit)
          }}>
            {digit}
          </button>
        )}
      </div>
      <button onClick={() => setLoop(!loop)}>
        {loop ? 'Disable Looping' : 'Enable Looping'}
      </button>
      <Play
        howl={howl}
        sprite={`${digit}`}
        loop={loop}
      />
    </>
  )
}

export const complexSprite = () => {
  const [digits, setDigits] = useState<{ digit: number, time: number }[]>([])
  const [playBeat, setPlayBeat] = useState(false)
  const { howl, state } = useHowl({
    src: [sound2web, sound2mp3],
    sprite: {
      1: [0, 450],
      2: [2000, 250],
      3: [4000, 350],
      4: [6000, 380],
      5: [8000, 340],
      beat: [10000, 11163]
    }
  })
  return (
    <>
      <p>State: {state}</p>
      <div>
        {[1, 2, 3, 4, 5].map(digit =>
          <button key={digit} onClick={() => {
            setDigits(digits => [...digits, { digit, time: Date.now() }])
          }}>
            {digit}
          </button>
        )}
      </div>
      <button onClick={() => setPlayBeat(!playBeat)}>
        {playBeat ? 'Pause Beat' : 'Play Beat'}
      </button>
      <button onClick={() => {
        const now = Date.now()
        setDigits(digits => [...digits,
          { digit: 5, time: now },
          { digit: 4, time: now + 1 },
          { digit: 3, time: now + 2 },
          { digit: 2, time: now + 3 },
          { digit: 1, time: now + 4 },
        ])
      }}>
        Play all
      </button>
      <div>
        <Play
          howl={howl}
          sprite='beat'
          loop
          pause={!playBeat}
        >
          {({ playing }) =>
            <p>Beat Playing: {playing().toString()}</p>
          }
        </Play>
        {digits.map(({ digit, time }, index) =>
          <Play
            howl={howl}
            sprite={`${digit}`}
            key={time}
            onEnd={() => setDigits(digits => {
              const targetIndex = digits.findIndex(x => x.time === time)
              if (targetIndex < 0) return digits
              return [...digits.slice(0, targetIndex), ...digits.slice(targetIndex + 1)]
            })}
          >
            {({ duration }) =>
              <p>Playing {digit} for {duration()}</p>
            }
          </Play>
        )}
      </div>
    </>
  )
}

export const errorBadSRC = () => {
  const { howl, state, error } = useHowl({ src: 'fake' })
  return (
    <>
      {error && <p>Error: {[error.id, error.message].filter(x => x).join(' ')} </p>}
      <p>State: {state}</p>
      <Play
        howl={howl}
      />
    </>
  )
}