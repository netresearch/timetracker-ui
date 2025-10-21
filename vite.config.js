import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: 'static',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'scss': fileURLToPath(new URL('./src/assets/scss', import.meta.url))
    }
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/tt': {
        target: process.env.TIMETRACKER_URL || 'https://tt.netresearch.de',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyRes', function (proxyRes) {
            delete proxyRes.headers.host
            let cookie = proxyRes.headers['set-cookie']
            if (cookie) {
              const addCookiePath = (c) => {
                if (c.indexOf('path=') < 0) {
                  return c.trim() + '; path=/'
                } else {
                  return c.replace(/;\s*path=[^;]+/, '; path=/')
                }
              }
              cookie = Array.isArray(cookie) ? cookie.map(addCookiePath) : addCookiePath(cookie)
              proxyRes.headers['set-cookie'] = cookie
            }
          })
          proxy.on('error', function (err, _req, res) {
            console.error('Proxy error:', err.message)
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                error: 'Bad Gateway',
                message: 'Unable to connect to timetracker backend'
              }))
            }
          })
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia', 'axios'],
          'bootstrap': ['bootstrap']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'abs-percent']
      }
    }
  }
})


