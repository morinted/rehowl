import React, { useState } from 'react'
import { Rehowl, Play } from '../src'
// @ts-ignore
import sound1 from './static/audio/sound1.mp3'

export default {
  title: 'Render Props: Rehowl',
};

export const toggleStop = () => {
  const [stop, setStop] = useState(true)
  return (
    <Rehowl src={sound1}>{
      ({ howl, state }) => <>
        <p>State: {state}</p>
        <button onClick={() => setStop(!stop)}>
          {stop ? 'Start' : 'Stop'}
        </button>
        <Play howl={howl} stop={stop}>{
          ({ playing }) => <>Playing: {playing().toString()}</>
        }</Play>
      </>
    }</Rehowl>
  )
}
