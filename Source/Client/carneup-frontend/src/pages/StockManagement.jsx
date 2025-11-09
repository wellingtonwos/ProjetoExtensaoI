import { useState, useEffect } from 'react'
import {
	Container,
	Card,
	Form,
	Button,
	Row,
	Col,
	Table,
	Modal,
} from 'react-bootstrap'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function StockManagement() {
	const [products, setProducts] = useState([])
	const [suppliers, setSuppliers] = useState([])
	const [categories, setCategories] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [form, setForm] = useState({
		name: '',
		measuring_unit: 'kg',
		code: '',
		id_category: '',
		id_supplier: '',
		new_supplier: '',
		new_category: '',
	})

	useEffect(() => {
		fetchLists()
	}, [])

	async function fetchLists() {
		try {
			const [pRes, sRes, cRes] = await Promise.all([
				api.get('/products'),
				api.get('/suppliers'),
				api.get('/categories'),
			])
			setProducts(pRes.data || [])
			setSuppliers(sRes.data || [])
			setCategories(cRes.data || [])
		} catch (err) {
			console.error(err)
			toast.error('Failed to fetch lists')
		}
	}

	async function handleCreate(e) {
		e.preventDefault()
		try {
			const payload = {
				name: form.name,
				measuring_unit: form.measuring_unit,
				code: form.code,
				id_category: form.id_category || null,
				id_supplier: form.id_supplier || null,
				new_category: form.new_category || null,
				new_supplier: form.new_supplier || null,
			}
			const res = await api.post('/products', payload)
			toast.success('Product created')
			setShowModal(false)
			fetchLists()
		} catch (err) {
			console.error(err)
			toast.error('Failed to create product')
		}
	}

	return (
		<Container className='mt-4'>
			<Row>
				<Col md={8}>
					<h3>Stock Management</h3>
					<Card>
						<Card.Body>
							<div className='d-flex justify-content-between mb-2'>
								<div>Products</div>
								<div>
									<Button onClick={() => setShowModal(true)}>
										New Product
									</Button>
								</div>
							</div>
							<Table striped hover responsive>
								<thead>
									<tr>
										<th>Name</th>
										<th>Unit</th>
										<th>Code</th>
										<th>Supplier</th>
										<th>Category</th>
									</tr>
								</thead>
								<tbody>
									{products.map((p) => (
										<tr key={p.id}>
											<td>{p.name}</td>
											<td>{p.measuring_unit}</td>
											<td>{p.code}</td>
											<td>{p.supplier?.name || '-'}</td>
											<td>{p.category?.name || '-'}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card>
						<Card.Body>
							<h5>Quick actions</h5>
							<Button className='mb-2' block onClick={() => setShowModal(true)}>
								Add product
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>New Product</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleCreate}>
						<Form.Group className='mb-2'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								required
							/>
						</Form.Group>
						<Form.Group className='mb-2'>
							<Form.Label>Unit</Form.Label>
							<Form.Select
								value={form.measuring_unit}
								onChange={(e) =>
									setForm({ ...form, measuring_unit: e.target.value })
								}
							>
								<option value='kg'>kg</option>
								<option value='un'>unit</option>
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-2'>
							<Form.Label>Code</Form.Label>
							<Form.Control
								value={form.code}
								onChange={(e) => setForm({ ...form, code: e.target.value })}
							/>
						</Form.Group>

						<Form.Group className='mb-2'>
							<Form.Label>Supplier</Form.Label>
							<Form.Select
								value={form.id_supplier}
								onChange={(e) =>
									setForm({ ...form, id_supplier: e.target.value })
								}
							>
								<option value=''>Select or type new</option>
								{suppliers.map((s) => (
									<option key={s.id} value={s.id}>
										{s.name}
									</option>
								))}
							</Form.Select>
							{!form.id_supplier && (
								<Form.Control
									className='mt-2'
									placeholder='New supplier name'
									value={form.new_supplier}
									onChange={(e) =>
										setForm({ ...form, new_supplier: e.target.value })
									}
								/>
							)}
						</Form.Group>

						<Form.Group className='mb-2'>
							<Form.Label>Category</Form.Label>
							<Form.Select
								value={form.id_category}
								onChange={(e) =>
									setForm({ ...form, id_category: e.target.value })
								}
							>
								<option value=''>Select or type new</option>
								{categories.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name}
									</option>
								))}
							</Form.Select>
							{!form.id_category && (
								<Form.Control
									className='mt-2'
									placeholder='New category name'
									value={form.new_category}
									onChange={(e) =>
										setForm({ ...form, new_category: e.target.value })
									}
								/>
							)}
						</Form.Group>

						<div className='d-grid'>
							<Button type='submit'>Create</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Container>
	)
}
