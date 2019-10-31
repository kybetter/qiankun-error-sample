const packageName = 'vue'

module.exports = {
  // pages: {
    // index: 'src/main.js',
    // sub: 'src/sub-main.js',
  // },
  // filenameHashing: false,
  // productionSourceMap: false,
  // css: {
  //   extract: false,
  // },
  publicPath: '//localhost:8081/',
  chainWebpack(config) {
    config.output.set('library', `${packageName}-[name]`)
    config.output.set('libraryTarget', 'umd')
    config.output.set('jsonpFunction', `webpackJsonp_${packageName}`)
    // config.output.filename = 'app.js';
    // config.entryPoints.clear()
    // config.entry('child').add('./src/main.js').end()
    // config.output.filename('child.js').library('child').libraryTarget('amd').end()
    // config.output.filename('[name].app.js')
  },
  // outputDir: 'server/public',
  // output: {
    // filename: 'main.js',
    // path: path.resolve(__dirname, 'dist'),
  // },
}