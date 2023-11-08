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

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  typescript: {
    reactDocgenTypescriptOptions: {
      include: ['**/*.ts', '**/*.tsx'],
    },
  },
  webpackFinal: async (config) => {
    const customConfig = { ...config }
    // use ts-loader to process typescript files
    customConfig.module.rules.push({
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    })
    // Configure webpack to allow using .js extension for typescript file imports.
    // You only need this if you're adding .js to relative imports in your project.
    // Refer: https://github.com/microsoft/TypeScript/issues/42813#issuecomment-942633095
    customConfig.resolve.extensionAlias = {
      '.js': ['.tsx', '.ts', '.js'],
    }
    return customConfig
  },
}
export default config
