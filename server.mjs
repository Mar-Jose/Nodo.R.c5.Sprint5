import 'dotenv/config'
import express from 'express'
import methodOverride from 'method-override'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import paisesARoutes from './src/routes/paiseARoutes.mjs'

const app = express()
const rootDirectory = path.dirname(fileURLToPath(import.meta.url))

app.set('view engine', 'ejs')
app.set('views', path.join(rootDirectory, 'src', 'views'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use('/api/paisesA', paisesARoutes)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).send('Ocurrió un error al procesar la solicitud.')
})

export default app
