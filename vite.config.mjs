import { defineConfig } from "vite"
import fs from "node:fs"
import path from "node:path"

// Make the dev server behave like a static host (e.g. GitHub Pages): redirect
// an extensionless directory path to its trailing-slash form so "/radio"
// serves "radio/index.html" instead of falling back to the homepage. The
// query string (e.g. ?station=<id>) is preserved through the redirect.
export default defineConfig({
  plugins: [
    {
      name: "trailing-slash-dir-index",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const q = req.url.indexOf("?")
          const pathname = q === -1 ? req.url : req.url.slice(0, q)
          const query = q === -1 ? "" : req.url.slice(q)
          if (
            pathname !== "/" &&
            !pathname.endsWith("/") &&
            !path.extname(pathname)
          ) {
            const indexFile = path.join(
              server.config.root,
              pathname,
              "index.html",
            )
            if (fs.existsSync(indexFile)) {
              res.statusCode = 301
              res.setHeader("Location", pathname + "/" + query)
              res.end()
              return
            }
          }
          next()
        })
      },
    },
  ],
})
