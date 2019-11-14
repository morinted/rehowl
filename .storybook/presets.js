const path = require('path')

module.exports = [
  '@storybook/addon-docs/react/preset',
  {
    name: '@storybook/preset-typescript',
    options: {
      tsLoaderOptions: {
        configFile: path.resolve(__dirname, '../tsconfig.storybook.json'),
      },
      tsDocgenLoaderOptions: {
        tsconfigPath: path.resolve(__dirname, '../tsconfig.storybook.json')
      }
    }
  }
]
