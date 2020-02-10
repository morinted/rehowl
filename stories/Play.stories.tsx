import React, { useState, useEffect, useRef } from 'react'
import { useHowl, Play } from '../src'
import { action } from '@storybook/addon-actions'

// @ts-ignore
import sound1 from './static/audio/sound1.mp3'
// @ts-ignore
import sound2mp3 from './static/audio/sound2.mp3'
// @ts-ignore
import sound2web from './static/audio/sound2.webm'

export default {
  title: 'Components|<Play />',
  component: Play,
}

const PlayPauseButton = ({ play, setPlay }) =>
  <p>
    <button onClick={() => setPlay(!play)}>
      {play ? 'Pause ⏸' : 'Play ▶'}
    </button>
  </p>

export const renderPlay = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [play, setPlay] = useState(false)
  return (
    <>
      <p>Sound stops when the Play component is unmounted.</p>
      <p>State: {state}</p>
      <PlayPauseButton play={play} setPlay={setPlay} />
      {play ?
        <Play howl={howl}>
          {({ playing }) => <>This is the child of the play component! Playing: {playing().toString()}</>}
        </Play> : null
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
      <p>The Play component will not be able to do anything until you call load.</p>
      <p>State: {state}</p>
      {state === 'unloaded' && <button onClick={() => load()}>Load</button>}
      <PlayPauseButton play={play} setPlay={setPlay} />
      {play &&
        <Play howl={howl} onPlayError={action('onPlayError')}>
          {({ playing }) => <>Playing: {playing().toString()}</>}
        </Play>
      }
    </>
  )
}

export const stop = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [play, setPlay] = useState(false)
  return (
    <>
      <p>This component is being stopped with the <code>stop</code> prop.</p>
      <p>State: {state}</p>
      <PlayPauseButton play={play} setPlay={setPlay} />
      <Play howl={howl} stop={!play} onStop={action('onStop')} onPlay={action('onPlay')}>
        {({ playing }) => <>Playing: {playing().toString()}</>}
      </Play>
    </>
  )
}

export const rate = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [play, setPlay] = useState(false)
  const [rate, setRate] = useState(2)
  const decreaseRate = () => setRate(rate => Math.max(rate - 0.5, 0.5))
  const increaseRate = () => setRate(rate => Math.min(rate + 0.5, 4))
  return (
    <>
      <p>Control the rate of playback.</p>
      <p>State: {state}</p>
      <p>Rate: {rate * 100}%</p>
      <PlayPauseButton play={play} setPlay={setPlay} />
      <p>
        <button onClick={decreaseRate} disabled={rate <= 0.5}>
          -0.5
        </button>
        <button onClick={increaseRate} disabled={rate >= 4}>
          +0.5
        </button>
      </p>
      <Play howl={howl} rate={rate} onRate={action('onRate')} pause={!play}>
        {({ playing }) => <>Playing: {playing().toString()}</>}
      </Play>
    </>
  )
}

export const pause = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [play, setPlay] = useState(false)
  return (
    <>
      <p>Control playback with the <code>pause</code> prop.</p>
      <p>State: {state}</p>
      <PlayPauseButton play={play} setPlay={setPlay} />
      <Play howl={howl} pause={!play} onPlay={action('onPlay')} onPause={action('onPause')}>
        {({ playing }) => <p>Playing: {playing().toString()}</p>}
      </Play>
    </>
  )
}

export const volume = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [play, setPlay] = useState(false)
  const [volume, setVolume] = useState(0.5)
  return (
    <>
      <p>Set the volume. The Play element can change before and during playback.</p>
      <p>State: {state}</p>
      <div>
        <label htmlFor="volume">Volume:</label>
        <input
          id="volume"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={event => setVolume(parseFloat(event.target.value))}
        />
      </div>
      <PlayPauseButton play={play} setPlay={setPlay} />
      {play && (
        <Play howl={howl} volume={volume} onVolume={action('onVolume')}>
          {({ playing }) => <>Playing: {playing().toString()}</>}
        </Play>
      )}
    </>
  )
}

export const mute = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [play, setPlay] = useState(false)
  const [mute, setMute] = useState(true)
  return (
    <>
      <p>State: {state}</p>
      <PlayPauseButton play={play} setPlay={setPlay} />
      <p>
        {mute ? 'Muted.' : 'Unmuted.'} <button onClick={() => setMute(!mute)}>{mute ? 'Unmute 🔊' : 'Mute 🔇'}</button>
      </p>
      {play &&
        <Play howl={howl} mute={mute} onPlay={action('onPlay')} onMute={action('onMute')}>
          {({ playing }) => <>Playing: {playing().toString()}</>}
        </Play>
      }
    </>
  )
}

export const fade = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [play, setPlay] = useState(false)
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
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }
  useEffect(() => {
    if (!fading) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      return
    }
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [fading])

  return (
    <>
      <p>State: {state}</p>
      <PlayPauseButton play={play} setPlay={setPlay} />
      <>
        <button
          disabled={fading}
          onClick={() => {
            setFading(true)
            setSilent(!silent)
          }}
        >
          {fading ? (silent ? 'Fading out...' : 'Fading in...') : silent ? 'Fade in!' : 'Fade out!'}
        </button>
        <Play
          howl={howl}
          pause={!play}
          fade={silent === undefined ? undefined : silent ? [1, 0, 2000] : [0, 1, 2000]}
          onFade={() => setFading(false)}
        >
          {({ volume }) => <p>Volume is at {(volume() * 100).toFixed(0)}%</p>}
        </Play>
      </>
    </>
  )
}

export const seekWithScrubberBar = () => {
  const { howl } = useHowl({ src: sound1 })
  const [targetSeek, setTargetSeek] = useState(0)
  const [play, setPlay] = useState(false)
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
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }
  useEffect(() => {
    if (!play) return
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [play])

  return (
    <>
      <div>
        <input
          type="checkbox"
          checked={pauseDuringScrub}
          onChange={event => setPauseDuringScrub(event.target.checked)}
          id="pause-during-scrub"
        />
        <label htmlFor="pause-during-scrub">Pause while scrubbing</label>
      </div>
      <PlayPauseButton play={play} setPlay={setPlay} />
      <Play
        howl={howl}
        seek={targetSeek}
        pause={!play || (pauseDuringScrub && scrubbing)}
        onEnd={() => setPlay(true)}
        onSeek={action('onSeek')}
      >
        {({ seek, duration }) => {
          const position = scrubbing && targetSeek !== undefined ? targetSeek : seek()
          const length = duration()
          return (
            <div>
              <p>
                {position.toFixed(1)} / {length.toFixed(1)}
              </p>
              <input
                type="range"
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
        }}
      </Play>
    </>
  )
}

export const basicSprite = () => {
  const [digit, setDigit] = useState(0)
  const [loop, setLoop] = useState(false)
  const { howl, state } = useHowl({
    src: [sound2web, sound2mp3],
    sprite: {
      1: [0, 450],
      2: [2000, 250],
      3: [4000, 350],
      4: [6000, 380],
      5: [8000, 340],
    },
  })
  return (
    <>
      <p>
        All these digits are loaded from a single sound file and are controlled by one Howl.
        The Play component will automatically start playing when the selected sprite changes.
      </p>
      <p>Selected digit: {digit}</p>
      <p>State: {state}</p>
      <div>
        {[1, 2, 3, 4, 5].map(digit => (
          <button
            key={digit}
            onClick={() => {
              setDigit(digit)
            }}
          >
            {digit}
          </button>
        ))}
      </div>
      <button onClick={() => setLoop(!loop)}>{loop ? 'Disable Looping' : 'Enable Looping'}</button>
      {digit > 0 ?
        <Play howl={howl} sprite={`${digit}`} loop={loop} /> : null
      }
    </>
  )
}

type Digits = { digit: number, time: number }[]
export const complexSprite = () => {
  const [digits, setDigits] = useState<Digits>([])
  const [playBeat, setPlayBeat] = useState(false)
  const { howl, state } = useHowl({
    src: [sound2web, sound2mp3],
    sprite: {
      1: [0, 450],
      2: [2000, 250],
      3: [4000, 350],
      4: [6000, 380],
      5: [8000, 340],
      beat: [10000, 11163],
    },
  })
  return (
    <>
      <p>
        All these sounds are loaded from a single sound file on one Howl.
      </p>
      <p>
        Every time you click a digit, a Play is rendered and played until onEnd is called.
      </p>
      <p>
        Go ahead, play a few sounds at once.
      </p>
      <p>State: {state}</p>
      <div>
        {[1, 2, 3, 4, 5].map(digit => (
          <button
            key={digit}
            onClick={() => {
              setDigits(digits => [...digits, { digit, time: Date.now() }])
            }}
          >
            {digit}
          </button>
        ))}
      </div>
      <button onClick={() => setPlayBeat(!playBeat)}>{playBeat ? 'Pause Beat' : 'Play Beat'}</button>
      <button
        onClick={() => {
          const now = Date.now()
          setDigits(digits => [
            ...digits,
            { digit: 5, time: now },
            { digit: 4, time: now + 1 },
            { digit: 3, time: now + 2 },
            { digit: 2, time: now + 3 },
            { digit: 1, time: now + 4 },
          ])
        }}
      >
        Play all
      </button>
      <div>
        <Play howl={howl} sprite="beat" loop pause={!playBeat}>
          {({ playing }) => <p>Beat Playing: {playing().toString()}</p>}
        </Play>
        {digits.map(({ digit, time }) => (
          <Play
            howl={howl}
            sprite={`${digit}`}
            key={time}
            onEnd={() =>
              setDigits(digits => {
                const targetIndex = digits.findIndex(x => x.time === time)
                if (targetIndex < 0) return digits
                return [...digits.slice(0, targetIndex), ...digits.slice(targetIndex + 1)]
              })
            }
          >
            {({ duration }) => (
              <p>
                Playing {digit} for {duration()}
              </p>
            )}
          </Play>
        ))}
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
      <Play howl={howl} />
    </>
  )
}

export const howlDefaultVolume = () => {
  const [defaultVolume, setDefaultVolume] = useState(0)
  const [playVolume, setPlayVolume] = useState(0)
  const { howl } = useHowl({ src: sound1, defaultVolume })
  const [play, setPlay] = useState(false)
  return (
    <>
      <p>Default volume on the howl is 0 to prevent clipping on quiet plays. This example is used for debug on slower devices such as phones.</p>
      <div>
        <label>
          <input
            type="radio"
            name="default-volume"
            checked={defaultVolume === 0}
            value={0}
            onChange={event => {
              if (event.target.checked) {
                setDefaultVolume(0)
              }
            }}
          />
          &nbsp;Default volume 0
        </label>
        <label>
          <input
            type="radio"
            name="default-volume"
            checked={defaultVolume === 1}
            value={1}
            onChange={event => {
              if (event.target.checked) {
                setDefaultVolume(1)
              }
            }}
          />
          &nbsp;Default volume 1
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="play-volume"
            checked={playVolume === 0}
            value={0}
            onChange={event => {
              if (event.target.checked) {
                setPlayVolume(0)
              }
            }}
          />
          &nbsp;Play volume 0
        </label>
        <label>
          <input
            type="radio"
            name="play-volume"
            checked={playVolume === 1}
            value={1}
            onChange={event => {
              if (event.target.checked) {
                setPlayVolume(1)
              }
            }}
          />
          &nbsp;Play volume 1
        </label>
      </div>
      <PlayPauseButton play={play} setPlay={setPlay} />

      {play &&
        <Play howl={howl} volume={playVolume} seek={0.5} />
      }
    </>
  )
}

export const swapSource = () => {
  const srcs = ['nonexistent.mp3', sound1, sound2mp3]
  const [useHtml5, setUseHtml5] = useState(false)
  const [src, setSrc] = useState(srcs[0])
  const { howl, state, error } = useHowl({ src: src, html5: useHtml5 })
  return (
    <>
      <p>Every time a setting is changed on useHowl or Rehowl, the howl instance is reconstructed.</p>
      <p>It's better to load multiple howls and use Play components than swap the source on a single howl.</p>
      <p>In this example, you can change the howl's src and whether it's using HTML5 Audio or Web Audio.</p>
      <h3>Select a sound to play</h3>
      {srcs.map(srcChoice => (
        <div key={srcChoice}>
          <label>
            <input
              type="radio"
              name="source"
              checked={srcChoice === src}
              value={srcChoice}
              onChange={event => {
                if (event.target.checked) {
                  setSrc(srcChoice)
                }
              }}
            />
            &nbsp;{srcChoice}
          </label>
        </div>
      ))}
      <label style={{ display: 'block', marginTop: '1rem' }}>
        <input type="checkbox" checked={useHtml5} onChange={event => setUseHtml5(event.target.checked)} id="html5" />
        Use HTML 5 Audio
      </label>

      <h3>Info</h3>
      {error && <p>Error: {[error.id, error.message].filter(x => x).join(' ')} </p>}
      <p>State: {state}</p>

      <Play howl={howl}>{({ playing }) => <>Playing: {playing().toString()}</>}</Play>
    </>
  )
}
