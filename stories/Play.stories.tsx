import { useHowl, Play } from '../src'
import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Play',
  component: Play,
}

// @ts-ignore
import sound1 from './static/audio/sound1.mp3'
// @ts-ignore
import sound2mp3 from './static/audio/sound2.mp3'
// @ts-ignore
import sound2web from './static/audio/sound2.webm'

export const toggleMute = () => {
  const { howl, state } = useHowl({ src: sound1 })
  const [mute, setMute] = useState(true)
  return (
    <>
      <p>State: {state}</p>
      <button onClick={() => setMute(!mute)}>{mute ? 'Unmute' : 'Mute'}</button>
      <Play howl={howl} mute={mute} onPlay={action('onPlay')} onMute={action('onMute')}>
        {({ playing }) => <>Playing: {playing().toString()}</>}
      </Play>
    </>
  )
}