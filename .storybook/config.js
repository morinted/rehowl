import { addParameters, configure } from '@storybook/react'
import howlTheme from './howlTheme'
import './story_styles.css'

const sectionOrder = {
  'rehowl': 0,
  'hooks': 1,
  'components': 2
}

const getStorySection =
  story => sectionOrder[story[1].id.split('-')[0]]

addParameters({
  options: {
    hierarchySeparator: /\./,
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : getStorySection(a) - getStorySection(b),
    theme: howlTheme
  }
})

configure(require.context('../stories', true, /\.stories\.(tsx|mdx)$/), module);
