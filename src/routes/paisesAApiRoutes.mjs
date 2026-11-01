import express from 'express'
import {
  actualizarPaisApi,
  crearPaisApi,
  eliminarPaisApi,
  listarPaisesApi,
  obtenerPaisApi,
  sincronizarPaisesApi,
} from '../controllers/paisesAApiController.mjs'
import { paisesAValidations } from '../validations/paisesAValidaciones.mjs'
import { validate } from '../validations/validationMiddleware.mjs'

const router = express.Router()

router.get('/', listarPaisesApi)
router.get('/:id', obtenerPaisApi)
router.post('/', paisesAValidations, validate, crearPaisApi)
router.post('/sincronizar', sincronizarPaisesApi)
router.put('/:id', paisesAValidations, validate, actualizarPaisApi)
router.delete('/:id', eliminarPaisApi)

router.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado.' })
})

router.use((error, _req, res, _next) => {
  if (res.headersSent) return

  if (error.message === 'País no encontrado') {
    return res.status(404).json({ error: error.message })
  }
  if (
    error.message === 'El país ya existe' ||
    error.message === 'No se pudo actualizar el país' ||
    error.message === 'No se pudo eliminar el país'
  ) {
    const status = error.message === 'El país ya existe' ? 409 : 404
    return res.status(status).json({ error: error.message })
  }
  if (error.message?.startsWith('Falta configurar VITE_MOCKAPI_URL')) {
    return res.status(503).json({ error: error.message })
  }

  console.error(error)
  return res.status(502).json({ error: 'No se pudo completar la operación con MockAPI.' })
})

export default router
