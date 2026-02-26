const http = require('node:http')
const https = require('node:https')
const { URL } = require('node:url')

function addCookiePath (cookie) {
  if (cookie.indexOf('path=') < 0) {
    return cookie.trim() + '; path=/'
  } else {
    return cookie.replace(/;\s*path=[^;]+/, '; path=/')
  }
}

module.exports = function (app) {
  app.use('/tt', (req, res) => {
    const targetUrl = process.env.TIMETRACKER_URL
    if (!targetUrl) {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Bad Gateway', message: 'TIMETRACKER_URL environment variable is not set' }))
      return
    }

    let target
    try {
      target = new URL(targetUrl)
    } catch (_err) {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Bad Gateway', message: 'Invalid TIMETRACKER_URL' }))
      return
    }

    const secure = process.env.SECURE !== 'false'
    const transport = target.protocol === 'https:' ? https : http

    const headers = { ...req.headers, host: target.host }
    delete headers.connection
    delete headers['proxy-connection']

    const options = {
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      path: req.url,
      method: req.method,
      headers,
      rejectUnauthorized: secure
    }

    const proxyReq = transport.request(options, (proxyRes) => {
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

      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res)
    })

    proxyReq.on('error', function (err) {
      console.error('Proxy error:', err.message)
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          error: 'Bad Gateway',
          message: 'Unable to connect to timetracker backend',
          hint: 'Check that TIMETRACKER_URL is correct and the backend is running'
        }))
      }
    })

    req.pipe(proxyReq)
  })
}
