import { useEffect, useRef, useState, useCallback } from 'react'

interface SoundInfo {
  playing: () => boolean
  duration: () => number
  seek: () => number
  volume: () => number
}

interface Props {
  /** Instance of Howl to play sounds from. */
  howl: null | Howl
  /** If specified, play a sprite instead of the entire source. */
  sprite?: string
  children?: (props: SoundInfo) => JSX.Element
  /**
   * Pause playback.
   *
   * @default false
   */
  pause?: boolean
  /**
   * Control playback volume, from 0 to 1.
   *
   * @default 1
   */
  volume?: number
  /**
   * Mute playback.
   *
   * @default false
   */
  mute?: boolean
  /**
   * While true, playback will be stopped.
   *
   * Stopping sets seek to 0 and allows Howl to
   *
   * Consider setting pause to true and seek to 0 instead.
   *
   * @default false
   */
  stop?: boolean
  /**
   * The time to seek this sound to in seconds.
   *
   * The seek only applies once per value change.
   **/
  seek?: number
  /**
   * Set the rate of playback, from 0.5 to 4.
   *
   * @default 1
   */
  rate?: number
  /**
   * Whether to loop the track or sprite on play end.
   *
   * @default false
   */
  loop?: boolean
  /**
   * Fade a currently playing sound between two volumes.
   *
   * Values are [from, to, duration].
   */
  fade?: [number, number, number]
  /**
   * Listen for play events.
   *
   * Fires once when <Play /> is mounted even if the sound starts in a stopped or paused state.
   */
  onPlay?: () => void
  /**
   * Fires when play fails and provides the error message or code.
   */
  onPlayError?: (message: string) => void
  /**
   * Fires when play ends, meaning the sound reached its end, including every time a loop has finished.
   */
  onEnd?: () => void
  /**
   * Fires when this sound is paused, including on <Play /> mount if `pause` or `stop` is true.
   */
  onPause?: () => void
  /**
   * Fires when the sound is stopped.
   */
  onStop?: () => void
  /**
   * Fires when the sound is muted or unmuted.
   */
  onMute?: () => void
  /**
   * Fires when the sound's volume is set, including on <Play /> mount if `volume` is set.
   */
  onVolume?: () => void
  /**
   * Fires when the sound is seeked.
   */
  onSeek?: () => void
  /**
   * Fires when this sound's fade is complete.
   */
  onFade?: () => void
  /**
   * Fires when the rate of playback for this sound is changed.
   */
  onRate?: () => void
}

/**
 * Plays and controls sounds from a Howl.
 *
 * The Howl instance, provided by the `howl` prop, can come from `useHowl`,
 * `<Rehowl />`, or provided from your own use of howler.js
 *
 * You can render **multiple `<Play />` components** for a single
 * Howl instance in order to play multiple sounds or sprites at once.
 *
 * Event handlers fire only for the `<Play />` that they correspond to,
 * and not for every sound playing off of the Howl instance like in howler.js
 */
export default function Play(props: Props) {
  const { howl, pause, sprite, mute, volume, seek, fade, stop, rate, loop, children } = props

  const [start, setStart] = useState(false)
  const [playId, setPlayId] = useState<null | number>(null)
  const [playing, setPlaying] = useState(true)
  const [stopped, setStopped] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [seeking, setSeeking] = useState(false)

  // We use refs for the callbacks so that they can be dynamic.
  const onPlay = useRef<null | Function>(null)
  const onPlayError = useRef<null | Function>(null)
  const onEnd = useRef<null | Function>(null)
  const onPause = useRef<null | Function>(null)
  const onStop = useRef<null | Function>(null)
  const onMute = useRef<null | Function>(null)
  const onVolume = useRef<null | Function>(null)
  const onSeek = useRef<null | Function>(null)
  const onFade = useRef<null | Function>(null)
  const onRate = useRef<null | Function>(null)

  useEffect(() => {
    onPlay.current = props.onPlay || null
  }, [props.onPlay])
  useEffect(() => {
    onPlayError.current = props.onPlayError || null
  }, [props.onPlayError])
  useEffect(() => {
    onEnd.current = props.onEnd || null
  }, [props.onEnd])
  useEffect(() => {
    onPause.current = props.onPause || null
  }, [props.onPause])
  useEffect(() => {
    onStop.current = props.onStop || null
  }, [props.onStop])
  useEffect(() => {
    onMute.current = props.onMute || null
  }, [props.onMute])
  useEffect(() => {
    onVolume.current = props.onVolume || null
  }, [props.onVolume])
  useEffect(() => {
    onSeek.current = props.onSeek || null
  }, [props.onSeek])
  useEffect(() => {
    onFade.current = props.onFade || null
  }, [props.onFade])
  useEffect(() => {
    onRate.current = props.onRate || null
  }, [props.onRate])

  // Only load the rest of the component once the user wants to play.
  useEffect(() => {
    if (start) return
    if (pause || stop) return
    setStart(true)
  }, [start, pause, stop])

  useEffect(() => {
    if (!howl || !start) return
    let currentPlayId: undefined | number

    // Play the sound and get its ID.
    const startPlaying = !pause && !stop

    currentPlayId = howl.play(sprite)
    setPlayId(currentPlayId)

    // Initialize with the right volume.
    if (volume) {
      howl.volume(volume, currentPlayId)
    }

    if (!startPlaying) {
      howl.pause(currentPlayId)
      setPlaying(false)
    }

    howl.once('play', id => {
      // Update children on initial play.
      if (id !== currentPlayId) return
      setUnlocked(true)
    })
    howl.on('play', id => {
      if (id !== currentPlayId) return
      if (onPlay.current) {
        onPlay.current()
      }
    })
    howl.on('playerror', id => {
      if (id !== currentPlayId) return
      if (onPlayError.current) {
        onPlayError.current()
      }
    })
    howl.on('pause', id => {
      if (id !== currentPlayId) return
      if (onPause.current) {
        onPause.current()
      }
    })

    howl.on('end', id => {
      if (id !== currentPlayId) return
      if (onEnd.current) {
        onEnd.current()
      }
    })

    howl.on('stop', id => {
      if (id !== currentPlayId) return
      if (onStop.current) {
        onStop.current()
      }
    })

    howl.on('mute', id => {
      if (id !== currentPlayId) return
      if (onMute.current) {
        onMute.current()
      }
    })
    howl.on('volume', id => {
      if (id !== currentPlayId) return
      if (onVolume.current) {
        onVolume.current()
      }
    })
    howl.on('rate', id => {
      if (id !== currentPlayId) return
      if (onRate.current) {
        onRate.current()
      }
    })
    howl.on('seek', id => {
      if (id !== currentPlayId) return
      setSeeking(false)
      if (onSeek.current) {
        onSeek.current()
      }
    })
    howl.on('fade', id => {
      if (id !== currentPlayId) return
      if (onFade.current) {
        onFade.current()
      }
    })

    return () => {
      howl.stop(currentPlayId)
      setStart(false)

      howl.off('play', undefined, currentPlayId)
      howl.off('playerror', undefined, currentPlayId)
      howl.off('pause', undefined, currentPlayId)
      howl.off('end', undefined, currentPlayId)
      howl.off('stop', undefined, currentPlayId)
      howl.off('mute', undefined, currentPlayId)
      howl.off('volume', undefined, currentPlayId)
      howl.off('rate', undefined, currentPlayId)
      howl.off('seek', undefined, currentPlayId)
      howl.off('fade', undefined, currentPlayId)
      setPlayId(null)
    }
  }, [start, howl, sprite])

  useEffect(() => {
    /**
     * Use playing in state because queued events (like in the above useEffect)
     * will not apply immediately, so it's possible for us to attempt playing
     * twice when the sound is initialized. This causes some issues with Howler.
     */
    if (!howl || !playId || !unlocked) return
    if (stop) {
      if (!stopped) {
        howl.stop(playId)
        setStopped(true)
        setPlaying(false)
      }
      return
    }
    if (playing && pause) {
      howl.pause(playId)
      setStopped(false)
      setPlaying(false)
    } else if (!playing && !pause) {
      howl.play(playId)
      setStopped(false)
      setPlaying(true)
    }
  }, [howl, playId, stopped, unlocked, playing, pause, stop])

  useEffect(() => {
    if (!howl || !playId || !unlocked) return
    if (mute === undefined) return
    howl.mute(mute, playId)
  }, [howl, playId, unlocked, mute])

  useEffect(() => {
    if (!howl || !playId || !unlocked) return
    if (volume === undefined) return
    howl.volume(volume, playId)
  }, [howl, playId, unlocked, volume])

  useEffect(() => {
    if (!howl || !playId || !unlocked) return
    if (seek === undefined) return
    setSeeking(true)
    howl.seek(seek, playId)
  }, [howl, playId, unlocked, seek])

  useEffect(() => {
    if (!howl || !playId || !unlocked) return
    if (!fade) return
    const [from, to, duration] = fade
    howl.fade(from, to, duration, playId)
  }, [howl, playId, unlocked, JSON.stringify(fade)])

  useEffect(() => {
    if (!howl || !playId || !unlocked) return
    if (rate === undefined) return
    howl.rate(rate, playId)
  }, [howl, playId, unlocked, rate])

  useEffect(() => {
    if (!howl || !playId || !unlocked) return
    if (loop === undefined) return
    howl.loop(loop, playId)
  }, [howl, playId, unlocked, loop])

  const duration = useCallback(() => {
    if (!howl || !playId) return 0
    if (sprite) return howl.duration(playId)
    return howl.duration()
  }, [howl, playId])
  const getPlaying = useCallback(() => {
    if (!howl || !playId) return playing
    return howl.playing(playId)
  }, [howl, playId])
  const getSeek = useCallback(() => {
    if (!howl || !playId) return 0
    // Get seek
    if (seeking && seek !== undefined) return seek
    const position = howl.seek(playId)
    if (typeof position !== 'number') {
      return 0
    }
    return position
  }, [howl, playId, seek, seeking])
  const getVolume = useCallback(() => {
    if (!howl || !playId) return 0
    const volume = howl.volume(playId)
    if (typeof volume !== 'number') {
      return 0
    }
    return volume
  }, [howl, playId])

  if (!children || !playId || !howl) return null
  return children({
    duration,
    playing: getPlaying,
    seek: getSeek,
    volume: getVolume,
  })
}
