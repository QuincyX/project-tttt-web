module.exports = {
  pluginOptions: {
    autoRouting: {
      pages: 'src/page',
      importPrefix: '@/page/',
      chunkNamePrefix: 'page-',
    },
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [],
    },
  },
}
