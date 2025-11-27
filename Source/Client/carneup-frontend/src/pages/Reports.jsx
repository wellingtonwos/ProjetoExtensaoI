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
	Form,
	InputGroup,
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

	const getFirstDayOfMonth = () => {
		const date = new Date()
		return new Date(date.getFullYear(), date.getMonth(), 1)
			.toISOString()
			.split('T')[0]
	}
	const getToday = () => {
		return new Date().toISOString().split('T')[0]
	}

	const [startDate, setStartDate] = useState(getFirstDayOfMonth())
	const [endDate, setEndDate] = useState(getToday())

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
		handleFilter()
	})

	async function handleFilter(e) {
		if (e) e.preventDefault()

		try {
			if (!startDate || !endDate) {
				toast.warning('Selecione as datas de início e fim.')
				return
			}

			const params = {
				startDate: `${startDate}T00:00:00`,
				endDate: `${endDate}T23:59:59`,
			}

			const res = await api.get('/sales', { params })

			setSales(res.data || [])
			setError(null)

			if (res.data.length === 0) {
				toast.info('Nenhuma venda encontrada neste período.')
			}
		} catch (err) {
			console.error(err)
			if (err.response && err.response.status === 401) {
				toast.error('Sessão expirada. Faça login novamente.')
				navigate('/login')
			} else {
				const msg =
					err.response?.data?.message || 'Falha ao carregar histórico.'
				setError(`Erro: ${msg}`)
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
			<div className='mb-4'>
				<h3>Histórico de Vendas</h3>

				<Card className='mt-3 bg-light'>
					<Card.Body className='py-3'>
						<Form onSubmit={handleFilter}>
							<Row className='align-items-end'>
								<Col md={4}>
									<Form.Group>
										<Form.Label>Data Início</Form.Label>
										<Form.Control
											type='date'
											value={startDate}
											onChange={(e) => setStartDate(e.target.value)}
											required
										/>
									</Form.Group>
								</Col>
								<Col md={4}>
									<Form.Group>
										<Form.Label>Data Fim</Form.Label>
										<Form.Control
											type='date'
											value={endDate}
											onChange={(e) => setEndDate(e.target.value)}
											required
										/>
									</Form.Group>
								</Col>
								<Col md={4}>
									<div className='d-grid'>
										<Button type='submit' variant='primary'>
											🔍 Filtrar Período
										</Button>
									</div>
								</Col>
							</Row>
						</Form>
					</Card.Body>
				</Card>
			</div>

			{error && <Alert variant='danger'>{error}</Alert>}

			<Card>
				<Card.Header
					as='h5'
					className='d-flex justify-content-between align-items-center'
				>
					<span>Resultados</span>
					<span className='badge bg-secondary'>{sales.length} Vendas</span>
				</Card.Header>

				<Card.Body style={{ maxHeight: '55vh', overflowY: 'auto' }}>
					{sales.length === 0 ? (
						<div className='text-center py-5 text-muted'>
							<h5>Nenhum registro encontrado</h5>
							<p>Tente alterar o filtro de datas acima.</p>
						</div>
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
											<strong>
												{dataVenda
													? new Date(dataVenda).toLocaleString('pt-BR')
													: '--/--/--'}
											</strong>
											<br />
											<small className='text-muted'>
												Vend: {vendedor} | Pgto: {metodo}
											</small>
											<br />
											<span className='text-success fw-bold'>
												{formatMoney(total)}
											</span>
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
							<h5>Faturamento:</h5>
							<h4
								className={!showValues ? 'valor-blur' : ''}
								style={{ color: 'green' }}
							>
								{formatMoney(faturamento)}
							</h4>
						</Col>
						<Col>
							<h5>Lucro (15%):</h5>
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
								size='sm'
								onClick={() => setShowValues(!showValues)}
							>
								{showValues ? '🙈' : '👁️'}
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
							const nome =
								item.name || item.Name || item.product?.name || 'Produto'
							const fornecedor = item.supplier || item.Supplier || '-'
							const qtd = item.quantity || item.Quantity
							const preco =
								item.sale_price || item.Sale_price || item.unit_price || 0

							return (
								<ListGroup.Item key={index}>
									<strong>{nome}</strong>
									<br />
									<small className='text-muted'>Marca: {fornecedor}</small>{' '}
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
