// src/pages/Suppliers.jsx

import React, { useState, useEffect, useRef } from 'react'
import { Container, Card, Form, Button, Table, Modal } from 'react-bootstrap'
// import api from '../services/api' //
import { toast } from 'react-toastify'

export default function Suppliers() {
	const [suppliers, setSuppliers] = useState([])
	const [showModal, setShowModal] = useState(false)

	const [form, setForm] = useState({ name: '' })
	const lastID = useRef(2)

	useEffect(() => {
		// fetchSuppliers()

		setSuppliers([
			{ id: 1, name: 'Bassi' },
			{ id: 2, name: 'Frigol' },
		])
	}, [])

	/*
  async function fetchSuppliers() {
    try {
      const res = await api.get('/suppliers')
      setSuppliers(res.data || [])
    } catch (err) {
      toast.error('Falha ao buscar fornecedores')
    }
  }
  */

	async function handleCreate(e) {
		e.preventDefault()
		try {
			const payload = { name: form.name }

			// const res = await api.post('/suppliers', payload)
			toast.success('Fornecedor adicionado com sucesso')

			lastID.current += 1

			const newSupplier = {
				id: lastID.current,
				name: payload.name,
			}
			setSuppliers([...suppliers, newSupplier])
			// fetchSuppliers()

			setShowModal(false)
			setForm({ name: '' })
		} catch (err) {
			console.error(err)
			toast.error('Falha ao criar fornecedor')
		}
	}

	return (
		<Container className='mt-4'>
			<h3>Gerenciamento de Fornecedores</h3>
			<Card>
				<Card.Body>
					<div className='d-flex justify-content-end mb-3'>
						<Button onClick={() => setShowModal(true)}>Novo Fornecedor</Button>
					</div>

					<Table striped hover responsive>
						<thead>
							<tr>
								<th>ID</th>
								<th>Nome</th>
							</tr>
						</thead>
						<tbody>
							{suppliers.map((s) => (
								<tr key={s.id}>
									<td>{s.id}</td>
									<td>{s.name}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Card.Body>
			</Card>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Novo Fornecedor</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleCreate}>
						<Form.Group className='mb-3'>
							<Form.Label>Nome do Fornecedor</Form.Label>
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
