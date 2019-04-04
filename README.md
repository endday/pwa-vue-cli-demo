## Vue CLI template
基于Vue CLI 3的项目开发模版，适配了小雨伞前端发布系统的目录结构

项目的dev模式比起以前的一错就挂的情况有所改善，会暂时停止构建，当修改后会继续重新构建

项目打包会生成dist/【项目名称】/，项目名称即为当前项目根目录名称，下载下来的默认为vue-cli-template，可自行根据需求修改

切记fiddler需要修改代理的目录名称，增加dist这一层目录

项目会直接匹配src目录下的第一个后缀名为html的文件作为页面片模版，有需要的可以将自己的页面片直接替换掉index.html

## 使用

克隆项目即可创建
```
git clone http://gitlab.xinhulu.com/mucfe/vue-cli-template.git
```

