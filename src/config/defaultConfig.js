module.exports = {
  root: process.cwd(),
  hostname: '127.0.0.1',
  port: 9527,
  compress: /\.(html|js|css|md)/,
  cache: {
    maxAge: 600, // 缓存时间 秒
    expires: true, // 是否支持expires
    cacheControl: true, // 是否支持cacheControl
    lastModified: true, // 是否支持lastModified
    etag: true // 是否支持etag
  }
}
