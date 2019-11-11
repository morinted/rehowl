# Rehowl

An opinionated React wrapper for [howler.js](https://howlerjs.com/)

## Installation

Rehowl has react and howler as peer dependencies so that you can manage your own versions.

```sh
npm install --save-dev howler rehowl
```

```sh
yarn add -D howler rehowl
```

## Quickstart

### Hook interface

The recommended method to use Rehowl is through its custom hook and `<Play />` element.

Similar to Howler, you initialize a Howl and then can play sounds from it.

```js
import React from 'react'
import { useHowl, Play } from 'rehowl'

const MyComponent = () => {
  const { howl, state, error } = useHowl({
    src: ['sound1.mp3', 'sound1.wav']
  })
  return <Play howl={howl} />
}
```


### Render props interface

In a class component, you must use the render props pattern with `<Rehowl />`.

```js
import React, { Component } from 'react'
import { Rehowl, Play } from 'rehowl'

class MyComponent extends Component {
  render() {
    return (
      <Rehowl src={[ 'sound1.mp3', 'sound1.wav' ]}>{
        ({ howl, state, error }) => <Play howl={howl} />
      }</Rehowl>
    )
  }
}
```

### Examples

For more examples (while documentation is still light), please see [storybook stories](./stories).

## Rationale / Why not react-howler

When deciding to use Howler in a React project, a quick Google Search brings you to [react-howler](https://khoanguyen.me/react-howler/).

There are a few issues that make ReactHowler unsuitable for my needs:

- No support for playing multiple sounds on one Howl instance
- No handling of dynamic callbacks
- No support for sprite sheets
- If you want to do more than the very basic API, you must break out the howler instance using refs
- Use of componentWillReceiveProps

Overall, it feels much more like a barebones wrapper for Howler that doesn't really give you any help when trying to integrate it into your components.

My main goals in this project are to make a library that feels like Howler, if Howler were built for React.


