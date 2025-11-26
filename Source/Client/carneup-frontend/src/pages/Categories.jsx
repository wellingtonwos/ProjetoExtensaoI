import React, { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Table, Modal } from 'react-bootstrap'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Categories() {
	const [categories, setCategories] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [name, setName] = useState('')

	useEffect(() => {
		fetchCategories()
	}, [])

	async function fetchCategories() {
		try {
			const res = await api.get('/categories')
			setCategories(res.data || [])
		} catch (err) {
			console.error(err)
			toast.error('Erro ao buscar categorias.')
		}
	}

	async function handleCreate(e) {
		e.preventDefault()
		try {
			await api.post('/categories', { name })

			toast.success('Categoria criada com sucesso!')
			setName('')
			setShowModal(false)

			fetchCategories()
		} catch (err) {
			console.error(err)
			toast.error('Erro ao criar categoria.')
		}
	}

	return (
		<Container className='mt-4'>
			<h3>Gerenciamento de Categorias</h3>

			<Card>
				<Card.Body>
					<div className='d-flex justify-content-end mb-3'>
						<Button onClick={() => setShowModal(true)}>Nova Categoria</Button>
					</div>

					<Table striped hover responsive>
						<thead>
							<tr>
								<th>ID</th>
								<th>Nome</th>
							</tr>
						</thead>
						<tbody>
							{categories.map((c) => (
								<tr key={c.id}>
									<td>{c.id}</td>
									<td>{c.name}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Card.Body>
			</Card>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Nova Categoria</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleCreate}>
						<Form.Group className='mb-3'>
							<Form.Label>Nome da Categoria</Form.Label>
							<Form.Control
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='Ex: Bovinos, Aves...'
								required
								autoFocus
							/>
						</Form.Group>

						<div className='d-grid'>
							<Button type='submit'>Salvar</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Container>
	)
}
