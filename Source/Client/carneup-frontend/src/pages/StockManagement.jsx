// src/pages/StockManagement.jsx
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
	const [key, setKey] = useState('products') // Controla as abas (Produtos vs Entrada Estoque)

	// Listas para os Dropdowns
	const [products, setProducts] = useState([])
	const [brands, setBrands] = useState([]) // Antes era suppliers, agora brands
	const [categories, setCategories] = useState([])

	// Modais de Cadastro Rápido
	const [showBrandModal, setShowBrandModal] = useState(false)
	const [showCategoryModal, setShowCategoryModal] = useState(false)
	const [quickName, setQuickName] = useState('')

	// Formulário de Produto (Cadastro do "Catálogo")
	const [formProduct, setFormProduct] = useState({
		name: '',
		measuring_unit: 'kg',
		code: '',
		id_category: '',
		id_brand: '',
	})

	// Formulário de Compra (Entrada no Estoque)
	const [formPurchase, setFormPurchase] = useState({
		product_id: '',
		quantity: '',
		unit_purchase_price: '',
		unit_sale_price: '',
		expiring_date: '',
	})

	// 1. Carregar listas ao abrir a tela
	useEffect(() => {
		fetchLists()
	}, [])

	async function fetchLists() {
		try {
			// Busca tudo que é necessário para os formulários
			// const [prodRes, brandRes, catRes] = await Promise.all([
			// 	api.get('/products'),
			// 	api.get('/brands'),
			// 	api.get('/categories'),
			// ])

			const [brandRes, catRes] = await Promise.all([
				api.get('/brands'),
				api.get('/categories'),
			])

			setProducts([])
			setBrands(brandRes.data || [])
			setCategories(catRes.data || [])
		} catch (err) {
			console.error(err)
			// toast.error('Erro ao carregar listas (Verifique login)');
		}
	}

	// --- LÓGICA DE CADASTRO RÁPIDO (MARCA/CATEGORIA) ---
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
			fetchLists() // Atualiza os dropdowns
		} catch (err) {
			toast.error('Erro ao criar item.')
		}
	}

	// --- 2. CRIAR PRODUTO (POST /products) ---
	async function handleCreateProduct(e) {
		e.preventDefault()
		try {
			const payload = {
				name: formProduct.name,
				measuring_unit: formProduct.measuring_unit,
				code: formProduct.code,
				id_category: Number(formProduct.id_category),
				id_brand: Number(formProduct.id_brand), // Ajustado para brand
			}
			await api.post('/products', payload)
			toast.success('Produto cadastrado!')

			// Limpa form e recarrega lista para aparecer na aba de "Entrada"
			setFormProduct({
				name: '',
				measuring_unit: 'kg',
				code: '',
				id_category: '',
				id_brand: '',
			})
			fetchLists()
		} catch (err) {
			toast.error('Erro ao cadastrar produto.')
		}
	}

	// --- 3. CRIAR COMPRA/ENTRADA (POST /purchases) ---
	async function handleCreatePurchase(e) {
		e.preventDefault()
		try {
			const payload = {
				date: new Date().toISOString().split('T')[0], // Data de hoje
				items: [
					{
						quantity: Number(formPurchase.quantity),
						unit_purchase_price: Number(formPurchase.unit_purchase_price),
						unit_sale_price: Number(formPurchase.unit_sale_price),
						expiring_date: formPurchase.expiring_date,
						product_id: Number(formPurchase.product_id),
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
				{/* ABA 1: CADASTRO DE PRODUTO (CATÁLOGO) */}
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
															{b.name}
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
															{c.name}
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
												<option value='kg'>Quilo (kg)</option>
												<option value='un'>Unidade (un)</option>
											</Form.Select>
										</Form.Group>
									</Col>
								</Row>
								<Button type='submit'>Cadastrar Produto</Button>
							</Form>
						</Card.Body>
					</Card>
				</Tab>

				{/* ABA 2: ENTRADA DE ESTOQUE (COMPRAS) */}
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

			{/* MODAL GENÉRICO PARA CRIAR MARCA/CATEGORIA */}
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
