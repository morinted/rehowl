import { useState, useEffect, useRef } from 'react'
import Howler from 'howler'

export type UseHowlState = {
  howl: null | Howl,
  error: null | { id?: number, message: string },
  state: 'unloaded' | 'loading' | 'loaded' | string,
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
  const howl = useRef<Howl | null>(null)
  const [state, setState] = useState('unloaded')
  const [error, setError] = useState<null | { id?: number, message: any }>(null)

  useEffect(() => {
    howl.current = new Howler.Howl({
      src,
      sprite,
      format,
      html5,
      xhrWithCredentials,
      preload,
      autoplay: false,
      onload: () => setState('loaded'),
      onloaderror: (id, message) => setError({ id, message }),
    })

    return () => {
      if (!howl.current) return
      howl.current.off()
      howl.current.stop()
      howl.current.unload()
      howl.current = null
    }
  }, [])

  if (!howl.current) return {
    howl: null,
    error: null,
    state: 'unloaded'
  }
  return {
    howl: howl.current,
    error,
    state: howl.current.state()
  }
}
