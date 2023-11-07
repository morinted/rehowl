import remarkGfm from 'remark-gfm'
import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)', '../stories/**/*.mdx'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-essentials',
  ],
  typescript: {
    reactDocgen: 'react-docgen',
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
}
export default config
