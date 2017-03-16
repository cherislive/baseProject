module.exports = function(env = {}){

  const webpack           = require('webpack'),
        ExtractTextPlugin = require('extract-text-webpack-plugin'),
        HtmlWebpackPlugin = require('html-webpack-plugin'),
        { resolve }       = require('path'),
         utils            = require('./build/utils'),
        // resolve(__dirname, './dist'),
        // path.join(__dirname, '../node_modules')
        fs                = require('fs'),
        packageConf       = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  let name                = packageConf.name,
      version             = packageConf.version,
      library             = name.replace(/^(\w)/, m => m.toUpperCase()),
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
    /*
    html-webpack-plugin用来打包入口html文件
    entry配置的入口是js文件, webpack以js文件为入口, 遇到import, 用配置的loader加载引入文件
    但作为浏览器打开的入口html, 是引用入口js的文件, 它在整个编译过程的外面,
    所以, 我们需要html-webpack-plugin来打包作为入口的html文件
    */
    new HtmlWebpackPlugin({
      /*
      template参数指定入口html文件路径, 插件会把这个文件交给webpack去编译,
      webpack按照正常流程, 找到loaders中test条件匹配的loader来编译, 那么这里html-loader就是匹配的loader
      html-loader编译后产生的字符串, 会由html-webpack-plugin储存为html文件到输出目录, 默认文件名为index.html
      可以通过filename参数指定输出的文件名
      html-webpack-plugin也可以不指定template参数, 它会使用默认的html模板.
      */
      template: './src/index.html'
    })
  );

  // 分离css单独打包
  plugins.push(
    new ExtractTextPlugin(utils.assetsPath('css/[name].min.css'))
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

  loaders.push({
    test: /\.json$/,
    // use: ['style-loader', 'css-loader', 'postcss-loader']
    loader: 'json'
  },{
    test: /\.html$/,
    use:[{
      loader: 'html-loader',
      options: {
        /*
        html-loader接受attrs参数, 表示什么标签的什么属性需要调用webpack的loader进行打包.
        比如<img>标签的src属性, webpack会把<img>引用的图片打包, 然后src的属性值替换为打包后的路径.
        使用什么loader代码, 同样是在module.rules定义中使用匹配的规则.

        如果html-loader不指定attrs参数, 默认值是img:src, 意味着会默认打包<img>标签的图片.
        这里我们加上<link>标签的href属性, 用来打包入口index.html引入的favicon.png文件.
        */
        attrs: ['img:src', 'link:href']
      }
    }]
  },{
    /*
    从loader的配置'css?minimize&-autoprefixer!postcss'上看
    实际上就是先让postcss-loader处理完了再传递给css-loader
    而postcss项则是postcss-loader所接受的参数
    实际上就是返回一个包含你所需要的postcss's plugins的数组

    autoprefixer: 自动检测兼容性给各个浏览器加个内核前缀的插件
     *
     **/
    test: /\.css$/,
    use: ExtractTextPlugin.extract({ 
      fallbackLoader: 'style-loader', 
      loader: ['css-loader?minimize&-autoprefixer', 'postcss-loader']
    })    
  },{
    test: /favicon\.png$/,    // 匹配favicon.png
    use: [{
      loader: 'file-loader',
      options: { 
        /*
        name: 指定文件输出名
        [name]是源文件名, 不包含后缀. [ext]为后缀. [hash]为源文件的hash值,
        这里我们保持文件名, 在后面跟上hash, 防止浏览器读取过期的缓存文件.
        */
        name: utils.assetsPath('[name].[ext]?[hash]')
      }
    }]
  },{
    test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,    
    exclude: /favicon\.png$/, // 排除favicon.png, 因为它已经由上面的loader处理了. 如果不排除掉, 它会被这个loader再处理一遍
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[ext]')
      }
    }]
  },{
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: [{
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    }]
  });


  return {
    performance: { // 开发环境关闭performance.hints
      hints: env.production ? 'warning' : false
    },
    entry: {
      app: './src/main'
    },
    output: {
      filename: utils.assetsPath(env.production ? `js/${name}.js?t=[chunkhash]` : `js/${name}.js`),
      path: resolve(__dirname, './dist'),
      publicPath: './',
      library: `${library}`,
      libraryTarget: 'umd'
    },

    plugins: plugins,

    module: {
      loaders: loaders
    },

    devServer: {
      // port: 8100,
      /*
      historyApiFallback用来配置页面的重定向

      SPA的入口是一个统一的html文件, 比如
      http://localhost:8010/foo
      我们要返回给它
      http://localhost:8010/index.html
      这个文件

      配置为true, 当访问的文件不存在时, 返回根目录下的index.html文件
      */
      historyApiFallback: true,   
      inline: true, //实时刷新  
      // 指定index.html文件的url路径
      historyApiFallback: {
        index: '/static/'
      }
      // proxy: {
      //   "*": `http://localhost:${proxyPort}`
      // }
    }
  };
}