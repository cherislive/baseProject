https://segmentfault.com/a/1190000007914129
https://www.h5jun.com/post/using-webpack2-and-npm-scripts.html



安装淘宝镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org

初始化项目
npm init

package.json
--save-dev 把安装的包和版本号记录到devDependencies对象中   打包工具和测试工具
--save     会记录到dependencies对象中                      浏览器中执行的

安装eslint 用来检查语法报错
cnpm install eslint eslint-config-enough eslint-loader --save-dev


npm install

安装webpack和它的插件
cnpm install webpack webpack-dev-server html-webpack-plugin html-loader css-loader style-loader file-loader url-loader --save-dev

webpack-dev-server webpack开发调试服务器
html-webpack-plugin, html-loader, css-loader, style-loader等看名字就知道是打包html文件, css文件的插件, 大家在这里可能会有疑问, html-webpack-plugin和html-loader有什么区别, css-loader和style-loader有什么区别, 我们等会看配置文件的时候再讲.
file-loader和url-loader是打包二进制文件的插件, 具体也在配置文件章节讲解.


把我们写的ES6源代码转化成ES5, 这样我们源代码写ES6, 打包时生成ES5.
npm install babel-preset-es2015 babel-preset-stage-2 --save-dev

分离css单独打包
npm install extract-text-webpack-plugin --save-dev


在开发环境中运行(package.json)
{
  "scripts": {
    "dev": "webpack-dev-server -d --hot --port 8097 --env.dev",
    "build": "rm -rf dist && webpack -p --env.production"
  }
}

-d 参数是开发环境(Development)的意思, 它会在我们的配置文件中插入调试相关的选项, 比如打开debug, 打开sourceMap, 代码中插入源文件路径注释.
--hot 开启热更新功能, 参数会帮我们往配置里添加HotModuleReplacementPlugin插件, 虽然可以在配置里自己写, 但有点麻烦, 用命令行参数方便很多.
-p参数会开启生产环境模式, 这个模式下webpack会将代码做压缩等优化.
--port 指定端口