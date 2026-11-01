import axios from 'axios'

const baseURL =
  process.env.VITE_BASE_URL_API ||
  'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'

export const countriesSourceHttp = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})
