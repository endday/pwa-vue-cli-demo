const path = require('path')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const projectName = path.resolve(__dirname).split(path.sep).pop()
const env = process.env.NODE_ENV
const isDev = env === 'development'
const publicPath = process.env.VUE_APP_STATIC_URL
const outputDir = `dist/${projectName}/`
const productionSourceMap = !!argv.sourceMap
const files = fs.readdirSync(path.join(__dirname, 'src/'))
const indexPath = files.find(file => path.extname(file) === '.html')

module.exports = {
    outputDir: outputDir,
    indexPath: indexPath,
    publicPath: `${publicPath}/${projectName}/`,
    lintOnSave: false,
    runtimeCompiler: true,
    productionSourceMap,
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
        if (isDev) {
            config.output.filename = 'js/[name].js'
            config.output.chunkFilename = 'js/[name].js'
        }
    }
}
