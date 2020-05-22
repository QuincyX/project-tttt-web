module.exports = {
  pluginOptions: {
    autoRouting: {
      pages: 'src/page',
      importPrefix: '@/page/',
      chunkNamePrefix: 'page-',
    },
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: ['./src/style/theme.less', './src/style/mixin.less'],
    },
  },
}
