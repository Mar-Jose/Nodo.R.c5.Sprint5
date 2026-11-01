import paisesAServices from '../services/paisesAServices.mjs'
import { sincronizarPaises } from '../services/sincronizarPaises.mjs'

export async function listarPaisesApi(_req, res, next) {
  try {
    const paises = await paisesAServices.obtenerTodos()
    res.json(paises)
  } catch (error) {
    next(error)
  }
}

export async function obtenerPaisApi(req, res, next) {
  try {
    const pais = await paisesAServices.obtenerPorId(req.params.id)
    res.json(pais)
  } catch (error) {
    next(error)
  }
}

export async function crearPaisApi(req, res, next) {
  if (req.validationErrors?.length) {
    return res.status(400).json({ errors: req.validationErrors })
  }

  try {
    const pais = await paisesAServices.crearPais(req.body)
    res.status(201).json(pais)
  } catch (error) {
    next(error)
  }
}

export async function actualizarPaisApi(req, res, next) {
  if (req.validationErrors?.length) {
    return res.status(400).json({ errors: req.validationErrors })
  }

  try {
    const pais = await paisesAServices.editarPais(req.params.id, req.body)
    res.json(pais)
  } catch (error) {
    next(error)
  }
}

export async function eliminarPaisApi(req, res, next) {
  try {
    await paisesAServices.eliminarPais(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function sincronizarPaisesApi(_req, res, next) {
  try {
    const paises = await sincronizarPaises()
    res.json({ sincronizados: paises.length })
  } catch (error) {
    next(error)
  }
}
