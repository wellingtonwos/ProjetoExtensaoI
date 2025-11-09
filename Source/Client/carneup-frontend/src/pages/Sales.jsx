import React, { useState } from 'react'
// import { api } from '../services/api'
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Card,
	ListGroup,
	Badge,
	Alert,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function POS() {
	const [barcode, setBarcode] = useState('')
	const [cart, setCart] = useState([])
	const [total, setTotal] = useState(0)
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	const handleAddItem = async (e) => {
		e.preventDefault()
		setError(null)

		let itemData
		try {
			// const res = await api.get(`/purchases/${barcode}`))
			if (barcode) {
				itemData = {
					purchase_id: parseInt(barcode),
					name: `Item Simulado (ID: ${barcode})`,
					price: 50.0,
				}
			} else {
				throw new Error('Código inválido')
			}

			const newCart = [...cart, itemData]
			setCart(newCart)

			const newTotal = newCart.reduce((sum, item) => sum + item.price, 0)
			setTotal(newTotal)
		} catch (err) {
			setError('Item não encontrado ou inválido.')
		} finally {
			setBarcode('')
		}
	}

	const handleFinalizeSale = async () => {
		setError(null)
		try {
			const saleBody = {
				Timestamp: new Date().toISOString(),
				Payment_method: 'PIX',
				Discount: 0.0,
				User_id: 1,
				Items: cart.map((item) => ({
					Quantity: 1,
					Purchase_id: item.purchase_id,
				})),
			}

			// await api.post('/sales', saleBody);

			toast.success('Venda registrada com sucesso')
			setCart([])
			setTotal(0)
		} catch (err) {
			if (err.response && err.response.status === 401) {
				toast.error('Sessão expirada. Faça o login novamente.')
				navigate('/login')
			} else {
				setError('Falha ao registrar venda.')
				console.error(err)
			}
		}
	}

	return (
		<Container className='mt-4'>
			<Row>
				<Col md={7}>
					<Card>
						<Card.Header as='h4'>🥩 Vendas</Card.Header>
						<Card.Body>
							{error && <Alert variant='danger'>{error}</Alert>}

							<Form onSubmit={handleAddItem}>
								<Form.Group>
									<Form.Label>Código de barras</Form.Label>
									<Form.Control
										type='text'
										placeholder='Scan item barcode...'
										value={barcode}
										onChange={(e) => setBarcode(e.target.value)}
										autoFocus
									/>
								</Form.Group>
								<Button type='submit' style={{ display: 'none' }}>
									Adicionar
								</Button>
							</Form>

							<hr />
							<h5>Venda atual</h5>
							<ListGroup>
								{cart.map((item, index) => (
									<ListGroup.Item
										key={index}
										className='d-flex justify-content-between'
									>
										{item.name}
										<Badge bg='primary' pill>
											R$ {item.price.toFixed(2)}
										</Badge>
									</ListGroup.Item>
								))}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>

				<Col md={5}>
					<Card className='text-center'>
						<Card.Header as='h5'>Total</Card.Header>
						<Card.Body>
							<h1 className='display-4'>R$ {total.toFixed(2)}</h1>
						</Card.Body>
						<div className='d-grid gap-2 p-3'>
							<Button
								variant='success'
								size='lg'
								className='p-3'
								onClick={handleFinalizeSale}
								disabled={cart.length === 0}
							>
								Finalizar compra
							</Button>
						</div>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}
