import axios from 'axios'

let mockApiHttp

export function getMockApiHttp() {
  if (mockApiHttp) return mockApiHttp

  const baseURL = process.env.VITE_MOCKAPI_URL?.trim()
  if (!baseURL) {
    throw new Error('Falta configurar VITE_MOCKAPI_URL en el archivo .env.')
  }

  mockApiHttp = axios.create({
    baseURL: baseURL.replace(/\/+$/, ''),
    timeout: 10000,
    headers: {
      Accept: 'application/json',
    },
  })

  return mockApiHttp
}

export function isMockApiNotFound(error) {
  return axios.isAxiosError(error) && error.response?.status === 404
}
