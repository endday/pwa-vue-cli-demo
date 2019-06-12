const path = require('path')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const isDev = process.env.NODE_ENV === 'development'
const srcFiles = fs.readdirSync(path.resolve(__dirname, 'src/'))
// 项目名称
const projectName = path.resolve(__dirname).split(path.sep).pop()
// 公共地址前缀 根据环境配置 在.env.development 和 .env.production 中配置
const publicPath = process.env.VUE_APP_STATIC_URL
// 生产环境构建文件的目录
const outputDir = `dist/${projectName}/`
// 页面片路径
const indexPath = srcFiles.find(file => path.extname(file) === '.html')
// 入口路径 (相对路径)
const entryPath = './src/main.js'

module.exports = {
  outputDir: outputDir,
  indexPath: indexPath,
  publicPath: `${publicPath}/${projectName}/`,
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  productionSourceMap: !!argv.sourceMap,
  crossorigin: 'anonymous',
  chainWebpack: config => {
    config.plugin('html')
      .tap(args => {
        args[0].minify = false
        args[0].filename = indexPath
        args[0].template = path.join(__dirname, `src/${indexPath}`)
        return args
      })
    if (isDev) {
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
    }
  },
  configureWebpack: config => {
    config.entry.app[0] = entryPath
    if (isDev) {
      config.output.filename = 'js/[name].js'
      config.output.chunkFilename = 'js/[name].js'
    }
  }
}
