import { http } from '../api/http.js'

export const paisesApi = {
  async listar() {
    const { data } = await http.get('/paises')
    return data
  },
  async obtener(id) {
    const { data } = await http.get(`/paises/${encodeURIComponent(id)}`)
    return data
  },
  async crear(pais) {
    const { data } = await http.post('/paises', pais)
    return data
  },
  async sincronizar() {
    const { data } = await http.post('/paises/sincronizar')
    return data
  },
  async actualizar(id, pais) {
    const { data } = await http.put(`/paises/${encodeURIComponent(id)}`, pais)
    return data
  },
  async eliminar(id) {
    await http.delete(`/paises/${encodeURIComponent(id)}`)
  },
}
