import axios from 'axios'

export const http = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const message =
      data?.error ||
      data?.errors?.map((item) => item.msg).join('. ') ||
      error.message ||
      'No se pudo completar la operación.'

    return Promise.reject(new Error(message, { cause: error }))
  },
)
