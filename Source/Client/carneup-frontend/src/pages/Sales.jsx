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
	const [selectedStockId, setSelectedStockId] = useState('')
	const [quantity, setQuantity] = useState('')

	const [cart, setCart] = useState([])
	const [total, setTotal] = useState(0)

	const [paymentMethod, setPaymentMethod] = useState('CASH')

	useEffect(() => {
		loadStock()
	}, [])

	async function loadStock() {
		try {
			const res = await api.get('/products/purchases')
			setAvailableStock(res.data || [])
		} catch (err) {
			console.error(err)
			toast.error('Erro ao carregar estoque.')
		}
	}

	const handleAddItem = (e) => {
		e.preventDefault()
		const item = availableStock.find((i) => i.id === Number(selectedStockId))

		if (!item) {
			toast.error('Selecione um produto.')
			return
		}
		if (!quantity || Number(quantity) <= 0) {
			toast.error('Quantidade inválida.')
			return
		}

		const newItem = {
			stock_id: item.id,
			name: item.product?.name || item.name || `Item #${item.id}`,
			unit_price: Number(item.unit_sale_price),
			quantity: Number(quantity),
			total: Number(item.unit_sale_price) * Number(quantity),
		}

		const newCart = [...cart, newItem]
		setCart(newCart)
		setTotal(newCart.reduce((acc, i) => acc + i.total, 0))
		setSelectedStockId('')
		setQuantity('')
	}

	const handleFinalize = async () => {
		try {
			const storedUserId = localStorage.getItem('userId')
			const userId = storedUserId ? Number(storedUserId) : 1

			const payload = {
				timestamp: new Date().toISOString(),
				payment_method: paymentMethod,
				discount: 0,
				user_id: userId,
				items: cart.map((i) => ({
					purchase_id: i.stock_id,
					quantity: i.quantity,
				})),
			}

			await api.post('/sales', payload)

			toast.success('Venda realizada com sucesso!')
			setCart([])
			setTotal(0)
			setPaymentMethod('CASH')
			loadStock()
		} catch (err) {
			console.error(err)
			toast.error('Erro ao finalizar venda.')
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
												value={selectedStockId}
												onChange={(e) => setSelectedStockId(e.target.value)}
												autoFocus
											>
												<option value=''>Selecione...</option>
												{availableStock.map((item) => (
													<option key={item.id} value={item.id}>
														{item.product?.name || item.name} - R${' '}
														{item.unit_sale_price} (Disp: {item.quantity})
													</option>
												))}
											</Form.Select>
										</Form.Group>
									</Col>
									<Col md={4}>
										<Form.Group className='mb-3'>
											<Form.Label>Qtd / Peso</Form.Label>
											<Form.Control
												type='number'
												step='0.01'
												value={quantity}
												onChange={(e) => setQuantity(e.target.value)}
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
							{cart.map((item, index) => (
								<ListGroup.Item
									key={index}
									className='d-flex justify-content-between'
								>
									<span>
										{item.name} ({item.quantity} x R$ {item.unit_price})
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
									<option value='CASH'>Dinheiro</option>
									<option value='PIX'>Pix</option>
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
