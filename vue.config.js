const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  pluginOptions: {
    autoRouting: {
      pages: 'src/page',
      importPrefix: '@/page/',
      chunkNamePrefix: 'page-'
    },
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: ['./src/style/theme.less', './src/style/mixin.less']
    }
  },
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['javascript', 'css', 'html', 'json'],
        features: ['coreCommands', 'find']
      })
    ]
  }
}
