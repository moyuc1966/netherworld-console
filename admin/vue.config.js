const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    productionSourceMap: true,
    devServer: {
        historyApiFallback: true,
        allowedHosts: 'all'
    }
})