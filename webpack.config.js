module.exports = function(env = {}){

  const webpack           = require('webpack'),
        HtmlWebpackPlugin = require('html-webpack-plugin'),
        { resolve }       = require('path'),
        fs                = require('fs'),
        packageConf       = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  let name                = packageConf.name,
      version             = packageConf.version,
      library             = name.replace(/^(\w)/, m => m.toUpperCase()),
      proxyPort           = 8081,
      plugins             = [],
      loaders             = [];

  if(env.production){   // 区别开发环境 生产环境
    name += `-${version}.min`;
    //compress js in production environment
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: false,
         }
      })
    );
  }

  // html-webpack-plugin用来打包入口html文件
  plugins.push(
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  );

  if(fs.existsSync('./.babelrc')){  // 用 babel 编译
    //use babel
    let babelConf = JSON.parse(fs.readFileSync('.babelrc'));
    loaders.push({
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: babelConf
    });
  }

  console.log('aaa')
  console.log(packageConf.name)

  return {
    entry: {
      app: './src/main.js'
    },
    output: {
      filename: `${name}.js`,
      path: resolve(__dirname, 'dist'),
      publicPath: '/static/js/',
      // library: `${library}`,
      // libraryTarget: 'umd'
    },

    plugins: plugins,

    module: {
      loaders: loaders
    },

    devServer: {
      port: 8100,
      historyApiFallback: true,      
      // 指定index.html文件的url路径
      historyApiFallback: {
        index: '/static/js/'
      }
      // proxy: {
      //   "*": `http://localhost:${proxyPort}`
      // }
    }
  };
}