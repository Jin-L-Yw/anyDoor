const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const Handlebars = require('handlebars') // 引入模板引擎
const conf = require('../config/defaultConfig')
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const mime = require('../helper/mime')
const compress = require('../helper/compress')
const range = require('../helper/range')
const isFresh = require('../helper/cache')

// 得到绝对路径(当前文件的绝对路径，再../template/..)
const tplPath = path.join(__dirname, '../template/dir.tpl')
// 读取模板(不能使用相对路径)
const source = fs.readFileSync(tplPath)
// 生成template
const template = Handlebars.compile(source.toString())

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) { // 如果是文件，则直接读出来
      const contentType = mime(filePath)
      res.setHeader('Content-Type', `${contentType};charset=utf-8`)
      if (isFresh(stats, req, res)) {
        res.statusCode = 304
        res.end()
        return
      }
      let rs
      const {code, start, end} = range(stats.size, req, res)
      if (code === 200) {
        res.statusCode = 200
        rs = fs.createReadStream(filePath)
      } else {
        res.statusCode = 206
        rs = fs.createReadStream(filePath, {start, end})
      }
      if (filePath.match(conf.compress)) {
        rs = compress(rs, req, res)
      }
      rs.pipe(res)
    } else if (stats.isDirectory()) { // 是文件夹
      const files = await readdir(filePath);
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      const dir = path.relative(conf.root, filePath) // 取一个路径相对于另外一个路径的相对地址
      const data = {
        files: files.map(file => {
          return {
            file,
            icon: mime(file)
          }
        }),
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : ''
      }
      // res.end(files.join(','))
      res.end(template(data))
    }
  } catch (err) {
    console.log(err);
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain;charset=utf-8')
    res.end(`${filePath}不是一个文件或文件夹!`)
  }
}
