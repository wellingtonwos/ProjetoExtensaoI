import React, { useState, useEffect } from 'react'
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Card,
	ListGroup,
} from 'react-bootstrap'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Sales() {
	const [availableStock, setAvailableStock] = useState([])
	const [selectedOptionId, setSelectedOptionId] = useState('')
	const [quantity, setQuantity] = useState('')

	const [cart, setCart] = useState([])
	const [total, setTotal] = useState(0)
	const [paymentMethod, setPaymentMethod] = useState('PIX')

	useEffect(() => {
		loadStock()
	}, [])

	async function loadStock() {
		try {
			const res = await api.get('/products/purchases')

			const flatOptions = res.data.flatMap((product) => {
				if (!product.purchases || product.purchases.length === 0) return []

				const lotsWithStock = product.purchases.filter(
					(p) => Number(p.quantity) > 0
				)

				return lotsWithStock.map((purchase) => {
					const priceFound = purchase.unitSalePrice || 0

					return {
						value: product.id, 
						productId: product.id, 
						purchaseId: purchase.purchase_id, 
						name: product.product_name,
						unit: product.unitMeasurement,
						quantityAvailable: Number(purchase.quantity),
						price: Number(priceFound),
					}
				})
			})

			setAvailableStock(flatOptions)
		} catch (err) {
			console.error(err)
			toast.error('Erro ao carregar estoque.')
		}
	}

	const selectedItemData = availableStock.find(
		(i) => i.value === Number(selectedOptionId)
	)
	let labelTexto = 'Qtd / Peso'
	let placeholderTexto = '0.00'

	if (selectedItemData) {
		if (selectedItemData.unit === 'KG') {
			labelTexto = 'Peso (KG)'
			placeholderTexto = 'Ex: 1.250'
		} else {
			labelTexto = 'Quantidade (UN)'
			placeholderTexto = 'Ex: 2'
		}
	}

	const handleAddItem = (e) => {
		e.preventDefault()
		const item = availableStock.find(
			(i) => i.value === Number(selectedOptionId)
		)

		if (!item) {
			toast.error('Selecione um produto.')
			return
		}
		if (!quantity || Number(quantity) <= 0) {
			toast.error('Quantidade inválida.')
			return
		}

		if (Number(quantity) > item.quantityAvailable) {
			toast.error(`Estoque insuficiente! Disp: ${item.quantityAvailable}`)
			return
		}

		let finalPrice = item.price
		if (finalPrice === 0) {
			toast.warning('Item sem preço cadastrado. R$ 0,00.')
		}

		const newItem = {
			uniqueId: Date.now(),
			productId: item.productId,
			purchaseId: item.purchaseId,
			name: item.name,
			unit: item.unit,
			unitSalePrice: finalPrice,
			quantity: Number(quantity),
			total: finalPrice * Number(quantity),
		}

		const newCart = [...cart, newItem]
		setCart(newCart)
		setTotal(newCart.reduce((acc, i) => acc + i.total, 0))

		setSelectedOptionId('')
		setQuantity('')
	}

	const getLocalTimestamp = () => {
	const now = new Date();
	// Formata para o formato ISO mas usando horário local
	return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
}

	const handleFinalize = async () => {
		try {
			const storedUserId = localStorage.getItem('userId')
			const userId = storedUserId ? Number(storedUserId) : 1

			const payload = {
				timestamp: getLocalTimestamp(),
				paymentMethod: paymentMethod,
				discount: 0,
				userId: userId,
				items: cart.map((i) => ({
					productId: i.productId,
					purchaseId: i.purchaseId,
					quantity: i.quantity,
				})),
			}

			await api.post('/sales', payload)

			toast.success('Venda realizada!')
			setCart([])
			setTotal(0)
			loadStock()
		} catch (err) {
			console.error(err)
			const msg = err.response?.data?.message || 'Erro ao finalizar venda.'
			toast.error(msg)
		}
	}

	return (
		<Container className='mt-4'>
			<Row>
				<Col md={7}>
					<Card>
						<Card.Header as='h4'>Nova Venda</Card.Header>
						<Card.Body>
							<Form onSubmit={handleAddItem}>
								<Row>
									<Col md={8}>
										<Form.Group className='mb-3'>
											<Form.Label>Produto (Em Estoque)</Form.Label>
											<Form.Select
												value={selectedOptionId}
												onChange={(e) => setSelectedOptionId(e.target.value)}
												autoFocus
											>
												<option value=''>Selecione...</option>
												{availableStock.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.name} ({opt.quantityAvailable} {opt.unit}) - R${' '}
														{opt.price.toFixed(2)}
													</option>
												))}
											</Form.Select>
										</Form.Group>
									</Col>
									<Col md={4}>
										<Form.Group className='mb-3'>
											<Form.Label className='fw-bold text-primary'>
												{labelTexto}
											</Form.Label>
											<Form.Control
												type='number'
												step='0.01'
												value={quantity}
												onChange={(e) => setQuantity(e.target.value)}
												placeholder={placeholderTexto}
											/>
										</Form.Group>
									</Col>
								</Row>
								<Button type='submit' className='w-100'>
									Adicionar
								</Button>
							</Form>
						</Card.Body>
					</Card>
					<div className='mt-3'>
						<ListGroup>
							{cart.map((item) => (
								<ListGroup.Item
									key={item.uniqueId}
									className='d-flex justify-content-between'
								>
									<span>
										{item.name} ({item.quantity} {item.unit} x R${' '}
										{item.unitSalePrice.toFixed(2)})
									</span>
									<strong>R$ {item.total.toFixed(2)}</strong>
								</ListGroup.Item>
							))}
						</ListGroup>
					</div>
				</Col>

				<Col md={5}>
					<Card className='text-center bg-light'>
						<Card.Body>
							<h3>Total: R$ {total.toFixed(2)}</h3>

							<Form.Group className='mb-3 mt-3 text-start'>
								<Form.Label>Forma de Pagamento</Form.Label>
								<Form.Select
									value={paymentMethod}
									onChange={(e) => setPaymentMethod(e.target.value)}
									size='lg'
								>
									<option value='PIX'>Pix</option>
									<option value='CASH'>Dinheiro</option>
									<option value='CREDIT'>Crédito</option>
									<option value='DEBIT'>Débito</option>
								</Form.Select>
							</Form.Group>

							<Button
								variant='success'
								size='lg'
								className='w-100'
								onClick={handleFinalize}
								disabled={cart.length === 0}
							>
								Finalizar Venda
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}
