# Rehowl

An opinionated React wrapper for [howler.js](https://howlerjs.com/)

<!-- TOC -->

- [Rehowl](#rehowl)
  - [Installation](#installation)
  - [Documentation and Live Examples](#documentation-and-live-examples)
  - [Quick start](#quick-start)
  - [Rationale](#rationale)

<!-- /TOC -->

## Installation

Rehowl has react and howler as peer dependencies so that you can manage your own versions.

```sh
npm install howler rehowl
```

```sh
yarn add howler rehowl
```

## Documentation and Live Examples

Documentation and live examples are available at <https://tedmor.in/rehowl>

The source of these examples is [./stories](./stories)

## Quick start

It's recommended to view [the examples](https://tedmor.in/rehowl).

However, at its core Rehowl works by using `useHowl` or `<Howl />` to get a **howl instance**, then playing sounds off that instance with one or more `<Play />` components:

```js
import { useHowl, Play } from 'rehowl'
import bark from './assets/bark.mp3'

const Autoplay = () => {
  const { howl, state } = useHowl({ src: bark })
  return <Play howl={howl} />
}
```

See [the docs](https://tedmor.in/rehowl) for examples on how to play multiple sounds off of one howl, how to use audio sprites, and how to control volume, seek, etc.

## Rationale

When deciding to use Howler in a React project, a quick Google Search brings you to [react-howler](https://khoanguyen.me/react-howler/).

There are a few issues that make ReactHowler unsuitable for my needs:

- No support for playing multiple sounds on one Howl instance
- No support for audio sprites
- If you want to do more than the very basic API, you must break out the howler instance using refs
- Use of componentWillReceiveProps

Overall, it feels much more like a barebones wrapper for Howler that doesn't really give you any help when trying to integrate it into your components.

My main goals in this project are to make a library that feels like Howler, if Howler were built for React.
