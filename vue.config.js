/*
 * @Author: your name
 * @Date: 2020-10-24 09:43:50
 * @LastEditTime: 2020-12-09 09:51:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \case-manage\vue.config.js
 */
module.exports = {
  // publicPath: '/api',
  devServer: {
    disableHostCheck: true,
    port: 8080,
    proxy:{
      '/api':{
        target: 'http://192.168.1.195:80',
        // target: 'http://192.168.1.118:8073',
        changeOrigin: true,
        pathRewrite:{
          '^/api': 'api',
          // '^/api': '',
        }
      }
    },
  },
  configureWebpack: {
    externals: {
      BMapGL: 'BMapGL',
      BMapLib: 'BMapLib'
    },
  }
}