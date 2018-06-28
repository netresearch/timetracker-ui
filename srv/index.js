const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxy({})

function addCookiePath (cookie) {
  if (cookie.indexOf('path=') < 0) {
    return cookie.trim() + '; path=/'
  } else {
    return cookie.replace(/;\s*path=[^;]+/, '; path=/')
  }
}

proxy.on('proxyRes', function (proxyRes, req, res) {
  delete proxyRes.headers.host

  let cookie = proxyRes.headers['set-cookie']
  if (cookie) {
    if (Array.isArray(cookie)) {
      cookie = cookie.map(addCookiePath)
    } else {
      cookie = addCookiePath(cookie)
    }
    proxyRes.headers['set-cookie'] = cookie
  }
})

module.exports = function (app) {
  app.use('/tt', (req, res) => {
    proxy.web(req, res, {
      target: process.env.TIMETRACKER_URL,
      secure: process.env.SECURE || false,
      changeOrigin: true,
      autoRewrite: true
    })
  })
}
