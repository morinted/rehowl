import { useEffect, useRef } from 'react'
import Howler from 'howler'

type Props = {
  src: string | string[]
  sprite: IHowlSoundSpriteDefinition
  format?: string[]
  playing?: boolean
  mute?: boolean
  loop?: boolean
  preload?: boolean
  volume?: number
  onInit?: (sound: Howl) => void
  onEnd?: () => void
  onPause?: () => void
  onPlay?: (id: number) => void
  onVolume?: (id: number) => void
  onStop?: (id: number) => void
  onLoad?: () => void
  onLoadError?: (id: number) => void
  html5?: boolean
}

export default function Howl(props: Props) {
  const {
    src,
    format,
    playing,
    mute,
    loop,
    preload,
    volume,
    onInit,
    onEnd,
    onPause,
    onPlay,
    onVolume,
    onStop,
    onLoad,
    onLoadError,
    html5,
  } = props
  const sound = useRef<Howl | null>(null)

  useEffect(() => {
    sound.current = new Howler.Howl({
      src,
      autoplay: playing,
      format,
      loop,
      preload,
      volume,
      mute,
      html5
    })

    if (onInit) onInit(sound.current)

    return () => {
      if (!sound.current) return
      sound.current.stop()
      sound.current.unload()
      sound.current = null
    }
  }, [JSON.stringify(src)])

  return null
}
