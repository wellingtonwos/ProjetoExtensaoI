import React from 'react'
import { useState } from 'react'
import { Container, Card, Form, Button } from 'react-bootstrap'
// import api from '../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function Login() {
	const [form, setForm] = useState({ username: '', password: '' })
	const navigate = useNavigate()

	// async function handleSubmit(e) {
	// 	e.preventDefault()
	// 	try {
	// 		const res = await api.post('/login', form)
	// 		const token =
	// 			res.data.token || res.headers.authorization || res.headers.Authorization
	// 		if (token) {
	// 			// token might come as 'Bearer xxx'
	// 			const extract = token.startsWith('Bearer ')
	// 				? token.split(' ')[1]
	// 				: token
	// 			localStorage.setItem('token', extract)
	// 			toast.success('Login successful')
	// 			navigate('/')
	// 		} else {
	// 			toast.error('No token returned from server')
	// 		}
	// 	} catch (err) {
	// 		console.error(err)
	// 		toast.error('Login failed. Check credentials.')
	// 	}
	// }
	async function handleSubmit(e) {
		e.preventDefault()

		// Mock simple auth
		if (form.username.trim() && form.password.trim()) {
			// simula sucesso
			localStorage.setItem('token', 'mock-token-123')
			toast.success('Login successful (mock)')
			navigate('/')
		} else {
			toast.error('Please fill in both fields')
		}
	}

	return (
		<Container
			className='d-flex justify-content-center align-items-center'
			style={{ height: '80vh' }}
		>
			<Card style={{ width: '28rem' }}>
				<Card.Body>
					<Card.Title className='mb-3'>Login</Card.Title>
					<Form onSubmit={handleSubmit}>
						<Form.Group className='mb-3'>
							<Form.Label>Username</Form.Label>
							<Form.Control
								value={form.username}
								onChange={(e) => setForm({ ...form, username: e.target.value })}
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								value={form.password}
								onChange={(e) => setForm({ ...form, password: e.target.value })}
							/>
						</Form.Group>
						<div className='d-grid'>
							<Button type='submit'>Sign in</Button>
						</div>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	)
}
