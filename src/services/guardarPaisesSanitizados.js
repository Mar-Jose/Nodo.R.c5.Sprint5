import axios from 'axios'

const PAISES_AMERICA_URL =
  import.meta.env.VITE_BASE_URL_API || 'https://restcountries.com/v3.1/region/america'
const URL_MOCKAPI = import.meta.env.VITE_MOCKAPI_URL
let guardadoEnCurso

function normalizarNombre(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export function guardarPaisesSanitizados() {
  if (guardadoEnCurso) {
    return guardadoEnCurso
  }

  guardadoEnCurso = sincronizarPaises().finally(() => {
    guardadoEnCurso = undefined
  })

  return guardadoEnCurso
}

async function sincronizarPaises() {
  if (!URL_MOCKAPI?.trim()) {
    throw new Error('Falta configurar VITE_MOCKAPI_URL en el archivo src/.env.')
  }

  const { data } = await axios.get(PAISES_AMERICA_URL)

  if (!Array.isArray(data)) {
    throw new Error('La API devolvió una respuesta inesperada.')
  }

  const paisesPorNombre = new Map()
  for (const pais of data.filter((pais) => pais.languages?.spa)) {
    const paisSanitizado = {
      nombreOficial: pais.translations?.spa?.official || pais.name?.official,
      capital: pais.capital?.[0] || '',
      languages: Object.values(pais.languages || {}).join(', '),
      borders: (pais.borders || []).join(', '),
      area: pais.area || 0,
      population: pais.population || 0,
      timezones: (pais.timezones || []).join(', '),
      image: pais.flags?.png || '',
      creador: 'MARIA JOSE',
    }

    if (paisSanitizado.nombreOficial) {
      paisesPorNombre.set(normalizarNombre(paisSanitizado.nombreOficial), paisSanitizado)
    }
  }
  const paisesSanitizados = [...paisesPorNombre.values()]

  if (paisesSanitizados.length === 0) {
    throw new Error('No se encontraron países hispanohablantes para guardar en MockAPI.')
  }

  const paisesExistentes = await obtenerPaisesExistentes()

  const existentesPorNombre = new Map()
  for (const existente of paisesExistentes) {
    const nombre = existente.nombreOficial || existente.nombreOfficial
    if (!nombre) continue

    const clave = normalizarNombre(nombre)
    if (!existentesPorNombre.has(clave)) {
      existentesPorNombre.set(clave, [])
    }
    existentesPorNombre.get(clave).push(existente)
  }

  for (const pais of paisesSanitizados) {
    const existentes = existentesPorNombre.get(normalizarNombre(pais.nombreOficial)) || []
    if (existentes.some((existente) => existente.id == null)) {
      throw new Error(`MockAPI devolvió un registro sin ID para "${pais.nombreOficial}".`)
    }
  }

  for (const pais of paisesSanitizados) {
    const existentes = existentesPorNombre.get(normalizarNombre(pais.nombreOficial)) || []

    if (existentes.length === 0) {
      await axios.post(URL_MOCKAPI, pais)
    } else {
      const [principal, ...duplicados] = existentes
      await axios.put(`${URL_MOCKAPI}/${encodeURIComponent(principal.id)}`, pais)
      for (const duplicado of duplicados) {
        await axios.delete(`${URL_MOCKAPI}/${encodeURIComponent(duplicado.id)}`)
      }
    }

    console.log(`Sincronizado: ${pais.nombreOficial}`)
  }

  return paisesSanitizados
}

async function obtenerPaisesExistentes() {
  const limite = 100
  const paises = []

  for (let pagina = 1; ; pagina += 1) {
    const { data } = await axios.get(URL_MOCKAPI, {
      params: { page: pagina, limit: limite },
    })

    if (!Array.isArray(data) || data.some((pais) => !pais || typeof pais !== 'object')) {
      throw new Error('MockAPI devolvió una respuesta inesperada al consultar los países.')
    }

    paises.push(...data)
    if (data.length < limite) {
      return paises
    }
  }
}
