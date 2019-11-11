import { useState, useEffect } from 'react'
import Howler from 'howler'

export type UseHowlState = {
  howl: null | Howl
  error: null | { id?: number, message: string }
  state: 'unloaded' | 'loading' | 'loaded' | string
  load: () => void
}

type Props = {
  src: string | string[]
  sprite?: IHowlSoundSpriteDefinition
  format?: string[]
  html5?: boolean
  preload?: boolean
  xhrWithCredentials?: boolean
}

export default function Howl(props: Props): UseHowlState {
  const {
    src, sprite, format, html5, preload, xhrWithCredentials
  } = props
  const [howl, setHowl] = useState<Howl | null>(null)
  const [, setState] = useState('unloaded')
  const [error, setError] = useState<null | { id?: number, message: any }>(null)
  const [locked, setLocked] = useState(true)

  useEffect(() => {
    const newHowl = new Howler.Howl({
      src,
      sprite,
      format,
      html5,
      xhrWithCredentials,
      preload,
      autoplay: false,
      onunlock: () => {
        setLocked(false)
      },
      onload: () => setState('loaded'),
      onloaderror: (id, message) => setError({ id, message }),
    })
    setHowl(newHowl)

    return () => {
      if (!newHowl) return
      newHowl.off()
      newHowl.stop()
      newHowl.unload()
      setHowl(null)
    }
  }, [])

  if (!howl) return {
    howl: null,
    error: null,
    state: 'unloaded',
    load: () => {},
  }
  const state = howl.state()
  return {
    howl: howl,
    error,
    state,
    load:
      state === 'unloaded' ?
        () => {
          howl && howl.load()
          setState('loading')
        } : () => {}
  }
}
