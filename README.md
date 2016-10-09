# book-shop demo
A simple book-shop(IBM-task).

可通过链接：http://leyulive.com/test/ibm/ 查看效果

## Overview
- 为保证浏览器兼容性，选择jquery 1.12.4版本
- 使用了jquery-ui中的拖拽效果和弹窗功能
- 引入requireJS，模块化开发
- 引入doT模板引擎，并使用gulp预编译，使其转为js模块
- 使用gulp对js、css等资源文件进行合并、压缩打包，减少散文件，提高请求效率
- 构建打包时，对静态资源文件计算hash指纹，做破缓存（cache break）处理
- 引入了Promise，方便异步代码链式写法。
- 使用了es5的特性，对于ie9以下自动加载es5-shim兼容
- 利用localStorage对购物车数据进行了缓存

## Start
- npm install (安装依赖)
- npm run serve (启动web server，默认为http://localhost:9001)
- 业务逻辑文件放在src文件夹
- dist文件夹为构建打包后的产出

## Structure
- src 项目源码
    - index.html 入口文件
    - mock 模拟数据
    - css 样式代码
    - js 业务代码
    - lib 封装的辅助模块代码
    - tpl 业务模板
    - vendor 第三方依赖
    - img 图片文件

- dist 构建后的代码（npm run build自动生成）

