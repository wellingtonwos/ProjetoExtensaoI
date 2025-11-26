import React, { useState, useEffect } from 'react'
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
import api from '../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const style = document.createElement('style')
style.innerHTML = `.valor-blur { filter: blur(8px); transition: filter 0.3s; }`
document.head.appendChild(style)

export default function Reports() {
	const [sales, setSales] = useState([])
	const [error, setError] = useState(null)
	const [showValues, setShowValues] = useState(false)

	const [showModal, setShowModal] = useState(false)
	const [selectedSaleItems, setSelectedSaleItems] = useState([])

	const navigate = useNavigate()

	const formatMoney = (value) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(value || 0)
	}

	useEffect(() => {
		fetchSales()
	}, [])

	async function fetchSales() {
		try {
			const res = await api.get('/sales')
			setSales(res.data || [])
			setError(null)
		} catch (err) {
			console.error(err)
			if (err.response && err.response.status === 401) {
				toast.error('Sessão expirada. Faça login novamente.')
				navigate('/login')
			} else {
				setError('Falha ao carregar o histórico de vendas.')
			}
		}
	}

	const handleShowModal = (items) => {
		setSelectedSaleItems(items || [])
		setShowModal(true)
	}

	const handleCloseModal = () => setShowModal(false)

	const faturamento = sales.reduce((sum, sale) => {
		const valor = sale.total_price || sale.Total_price || 0
		return sum + valor
	}, 0)

	const lucro = faturamento * 0.15

	return (
		<Container className='mt-4'>
			{error && <Alert variant='danger'>{error}</Alert>}

			<div className='mb-3'>
				<h3>Histórico de Vendas</h3>
			</div>

			<Card>
				<Card.Header as='h5' className='d-flex justify-content-between'>
					<span>Transações</span>
					<span className='fs-6 text-muted'>{sales.length} registros</span>
				</Card.Header>

				<Card.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
					{sales.length === 0 ? (
						<p className='text-center text-muted mt-3'>
							Nenhuma venda registrada.
						</p>
					) : (
						<ListGroup variant='flush'>
							{sales.map((sale, index) => {
								const dataVenda = sale.timestamp || sale.Timestamp
								const vendedor =
									sale.salesman_name || sale.Salesman_name || 'Sistema'
								const metodo = sale.payment_method || sale.Payment_method || '-'
								const total = sale.total_price || sale.Total_price || 0
								const itens = sale.items || sale.Items || []

								return (
									<ListGroup.Item
										key={index}
										className='d-flex justify-content-between align-items-center'
									>
										<div>
											<strong>Data:</strong>{' '}
											{dataVenda
												? new Date(dataVenda).toLocaleString('pt-BR')
												: '--/--/--'}
											<br />
											<small className='text-muted'>
												Vend: {vendedor} | Pgto: {metodo}
											</small>
											<br />
											<strong>Total: {formatMoney(total)}</strong>
										</div>

										<Button
											variant='outline-secondary'
											size='sm'
											onClick={() => handleShowModal(itens)}
										>
											Ver Itens
										</Button>
									</ListGroup.Item>
								)
							})}
						</ListGroup>
					)}
				</Card.Body>

				<Card.Footer>
					<Row>
						<Col>
							<h5>Faturamento Total:</h5>
							<h4
								className={!showValues ? 'valor-blur' : ''}
								style={{ color: 'green' }}
							>
								{formatMoney(faturamento)}
							</h4>
						</Col>
						<Col>
							<h5>Lucro Estimado (15%):</h5>
							<h4
								className={!showValues ? 'valor-blur' : ''}
								style={{ color: 'blue' }}
							>
								{formatMoney(lucro)}
							</h4>
						</Col>
						<Col xs='auto' className='d-flex align-items-center'>
							<Button
								variant='light'
								onClick={() => setShowValues(!showValues)}
							>
								{showValues ? '🙈 Ocultar' : '👁️ Mostrar'}
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
						{selectedSaleItems.map((item, index) => {
							const nome = item.name || item.Name || item.product?.name
							const fornecedor = item.supplier || item.Supplier
							const qtd = item.quantity || item.Quantity
							const preco =
								item.sale_price || item.Sale_price || item.unit_price

							return (
								<ListGroup.Item key={index}>
									<strong>{nome}</strong>
									<br />
									<small className='text-muted'>
										Fornecedor: {fornecedor}
									</small>{' '}
									<br />
									{qtd} x {formatMoney(preco)}
								</ListGroup.Item>
							)
						})}
					</ListGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleCloseModal}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	)
}
