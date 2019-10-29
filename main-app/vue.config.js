module.exports = {
  chainWebpack: config => {
    // config.externals(['vue', 'vue-router', 'vuex'])
    config.entry = './public/main.js';
  }
}