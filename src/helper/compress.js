// 压缩
const {createGzip, createDeflate} = require('zlib')

module.exports = (rs, req, res) => {
  const acceptEncoding = req.headers['accept-encoding']
  // 只支持gzip或deflate
  if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
    return rs
  } else if (acceptEncoding.match(/\bgzip\b/)) { // 优先gzip压缩
    res.setHeader('Content-Encoding', 'gzip')
    return rs.pipe(createGzip())
  } else if (acceptEncoding.match(/\bdeflate\b/)) {
    res.setHeader('Content-Encoding', 'deflate')
    return rs.pipe(createDeflate())
  }
}
