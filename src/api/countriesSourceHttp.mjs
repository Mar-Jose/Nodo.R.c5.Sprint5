import axios from 'axios'

const baseURL = process.env.VITE_BASE_URL_API?.trim()

if (!baseURL) {
  throw new Error('Falta configurar VITE_BASE_URL_API en el archivo .env.')
}

export const countriesSourceHttp = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})
