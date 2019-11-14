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

### Documentation and Live Examples

Documentation and live examples are available at <https://tedmor.in/rehowl>

The source of these examples is [./stories](./stories)

## Rationale

When deciding to use Howler in a React project, a quick Google Search brings you to [react-howler](https://khoanguyen.me/react-howler/).

There are a few issues that make ReactHowler unsuitable for my needs:

- No support for playing multiple sounds on one Howl instance
- No support for audio sprites
- If you want to do more than the very basic API, you must break out the howler instance using refs
- Use of componentWillReceiveProps

Overall, it feels much more like a barebones wrapper for Howler that doesn't really give you any help when trying to integrate it into your components.

My main goals in this project are to make a library that feels like Howler, if Howler were built for React.


