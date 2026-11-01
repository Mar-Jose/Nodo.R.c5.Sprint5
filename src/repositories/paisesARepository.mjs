import { getMockApiHttp, isMockApiNotFound } from '../api/mockApiHttp.mjs'
import { normalizarTexto } from '../utils/formato/normalizarTexto.js'

const CAMPOS_BUSCABLES = new Set([
  'nombreOficial',
  'capital',
  'languages',
  'borders',
  'area',
])

class paisesARepository {
  async getAll() {
    const paises = []
    const limit = 100

    for (let page = 1; ; page += 1) {
      const { data } = await getMockApiHttp().get('', { params: { page, limit } })
      if (!Array.isArray(data)) {
        throw new Error('MockAPI devolvió una respuesta inesperada al consultar los países.')
      }

      paises.push(...data)
      if (data.length < limit) return paises
    }
  }

  async getById(id) {
    try {
      const { data } = await getMockApiHttp().get(encodeURIComponent(id))
      return data
    } catch (error) {
      if (isMockApiNotFound(error)) return null
      throw error
    }
  }

  async create(data) {
    const { data: paisCreado } = await getMockApiHttp().post('', data)
    return paisCreado
  }

  async update(id, data) {
    try {
      const { data: paisActualizado } = await getMockApiHttp().put(encodeURIComponent(id), data)
      return paisActualizado
    } catch (error) {
      if (isMockApiNotFound(error)) return null
      throw error
    }
  }

  async delete(id) {
    try {
      const { data } = await getMockApiHttp().delete(encodeURIComponent(id))
      return data
    } catch (error) {
      if (isMockApiNotFound(error)) return null
      throw error
    }
  }

  async existsByNombre(nombreOficial) {
    const clave = normalizarTexto(nombreOficial)
    const paises = await this.getAll()
    return paises.some((pais) => normalizarTexto(pais.nombreOficial || pais.nombreOfficial) === clave)
  }

  async buscarPorAtributo(atributo, valor) {
    if (!CAMPOS_BUSCABLES.has(atributo)) {
      throw new Error('El atributo indicado no se puede buscar.')
    }

    const clave = normalizarTexto(valor)
    const paises = await this.getAll()
    return paises.filter((pais) => normalizarTexto(pais[atributo] ?? '').includes(clave))
  }
}

export default new paisesARepository()