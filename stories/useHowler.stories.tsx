import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import useHowl from '../src/useHowl'
import Play from '../src/Play'
// @ts-ignore
import sound1 from './static/audio/sound1.mp3'
// @ts-ignore
import sound2mp3 from './static/audio/sound2.mp3'
// @ts-ignore
import sound2web from './static/audio/sound2.webm'

export default {
  title: 'useHowler',
};

export const badSRC = () => {
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

export const toggleStop = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [stop, setStop] = useState(true)
  return (
    <>
      <p>State: {state}</p>
      <button onClick={() => setStop(!stop)}>
        {stop ? 'Start' : 'Stop'}
      </button>
      <Play howl={howl} stop={stop}>{
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

export const toggleFade = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [fadedOut, setFadedOut] = useState<undefined | boolean>(undefined)
  const [fading, setFading] = useState(false)
  return (
    <>
      <p>State: {state}</p>
      <button
        disabled={fading}
        onClick={() => {
          setFading(true)
          setFadedOut(!fadedOut)
        }}
      >
        {fading ?
          fadedOut ? 'Fading out...' : 'Fading in...' :
          fadedOut ? 'Fade in!' : 'Fade out!'}
      </button>
      <Play
        howl={howl}
        fade={fadedOut === undefined ?
          undefined : fadedOut ?
            [1, 0, 2000] : [0, 1, 2000]
        }
        onFade={() => setFading(false)}
      />
    </>
  )
}

export const simpleSprit = () => {
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
            {({ duration, seek }) =>
              <p>Playing {digit} for {duration()}</p>
            }
          </Play>
        )}
      </div>
    </>
  )
}
