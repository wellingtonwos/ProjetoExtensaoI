import React, { useState, useEffect } from 'react'
// import { api } from '../services/api';
import {
	Container,
	Card,
	ListGroup,
	Button,
	Modal,
	Row,
	Col,
	Alert,
} from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const style = document.createElement('style')
style.innerHTML = `.valor-blur { filter: blur(8px); }`
document.head.appendChild(style)

export default function Reports() {
	const [sales, setSales] = useState([])
	const [error, setError] = useState(null)
	const [showValues, setShowValues] = useState(false)

	const [showModal, setShowModal] = useState(false)
	const [selectedSaleItems, setSelectedSaleItems] = useState([])

	const navigate = useNavigate()

	useEffect(() => {
		// const loadSales = async () => {
		//   try {
		//     const res = await api.get('/sales');
		//     setSales(res.data);
		//   } catch (err) {
		//     if (err.response && err.response.status === 401) {
		//       toast.error('Sessão expirada. Faça o login novamente.');
		//       navigate('/login');
		//     } else {
		//       setError('Falha ao carregar relatórios.');
		//     }
		//   }
		// };
		// loadSales();

		setSales([
			{
				Timestamp: '2025-11-09T14:30:00',
				Salesman_name: 'Junior',
				Payment_method: 'PIX',
				Total_price: 150.5,
				Discounts: 0,
				Items: [
					{
						Name: 'Picanha Bassi',
						Supplier: 'Bassi',
						Quantity: 1.2,
						Sale_price: 150.5,
					},
					{
						Name: 'Alcatra',
						Supplier: 'Frigol',
						Quantity: 1.0,
						Sale_price: 85.0,
						Discounts: 5,
					},{
						Name: 'Picanha Bassi',
						Supplier: 'Bassi',
						Quantity: 1.2,
						Sale_price: 150.5,
					},
					{
						Name: 'Alcatra',
						Supplier: 'Frigol',
						Quantity: 1.0,
						Sale_price: 85.0,
						Discounts: 5,
					},{
						Name: 'Picanha Bassi',
						Supplier: 'Bassi',
						Quantity: 1.2,
						Sale_price: 150.5,
					},
					{
						Name: 'Alcatra',
						Supplier: 'Frigol',
						Quantity: 1.0,
						Sale_price: 85.0,
						Discounts: 5,
					}
				],
			},
			{
				Timestamp: '2025-11-09T10:15:00',
				Salesman_name: 'Gustavo',
				Payment_method: 'Crédito',
				Total_price: 80.0,
				Discounts: 5,
				Items: [
					{
						Name: 'Alcatra',
						Supplier: 'Frigol',
						Quantity: 1.0,
						Sale_price: 85.0,
						Discounts: 5,
					},
				],
			},
			{
				Timestamp: '2025-11-09T10:15:00',
				Salesman_name: 'Gustavo',
				Payment_method: 'Crédito',
				Total_price: 80.0,
				Discounts: 5,
				Items: [
					{
						Name: 'Alcatra',
						Supplier: 'Frigol',
						Quantity: 1.0,
						Sale_price: 85.0,
						Discounts: 5,
					},
				],
			},
			{
				Timestamp: '2025-11-09T10:15:00',
				Salesman_name: 'Gustavo',
				Payment_method: 'Crédito',
				Total_price: 80.0,
				Discounts: 5,
				Items: [
					{
						Name: 'Alcatra',
						Supplier: 'Frigol',
						Quantity: 1.0,
						Sale_price: 85.0,
						Discounts: 5,
					},
				],
			},
			{
				Timestamp: '2025-11-09T14:30:00',
				Salesman_name: 'Junior',
				Payment_method: 'PIX',
				Total_price: 150.5,
				Discounts: 0,
				Items: [
					{
						Name: 'Picanha Bassi',
						Supplier: 'Bassi',
						Quantity: 1.2,
						Sale_price: 150.5,
					},
				],
			},
			{
				Timestamp: '2025-11-09T10:15:00',
				Salesman_name: 'Gustavo',
				Payment_method: 'Crédito',
				Total_price: 80.0,
				Discounts: 5,
				Items: [
					{
						Name: 'Alcatra',
						Supplier: 'Frigol',
						Quantity: 1.0,
						Sale_price: 85.0,
						Discounts: 5,
					},
				],
			},
			{
				Timestamp: '2025-11-09T14:30:00',
				Salesman_name: 'Junior',
				Payment_method: 'PIX',
				Total_price: 150.5,
				Discounts: 0,
				Items: [
					{
						Name: 'Picanha Bassi',
						Supplier: 'Bassi',
						Quantity: 1.2,
						Sale_price: 150.5,
					},
				],
			},
			{
				Timestamp: '2025-11-09T10:15:00',
				Salesman_name: 'Gustavo',
				Payment_method: 'Crédito',
				Total_price: 80.0,
				Discounts: 5,
				Items: [
					{
						Name: 'Alcatra',
						Supplier: 'Frigol',
						Quantity: 1.0,
						Sale_price: 85.0,
						Discounts: 5,
					},
				],
			},
		])
	}, [navigate])

	const handleShowModal = (items) => {
		setSelectedSaleItems(items)
		setShowModal(true)
	}
	const handleCloseModal = () => setShowModal(false)

	const faturamento = sales.reduce((sum, sale) => sum + sale.Total_price, 0)
	const lucro = faturamento * 0.15

	return (
		<Container className='mt-4'>
			{error && <Alert variant='danger'>{error}</Alert>}
			<Card>
				<Card.Header as='h4'>Histórico de vendas</Card.Header>
				<Card.Body>
					<ListGroup>
						{sales.map((sale, index) => (
							<ListGroup.Item
								key={index}
								action
								onClick={() => handleShowModal(sale.Items)}
								className='d-flex justify-content-between align-items-center'
							>
								<div>
									<strong>Data:</strong>{' '}
									{new Date(sale.Timestamp).toLocaleString('pt-BR')}
									<br />
									<small className='text-muted'>
										Vendedor: {sale.Salesman_name} |
										Método: {sale.Payment_method} |
										Desconto: R$ {sale.Discounts.toFixed(2)} |
										Total: R$ {sale.Total_price.toFixed(2)}
									</small>
								</div>
								<Button variant='outline-secondary' size='sm'>
									Visualizar itens
								</Button>
							</ListGroup.Item>
						))}
					</ListGroup>
				</Card.Body>
				<Card.Footer>
					<Row>
						<Col>
							<h5>Faturamento total:</h5>
							<h4 className={!showValues ? 'valor-blur' : ''}>
								R$ {faturamento.toFixed(2)}
							</h4>
						</Col>
						<Col>
							<h5>Lucro estimado:</h5>
							<h4 className={!showValues ? 'valor-blur' : ''}>
								R$ {lucro.toFixed(2)}
							</h4>
						</Col>
						<Col xs='auto' className='d-flex align-items-center'>
							<Button
								variant='light'
								onClick={() => setShowValues(!showValues)}
							>
								{showValues ? '🙈 Hide' : '👁️ Show'}
							</Button>
						</Col>
					</Row>
				</Card.Footer>
			</Card>

			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Itens da Venda</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ListGroup variant='flush'>
						{selectedSaleItems.map((item, index) => (
							<ListGroup.Item key={index}>
								<strong>Produto: {item.Name}</strong>
								<br />
								Fornecedor: {item.Supplier} <br />
								Quantidade: {item.Quantity} <br />
								Preço: R$ {item.Sale_price.toFixed(2)}
							</ListGroup.Item>
						))}
					</ListGroup>
				</Modal.Body>
			</Modal>
		</Container>
	)
}
