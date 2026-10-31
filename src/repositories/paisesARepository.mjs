import axios from 'axios'

const CAMPOS_BUSCABLES = new Set([
  'nombreOficial',
  'capital',
  'languages',
  'borders',
  'area',
])

function obtenerUrlMockApi() {
  const url = process.env.VITE_MOCKAPI_URL?.trim()
  if (!url) {
    throw new Error('Falta configurar VITE_MOCKAPI_URL en el archivo .env.')
  }

  return url.replace(/\/+$/, '')
}

function normalizarValor(valor) {
  return String(valor).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
}

class paisesARepository {
  async getAll() {
    const paises = []
    const limit = 100

    for (let page = 1; ; page += 1) {
      const { data } = await axios.get(obtenerUrlMockApi(), { params: { page, limit } })
      if (!Array.isArray(data)) {
        throw new Error('MockAPI devolvió una respuesta inesperada al consultar los países.')
      }

      paises.push(...data)
      if (data.length < limit) return paises
    }
  }

  async getById(id) {
    try {
      const { data } = await axios.get(`${obtenerUrlMockApi()}/${encodeURIComponent(id)}`)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null
      throw error
    }
  }

  async create(data) {
    const { data: paisCreado } = await axios.post(obtenerUrlMockApi(), data)
    return paisCreado
  }

  async update(id, data) {
    try {
      const { data: paisActualizado } = await axios.put(
        `${obtenerUrlMockApi()}/${encodeURIComponent(id)}`,
        data,
      )
      return paisActualizado
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null
      throw error
    }
  }

  async delete(id) {
    try {
      const { data } = await axios.delete(`${obtenerUrlMockApi()}/${encodeURIComponent(id)}`)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null
      throw error
    }
  }

  async existsByNombre(nombreOficial) {
    const clave = normalizarValor(nombreOficial)
    const paises = await this.getAll()
    return paises.some((pais) => normalizarValor(pais.nombreOficial || pais.nombreOfficial) === clave)
  }

  async buscarPorAtributo(atributo, valor) {
    if (!CAMPOS_BUSCABLES.has(atributo)) {
      throw new Error('El atributo indicado no se puede buscar.')
    }

    const clave = normalizarValor(valor)
    const paises = await this.getAll()
    return paises.filter((pais) => normalizarValor(pais[atributo] ?? '').includes(clave))
  }
}

export default new paisesARepository()