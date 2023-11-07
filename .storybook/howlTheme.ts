import { create } from '@storybook/theming/create'

const howlerBackground = '#eee9db'
const howlerLightBackground = '#FBF9F6'
const howlerForeground = '#786956'
const howlerTitleFontColor = '#635748'
const howlerFontColor = '#403832'
const howlerAccentColor = '#69BB5F'

export default create({
  base: 'light',

  colorPrimary: howlerTitleFontColor,
  colorSecondary: howlerAccentColor,

  // UI
  appBg: howlerBackground,
  appContentBg: howlerLightBackground,
  appBorderColor: howlerForeground,
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: howlerFontColor,
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'white',
  barSelectedColor: 'black',
  barBg: howlerForeground,

  brandTitle: 'Rehowl',
  brandUrl: 'https://tedmor.in/rehowl',
})
