import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.MODE == 'production' ? "/api" : "http://localhost:3000/api",
    withCredentials: true,
    timeout: 10000,
})
export default api