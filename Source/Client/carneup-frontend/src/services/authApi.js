import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
	headers: {
		'Content-Type': 'application/json'
	}
})

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

