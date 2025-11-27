import React, { useState, useEffect } from 'react'
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Table,
	Modal,
	Tab,
	Tabs,
} from 'react-bootstrap'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function StockManagement() {
	const [key, setKey] = useState('products')

	const [products, setProducts] = useState([])
	const [brands, setBrands] = useState([])
	const [categories, setCategories] = useState([])

	const [showBrandModal, setShowBrandModal] = useState(false)
	const [showCategoryModal, setShowCategoryModal] = useState(false)
	const [quickName, setQuickName] = useState('')

	const [formProduct, setFormProduct] = useState({
		name: '',
		measuring_unit: 'KG',
		code: '',
		id_category: '',
		id_brand: '',
	})

	const [formPurchase, setFormPurchase] = useState({
		product_id: '',
		quantity: '',
		unit_purchase_price: '',
		unit_sale_price: '',
		expiring_date: '',
	})

	useEffect(() => {
		fetchLists()
	}, [])

	async function fetchLists() {
		try {
			const [prodRes, brandRes, catRes] = await Promise.all([
				api.get('/products'),
				api.get('/brands'),
				api.get('/categories'),
			])

			setProducts(prodRes.data || [])
			setBrands(brandRes.data || [])
			setCategories(catRes.data || [])
		} catch (err) {
			console.error(err)
			toast.error('Erro ao carregar listas')
		}
	}

	async function handleQuickSave() {
		try {
			if (showBrandModal) {
				await api.post('/brands', { name: quickName })
				toast.success('Marca criada!')
			} else {
				await api.post('/categories', { name: quickName })
				toast.success('Categoria criada!')
			}
			setQuickName('')
			setShowBrandModal(false)
			setShowCategoryModal(false)
			fetchLists()
		} catch (err) {
			toast.error('Erro ao criar item.')
		}
	}

	async function handleCreateProduct(e) {
		e.preventDefault()
		try {
			const payload = {
				name: formProduct.name,
				code: formProduct.code,
				unitMeasurement: formProduct.measuring_unit,
				categoryId: Number(formProduct.id_category),
				brandId: Number(formProduct.id_brand),
			}
			await api.post('/products', payload)
			toast.success('Produto cadastrado!')

			setFormProduct({
				name: '',
				measuring_unit: 'KG',
				code: '',
				id_category: '',
				id_brand: '',
			})
			fetchLists()
		} catch (err) {
			toast.error('Erro ao cadastrar produto.')
		}
	}

	async function handleCreatePurchase(e) {
		e.preventDefault()
		try {
			const payload = {
				date: new Date().toISOString().split('T')[0],
				items: [
					{
						quantity: Number(formPurchase.quantity),
						unitPurchasePrice: Number(formPurchase.unit_purchase_price),
						unitSalePrice: Number(formPurchase.unit_sale_price),
						expiringDate: formPurchase.expiring_date,
						productId: Number(formPurchase.product_id),
					},
				],
			}
			await api.post('/purchases', payload)
			toast.success('Entrada de estoque realizada!')
			setFormPurchase({
				product_id: '',
				quantity: '',
				unit_purchase_price: '',
				unit_sale_price: '',
				expiring_date: '',
			})
		} catch (err) {
			toast.error('Erro ao registrar entrada.')
		}
	}

	return (
		<Container className='mt-4'>
			<h2>Gerenciamento de Estoque</h2>

			<Tabs activeKey={key} onSelect={(k) => setKey(k)} className='mb-3'>
				<Tab eventKey='products' title='1. Cadastrar Novo Produto'>
					<Card>
						<Card.Body>
							<Form onSubmit={handleCreateProduct}>
								<Row>
									<Col md={6}>
										<Form.Group className='mb-3'>
											<Form.Label>Nome do Produto</Form.Label>
											<Form.Control
												value={formProduct.name}
												onChange={(e) =>
													setFormProduct({
														...formProduct,
														name: e.target.value,
													})
												}
												required
											/>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group className='mb-3'>
											<Form.Label>Código do Produto</Form.Label>
											<Form.Control
												value={formProduct.code}
												onChange={(e) =>
													setFormProduct({
														...formProduct,
														code: e.target.value,
													})
												}
											/>
										</Form.Group>
									</Col>
								</Row>

								<Row>
									<Col md={4}>
										<Form.Group className='mb-3'>
											<Form.Label>Marca</Form.Label>
											<div className='d-flex'>
												<Form.Select
													value={formProduct.id_brand}
													onChange={(e) =>
														setFormProduct({
															...formProduct,
															id_brand: e.target.value,
														})
													}
													required
												>
													<option value=''>Selecione...</option>
													{brands.map((b) => (
														<option key={b.id} value={b.id}>
															{b.brandName}
														</option>
													))}
												</Form.Select>
												<Button
													variant='outline-secondary'
													onClick={() => setShowBrandModal(true)}
												>
													+
												</Button>
											</div>
										</Form.Group>
									</Col>
									<Col md={4}>
										<Form.Group className='mb-3'>
											<Form.Label>Categoria</Form.Label>
											<div className='d-flex'>
												<Form.Select
													value={formProduct.id_category}
													onChange={(e) =>
														setFormProduct({
															...formProduct,
															id_category: e.target.value,
														})
													}
													required
												>
													<option value=''>Selecione...</option>
													{categories.map((c) => (
														<option key={c.id} value={c.id}>
															{c.categoryName}
														</option>
													))}
												</Form.Select>
												<Button
													variant='outline-secondary'
													onClick={() => setShowCategoryModal(true)}
												>
													+
												</Button>
											</div>
										</Form.Group>
									</Col>
									<Col md={4}>
										<Form.Group className='mb-3'>
											<Form.Label>Unidade</Form.Label>
											<Form.Select
												value={formProduct.measuring_unit}
												onChange={(e) =>
													setFormProduct({
														...formProduct,
														measuring_unit: e.target.value,
													})
												}
											>
												<option value='KG'>Quilo (kg)</option>
												<option value='UN'>Unidade (un)</option>
											</Form.Select>
										</Form.Group>
									</Col>
								</Row>
								<Button type='submit'>Cadastrar Produto</Button>
							</Form>
						</Card.Body>
					</Card>
				</Tab>

				<Tab eventKey='purchases' title='2. Entrada de Estoque (Compra)'>
					<Card>
						<Card.Body>
							<Form onSubmit={handleCreatePurchase}>
								<Form.Group className='mb-3'>
									<Form.Label>Selecione o Produto</Form.Label>
									<Form.Select
										value={formPurchase.product_id}
										onChange={(e) =>
											setFormPurchase({
												...formPurchase,
												product_id: e.target.value,
											})
										}
										required
									>
										<option value=''>Selecione...</option>
										{products.map((p) => (
											<option key={p.id} value={p.id}>
												{p.name} - {p.code}
											</option>
										))}
									</Form.Select>
								</Form.Group>

								<Row>
									<Col>
										<Form.Group className='mb-3'>
											<Form.Label>Quantidade / Peso</Form.Label>
											<Form.Control
												type='number'
												step='0.01'
												value={formPurchase.quantity}
												onChange={(e) =>
													setFormPurchase({
														...formPurchase,
														quantity: e.target.value,
													})
												}
												required
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group className='mb-3'>
											<Form.Label>Validade</Form.Label>
											<Form.Control
												type='date'
												value={formPurchase.expiring_date}
												onChange={(e) =>
													setFormPurchase({
														...formPurchase,
														expiring_date: e.target.value,
													})
												}
												required
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col>
										<Form.Group className='mb-3'>
											<Form.Label>Preço de Custo (Unitário)</Form.Label>
											<Form.Control
												type='number'
												step='0.01'
												value={formPurchase.unit_purchase_price}
												onChange={(e) =>
													setFormPurchase({
														...formPurchase,
														unit_purchase_price: e.target.value,
													})
												}
												required
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group className='mb-3'>
											<Form.Label>Preço de Venda (Unitário)</Form.Label>
											<Form.Control
												type='number'
												step='0.01'
												value={formPurchase.unit_sale_price}
												onChange={(e) =>
													setFormPurchase({
														...formPurchase,
														unit_sale_price: e.target.value,
													})
												}
												required
											/>
										</Form.Group>
									</Col>
								</Row>
								<Button variant='success' type='submit'>
									Registrar Entrada
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Tab>
			</Tabs>

			<Modal
				show={showBrandModal || showCategoryModal}
				onHide={() => {
					setShowBrandModal(false)
					setShowCategoryModal(false)
				}}
			>
				<Modal.Header closeButton>
					<Modal.Title>
						Nova {showBrandModal ? 'Marca' : 'Categoria'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Control
						placeholder='Nome...'
						value={quickName}
						onChange={(e) => setQuickName(e.target.value)}
						autoFocus
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleQuickSave}>Salvar</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	)
}
