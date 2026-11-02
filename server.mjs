import 'dotenv/config'
import express from 'express'
import methodOverride from 'method-override'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import paisesAApiRoutes from './src/routes/paisesAApiRoutes.mjs'
import paisesARoutes from './src/routes/paisesARoutes.mjs'

const app = express()
const rootDirectory = path.dirname(fileURLToPath(import.meta.url))
const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

app.set('view engine', 'ejs')
app.set('views', path.join(rootDirectory, 'src', 'views'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use('/api/paises', paisesAApiRoutes)
app.use('/api/paisesA', paisesARoutes)

if (isDirectExecution || process.env.NODE_ENV === 'production') {
  const distDirectory = path.join(rootDirectory, 'dist')
  app.use(express.static(distDirectory))
  app.get('/{*path}', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(distDirectory, 'index.html'))
  })
}

app.use((error, req, res, _next) => {
  if (req.path === '/api/paises' || req.path.startsWith('/api/paises/')) {
    const status = error.status === 400 ? 400 : 500
    const message = status === 400 ? 'El cuerpo JSON de la solicitud no es válido.' : 'Error interno del servidor.'
    if (status === 500) console.error(error)
    return res.status(status).json({ error: message })
  }
  console.error(error)
  return res.status(500).send('Ocurrió un error al procesar la solicitud.')
})

if (isDirectExecution) {
  const port = Number(process.env.PORT) || 3000
  app.listen(port, () => {
    console.log(`Servidor disponible en el puerto ${port}.`)
  })
}

export default app
