import { countriesSourceHttp } from '../api/countriesSourceHttp.mjs'
import { normalizarTexto } from '../utils/formato/normalizarTexto.js'
import paisesARepository from '../repositories/paisesARepository.mjs'

export async function sincronizarPaises() {
  const baseUrlBanderas = process.env.BASE_URL_FLAGS?.trim()
  if (!baseUrlBanderas) {
    throw new Error('Falta configurar BASE_URL_FLAGS en el archivo .env.')
  }

  const { data } = await countriesSourceHttp.get('')
  if (!Array.isArray(data)) {
    throw new Error('La fuente de países devolvió una respuesta inesperada.')
  }

  const paisesPorNombre = new Map()
  for (const pais of data.filter((item) => item.region === 'Americas' && item.languages?.spa)) {
    const paisSanitizado = {
      nombreOficial: pais.translations?.spa?.official || pais.name?.official,
      capital: pais.capital?.[0] || '',
      languages: Object.values(pais.languages || {}).join(', '),
      borders: (pais.borders || []).join(', '),
      area: pais.area || 0,
      image: pais.cca2
        ? `${baseUrlBanderas.replace(/\/+$/, '')}/${pais.cca2.toLowerCase()}.svg`
        : '',
    }

    if (paisSanitizado.nombreOficial) {
      paisesPorNombre.set(normalizarTexto(paisSanitizado.nombreOficial), paisSanitizado)
    }
  }

  const paises = [...paisesPorNombre.values()]
  if (paises.length === 0) {
    throw new Error('No se encontraron países hispanohablantes para sincronizar.')
  }

  const existentesPorNombre = new Map()
  for (const existente of await paisesARepository.getAll()) {
    const nombre = existente.nombreOficial || existente.nombreOfficial
    if (!nombre) continue

    const clave = normalizarTexto(nombre)
    const grupo = existentesPorNombre.get(clave) || []
    grupo.push(existente)
    existentesPorNombre.set(clave, grupo)
  }

  for (const pais of paises) {
    const existentes = existentesPorNombre.get(normalizarTexto(pais.nombreOficial)) || []
    if (existentes.some((existente) => existente.id == null)) {
      throw new Error(`MockAPI devolvió un registro sin ID para "${pais.nombreOficial}".`)
    }
  }

  for (const pais of paises) {
    const existentes = existentesPorNombre.get(normalizarTexto(pais.nombreOficial)) || []
    if (existentes.length === 0) {
      await paisesARepository.create(pais)
      continue
    }

    const [principal, ...duplicados] = existentes
    const actualizado = await paisesARepository.update(principal.id, pais)
    if (!actualizado) {
      throw new Error(`No se pudo actualizar "${pais.nombreOficial}" en MockAPI.`)
    }
    for (const duplicado of duplicados) {
      await paisesARepository.delete(duplicado.id)
    }
  }

  return paises
}
