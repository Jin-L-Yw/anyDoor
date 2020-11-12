const http = require('http')
const chalk = require('chalk')
const path = require('path')
const conf = require('./config/defaultConfig')
const router = require('./helper/router')

// npm i -g supervisor 安装自动更新
// 启动时不用node启动，用supervisor .\src\index.js，修改后就能自动重启了
// npm i handlebars 模板引擎
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url) // 将编码转为中文
  const filePath = path.join(conf.root, url)
  router(req, res, filePath)
})

server.listen(conf.port, conf.hostname, () => {
  const addr = `http://${conf.hostname}:${conf.port}`
  console.log(`Server started at ${chalk.green(addr)}`);
})
