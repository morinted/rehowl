import * as React from 'react'
const { useState } = React
import { Rehowl } from '../src/Rehowl.js'
import { Play } from '../src/Play.js'
// @ts-ignore
import sound1 from './static/audio/sound1.mp3'
import type { Meta, StoryFn } from '@storybook/react'

const meta = {
  title: 'Components/Rehowl',
  component: Rehowl,
  tags: ['autodocs'],
} satisfies Meta<typeof Rehowl>

export default meta
type Story = StoryFn<typeof Rehowl>

export const playPause: Story = () => {
  const [play, setPlay] = useState(false)
  return (
    <Rehowl src={sound1} preload={false}>
      {({ howl, state, load }) => (
        <>
          <button onClick={load}>Load source</button>
          <button onClick={() => setPlay(!play)}>{play ? 'Pause' : 'Play'}</button>

          <p>State: {state}</p>
          <Play howl={howl} pause={!play}>
            {({ playing }) => <p>Playing: {playing().toString()}</p>}
          </Play>
        </>
      )}
    </Rehowl>
  )
}
