import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:8080', //http://ec2-3-17-24-16.us-east-2.compute.amazonaws.com:8080
	timeout: 7000,
})

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('authToken')

		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error)
)

export default api
