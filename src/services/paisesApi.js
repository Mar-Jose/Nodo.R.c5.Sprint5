import { http } from '../api/http.js'

function validarPais(pais, operacion) {
  if (!pais || typeof pais !== 'object' || Array.isArray(pais)) {
    throw new Error(`La API devolvió un país inválido al ${operacion}.`)
  }
  if (pais.id == null && pais._id == null) {
    throw new Error(`La API devolvió un país sin ID al ${operacion}.`)
  }
  return pais
}

export const paisesApi = {
  async listar() {
    const { data } = await http.get('/paises')
    if (!Array.isArray(data)) {
      throw new Error('La API devolvió un listado de países inválido.')
    }
    return data
  },
  async obtener(id) {
    const { data } = await http.get(`/paises/${encodeURIComponent(id)}`)
    return validarPais(data, 'consultar')
  },
  async crear(pais) {
    const { data } = await http.post('/paises', pais)
    return validarPais(data, 'crear')
  },
  async sincronizar() {
    const { data } = await http.post('/paises/sincronizar')
    return data
  },
  async actualizar(id, pais) {
    const { data } = await http.put(`/paises/${encodeURIComponent(id)}`, pais)
    return validarPais(data, 'actualizar')
  },
  async eliminar(id) {
    await http.delete(`/paises/${encodeURIComponent(id)}`)
  },
}
