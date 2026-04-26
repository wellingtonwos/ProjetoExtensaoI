import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
	headers: {
		'Content-Type': 'application/json'
	}
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('authToken')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Interceptor para lidar com erro 401 (token inválido)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token inválido, remover do localStorage e redirecionar para login
			localStorage.removeItem('authToken')
			localStorage.removeItem('userName')
			localStorage.removeItem('userId')
			window.location.reload() // Recarregar para ir para login
		}
		return Promise.reject(error)
	}
)

export const login = async (identifier, password) => {
	const response = await api.post('/sessions', { identifier, password })
	return response.data
}

export const requestPasswordRecovery = async (email) => {
	const response = await api.post('/sessions/password-recovery', { email })
	return response.data
}

export const resetPassword = async (token, newPassword) => {
	const response = await api.post('/sessions/reset-password', { token, newPassword })
	return response.data
}

export const validateRecoveryCode = async (token) => {
	const response = await api.post('/sessions/validate-recovery-code', { token })
	return response.data
}

export const logout = () => {
	localStorage.removeItem('authToken')
	localStorage.removeItem('userName')
	localStorage.removeItem('userId')
}

