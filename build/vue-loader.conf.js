var utils = require('./utils')
var config = require('./config')
var isProduction = utils.isProduction()
var pxtorem = require('postcss-pxtorem')

module.exports = {
  // 解决把图片提前 require 传给一个变量再传给组件
  transformToRequire: {
    avatar: ['default-src']
  },
  // 为了去掉元素间的空格
  preserveWhitespace: false,
  postcss: [pxtorem({
    rootValue: 37.5,
    unitPrecision: 5,
    propList: ['font', 'font-size', 'line-height', 'letter-spacing', 'height', 'min-height', 'width', 'min-width'],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0
  })],
  autoprefixer: {
    browsers: ["Android >= 2.3", "iOS >= 4"], //, "ChromeAndroid > 1%"
    cascade: false // 不美化输出 css
  },
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  })
}
