import React, { useState, useEffect, useRef } from 'react'
import { Container, Card, Form, Button, Table, Modal } from 'react-bootstrap'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Brands() {
	const [brands, setBrands] = useState([])
	const [showModal, setShowModal] = useState(false)

	const [form, setForm] = useState({ name: '' })
	const lastID = useRef(2)

	useEffect(() => {
		fetchBrands()

		setBrands([
			{ id: 1, name: 'Bassi' },
			{ id: 2, name: 'Frigol' },
		])
	}, [])

	async function fetchBrands() {
		try {
			const res = await api.get('/brands')
			setBrands(res.data || [])
		} catch (err) {
			console.error(err)
			toast.error('Falha ao buscar marcas')
		}
	}

	async function handleCreate(e) {
		e.preventDefault()
		try {
			const payload = { name: form.name }

			const res = await api.post('/brands', payload)

			toast.success('Marca adicionada com sucesso')

			lastID.current += 1

			const newBrand = {
				id: lastID.current,
				name: payload.name,
			}

			setBrands([...brands, newBrand])
			fetchBrands()

			setShowModal(false)
			setForm({ name: '' })
		} catch (err) {
			console.error(err)
			toast.error('Falha ao criar marca')
		}
	}

	return (
		<Container className='mt-4'>
			<h3>Gerenciamento de Marcas</h3>
			<Card>
				<Card.Body>
					<div className='d-flex justify-content-end mb-3'>
						<Button onClick={() => setShowModal(true)}>Nova Marca</Button>
					</div>

					<Table striped hover responsive>
						<thead>
							<tr>
								<th>ID</th>
								<th>Nome</th>
							</tr>
						</thead>
						<tbody>
							{brands.map((b) => (
								<tr key={b.id}>
									<td>{b.id}</td>
									<td>{b.name}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Card.Body>
			</Card>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Nova Marca</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleCreate}>
						<Form.Group className='mb-3'>
							<Form.Label>Nome da Marca</Form.Label>
							<Form.Control
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								required
								autoFocus
							/>
						</Form.Group>

						<div className='d-grid'>
							<Button type='submit'>Cadastrar</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Container>
	)
}
