import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'handle-content',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/content/')) {
            const filePath = path.join(process.cwd(), 'public', req.url)
            try {
              await fs.promises.access(filePath, fs.constants.F_OK)
              // Wenn es eine .md Datei ist, setzen wir den Content-Type
              if (req.url.endsWith('.md')) {
                res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
                const content = await fs.promises.readFile(filePath, 'utf-8')
                res.end(content)
                return
              }
              next()
            } catch {
              res.writeHead(404, { 'Content-Type': 'text/plain' })
              res.end('Not Found')
              return
            }
          } else {
            next()
          }
        })
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      strict: true,
    }
  },
  preview: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  appType: 'spa',
})
