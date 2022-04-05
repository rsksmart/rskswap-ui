const { version } = require('./package.json')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  lintOnSave: false,
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.png'],
    },
    output: {
      filename: `[name]-${version}.[hash].bundle.js`,
    },
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
}
