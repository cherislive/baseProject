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