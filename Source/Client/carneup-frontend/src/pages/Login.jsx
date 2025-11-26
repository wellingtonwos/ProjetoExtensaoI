import React, { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import api from '../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function Login() {
	const [form, setForm] = useState({ username: '', password: '' })
	const [errorMsg, setErrorMsg] = useState('')
	const [loading, setLoading] = useState(false)

	const navigate = useNavigate()

	async function handleSubmit(e) {
		e.preventDefault()
		setErrorMsg('')
		setLoading(true)

		try {
			const payload = {
				username: form.username,
				password: form.password,
			}

			const res = await api.post('/sessions', payload)

			console.log('Resposta Completa:', res.data)

			const token = res.data.token

			if (token) {
				localStorage.setItem('authToken', token)
				localStorage.setItem('userId', res.data.userId)

				api.defaults.headers.common['Authorization'] = `Bearer ${token}`

				toast.success('Login realizado com sucesso!')

				navigate('/')
			} else {
				setErrorMsg('Erro: O campo "token" veio vazio do servidor.')
			}
		} catch (err) {
			console.error(err)
			setErrorMsg('Falha no login. Verifique usuário e senha.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container
			className='d-flex justify-content-center align-items-center'
			style={{ height: '80vh' }}
		>
			<Card style={{ width: '28rem' }}>
				<Card.Body>
					<Card.Title className='mb-3 text-center'>CarneUp</Card.Title>

					{errorMsg && (
						<Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>
							{errorMsg}
						</Alert>
					)}

					<Form onSubmit={handleSubmit}>
						<Form.Group className='mb-3'>
							<Form.Label>Usuário</Form.Label>
							<Form.Control
								value={form.username}
								onChange={(e) => setForm({ ...form, username: e.target.value })}
								placeholder='Ex: admin'
								required
								autoFocus
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Senha</Form.Label>
							<Form.Control
								type='password'
								value={form.password}
								onChange={(e) => setForm({ ...form, password: e.target.value })}
								placeholder='Sua senha'
								required
							/>
						</Form.Group>
						<div className='d-grid'>
							<Button type='submit' variant='primary' disabled={loading}>
								{loading ? 'Entrando...' : 'Entrar'}
							</Button>
						</div>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	)
}
