import { useState, useEffect } from 'react'
import Howler, { HowlOptions, SoundSpriteDefinitions } from 'howler'

export interface IUseHowlState {
  /** The Howl instance. */
  howl: null | Howl
  /** Load errors. */
  error: null | { id?: number; message: string }
  /** Load state. */
  state: 'unloaded' | 'loading' | 'loaded'
  /** Function to start loading if preload is false. */
  load: () => void
}

export interface IUseHowlOptions {
  /**
   * The sources to the track(s) to be loaded for the sound (URLs or base64 data URIs).
   *
   * These should be in order of preference, howler.js will automatically load the first
   * one that is compatible with the current browser.
   *
   * If your files have no extensions, you will need to explicitly specify the extension
   * using the `format` prop.
   */
  src: string | string[]
  /**
   * Define a sound sprite for the sound.
   *
   * The offset and duration are defined in milliseconds.
   *
   * A third (optional) parameter is available to set a sprite as looping, but you can just
   * set `loop` to `true` on the `<Play />` component to achieve this as well.
   */
  sprite?: SoundSpriteDefinitions
  /**
   * Array of formats corresponding to the sources provided if it's not inferable from the file name.
   */
  format?: string[]
  /**
   * Set to true to use html5 audio instead of Web Audio.
   *
   * This should be used for large audio files so that you don't have
   * to wait for the full file to be downloaded and decoded before playing.
   *
   * @default false
   */
  html5?: boolean
  /**
   * Set to false in order to prevent loading the file until you call the returned `load()` function.
   *
   * Otherwise, howler will start loading your file immediately.
   *
   * @default true
   */
  preload?: boolean
  /**
   * Whether or not to enable the withCredentials flag on XHR requests used to fetch audio files when using Web Audio API.
   */
  xhr?: HowlOptions['xhr']
  /**
   * Default starting volume for Plays. Defaults to muted to prevent clipping of low-volume plays.
   *
   * Set it to your desired Play volume if you find the beginning of your plays getting clipped.
   *
   * @default 0
   */
  defaultVolume?: number
}

/**
 * A hook to get a Howl instance for use with `<Play />`.
 *
 * Recommended when using Rehowl from a function component. If you're
 * using a class component, you'll need to use `<Rehowl />`.
 */
export default function useHowl(howlOptions: IUseHowlOptions): IUseHowlState {
  const { src, sprite, format, html5, preload, xhr, defaultVolume = 0 } = howlOptions
  const [howl, setHowl] = useState<Howl | null>(null)
  // Force rerender on load state changes.
  const [, setState] = useState('unloaded')
  // Force rerender on unlock.
  const [, setLocked] = useState(true)

  const [error, setError] = useState<null | { id?: number; message: any }>(null)

  useEffect(() => {
    const newHowl = new Howler.Howl({
      autoplay: false,
      format,
      html5,
      onload: () => setState('loaded'),
      onloaderror: (id, message) => setError({ id, message }),
      onunlock: () => {
        setLocked(false)
      },
      preload,
      sprite,
      src,
      volume: defaultVolume,
      xhr,
    })
    setHowl(newHowl)

    return () => {
      setHowl(null)
      setState('unloaded')
      setLocked(true)
      setError(null)
      if (!newHowl) return
      newHowl.off()
      newHowl.stop()
      newHowl.unload()
    }
  }, [JSON.stringify(src), JSON.stringify(sprite), JSON.stringify(format), html5, xhr, preload, defaultVolume])

  if (!howl) {
    return {
      howl: null,
      error: null,
      state: 'unloaded',
      load: () => {},
    }
  }
  const state = howl.state()
  return {
    howl: howl,
    error,
    state,
    load:
      state === 'unloaded'
        ? () => {
            howl && howl.load()
            setState('loading')
          }
        : () => {},
  }
}
