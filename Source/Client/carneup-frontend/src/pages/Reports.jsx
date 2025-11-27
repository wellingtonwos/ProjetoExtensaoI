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
	Badge,
} from 'react-bootstrap'
import api from '../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const style = document.createElement('style')
style.innerHTML = `.valor-blur { filter: blur(8px); transition: filter 0.3s; }`
document.head.appendChild(style)

export default function Reports() {
	const [sales, setSales] = useState([])
	const [filteredSales, setFilteredSales] = useState([])
	const [error, setError] = useState(null)
	const [showValues, setShowValues] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	// Estados para os filtros
	const [filters, setFilters] = useState({
		paymentMethod: '',
		brand: '',
		category: ''
	})

	// Opções para os selects (serão preenchidas automaticamente)
	const [filterOptions, setFilterOptions] = useState({
		paymentMethods: [],
		brands: [],
		categories: []
	})

	const getPaymentMethodLabel = (method) => {
		const mapping = {
			'PIX': 'PIX',
			'CASH': 'Dinheiro',
			'DEBIT': 'Débito',
			'CREDIT': 'Crédito'
		}
		return mapping[method] || method
	}

	const formatDateTimeLocal = (date) => {
		return date.toISOString().slice(0, 16);
	};

	const getFirstDayOfMonth = () => {
		const d = new Date();
		const brasiliaDate = new Date(d.getTime() - (3 * 60 * 60 * 1000));
		return formatDateTimeLocal(new Date(brasiliaDate.getFullYear(), brasiliaDate.getMonth(), 1, 0, 0));
	};

	const getToday = () => {
		const now = new Date();
		const brasiliaNow = new Date(now.getTime() - (3 * 60 * 60 * 1000));
		return formatDateTimeLocal(brasiliaNow);
	};

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

	// Extrai opções únicas dos dados
	const extractFilterOptions = (salesData) => {
		const paymentMethods = new Set()
		const brands = new Set()
		const categories = new Set()

		salesData.forEach(sale => {
			if (sale.paymentMethod) {
				paymentMethods.add(sale.paymentMethod)
			}

			sale.items?.forEach(item => {
				if (item.brand) brands.add(item.brand)
				if (item.category) categories.add(item.category)
			})
		})

		setFilterOptions({
			paymentMethods: Array.from(paymentMethods).sort(),
			brands: Array.from(brands).sort(),
			categories: Array.from(categories).sort()
		})
	}

	// Aplica os filtros
	const applyFilters = () => {
		if (sales.length === 0) {
			setFilteredSales([])
			return
		}

		const filtered = sales.filter(sale => {
			if (filters.paymentMethod && sale.paymentMethod !== filters.paymentMethod) {
				return false
			}

			if (filters.brand || filters.category) {
				const hasMatchingItem = sale.items?.some(item => {
					const brandMatch = !filters.brand || item.brand === filters.brand
					const categoryMatch = !filters.category || item.category === filters.category
					return brandMatch && categoryMatch
				})
				
				if (!hasMatchingItem) return false
			}

			return true
		})

		setFilteredSales(filtered)
	}

	useEffect(() => {
		applyFilters()
	}, [sales, filters])

	useEffect(() => {
		handleFilter()
	}, [])

	async function handleFilter(e) {
		if (e) e.preventDefault()

		try {
			setIsLoading(true)
			
			if (!startDate || !endDate) {
				toast.warning('Selecione as datas de início e fim.')
				return
			}

			const params = {
				startDate: `${startDate}`,
				endDate: `${endDate}`,
			}

			const res = await api.get('/sales', { params })

			setSales(res.data || [])
			extractFilterOptions(res.data || [])
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
				const msg = err.response?.data?.message || 'Falha ao carregar histórico.'
				setError(`Erro: ${msg}`)
			}
		} finally {
			setIsLoading(false)
		}
	}

	const handleShowModal = (items) => {
		setSelectedSaleItems(items || [])
		setShowModal(true)
	}

	const handleCloseModal = () => setShowModal(false)

	const handleFilterChange = (filterName, value) => {
		setFilters(prev => ({
			...prev,
			[filterName]: value
		}))
	}

	const clearFilters = () => {
		setFilters({
			paymentMethod: '',
			brand: '',
			category: ''
		})
	}

	const faturamento = filteredSales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0)
	const lucro = filteredSales.reduce((sum, sale) => sum + ((sale.totalPrice || 0) - (sale.totalCost || 0)), 0)

	return (
		<Container className='mt-4'>
			<div className='text-center mb-4'>
				<h2 className='fw-bold text-dark'>Relatórios de Vendas</h2>
				<p className='text-muted'>Histórico e análise de vendas</p>
			</div>

			{/* Card de Filtros */}
			<Card className='shadow-sm border-0 mb-4'>
				<Card.Header className='bg-dark text-white'>
					<h5 className='mb-0'>Filtros de Pesquisa</h5>
				</Card.Header>
				<Card.Body className='p-4'>
					<Form onSubmit={handleFilter}>
						<Row className='align-items-end mb-4'>
							<Col md={5}>
								<Form.Group>
									<Form.Label className='fw-bold'>Data Início</Form.Label>
									<Form.Control
										type='datetime-local'
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										required
									/>
								</Form.Group>
							</Col>
							<Col md={5}>
								<Form.Group>
									<Form.Label className='fw-bold'>Data Fim</Form.Label>
									<Form.Control
										type='datetime-local'
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										required
									/>
								</Form.Group>
							</Col>
							<Col md={2}>
								<div className='d-grid'>
									<Button 
										type='submit' 
										variant='dark'
										disabled={isLoading}
									>
										{isLoading ? 'Buscando...' : 'Buscar'}
									</Button>
								</div>
							</Col>
						</Row>

						<Row className='g-3'>
							<Col md={4}>
								<Form.Group>
									<Form.Label className='fw-bold'>Método de Pagamento</Form.Label>
									<Form.Select
										value={filters.paymentMethod}
										onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
									>
										<option value="">Todos os métodos</option>
										<option value="PIX">PIX</option>
										<option value="CASH">Dinheiro</option>
										<option value="DEBIT">Débito</option>
										<option value="CREDIT">Crédito</option>
									</Form.Select>
								</Form.Group>
							</Col>
							<Col md={4}>
								<Form.Group>
									<Form.Label className='fw-bold'>Marca</Form.Label>
									<Form.Select
										value={filters.brand}
										onChange={(e) => handleFilterChange('brand', e.target.value)}
									>
										<option value="">Todas as marcas</option>
										{filterOptions.brands.map(brand => (
											<option key={brand} value={brand}>
												{brand}
											</option>
										))}
									</Form.Select>
								</Form.Group>
							</Col>
							<Col md={4}>
								<Form.Group>
									<Form.Label className='fw-bold'>Categoria</Form.Label>
									<Form.Select
										value={filters.category}
										onChange={(e) => handleFilterChange('category', e.target.value)}
									>
										<option value="">Todas as categorias</option>
										{filterOptions.categories.map(category => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</Form.Select>
								</Form.Group>
							</Col>
						</Row>
						<div className='text-center mt-3'>
							<Button 
								variant='outline-secondary' 
								onClick={clearFilters}
								disabled={!filters.paymentMethod && !filters.brand && !filters.category}
							>
								Limpar Filtros
							</Button>
						</div>
					</Form>
				</Card.Body>
			</Card>

			{error && <Alert variant='danger' className='text-center'>{error}</Alert>}

			{/* Card de Resultados */}
			<Card className='shadow-sm border-0'>
				<Card.Header className='bg-light d-flex justify-content-between align-items-center'>
					<h5 className='mb-0'>Resultados das Vendas</h5>
					<div className='d-flex gap-2'>
						<Badge bg='secondary'>
							{filteredSales.length} venda{filteredSales.length !== 1 ? 's' : ''}
						</Badge>
						{(filters.paymentMethod || filters.brand || filters.category) && (
							<Badge bg='warning' text='dark'>
								Filtrado
							</Badge>
						)}
					</div>
				</Card.Header>

				<Card.Body style={{ maxHeight: '60vh', overflowY: 'auto' }} className='p-0'>
					{filteredSales.length === 0 ? (
						<div className='text-center py-5 text-muted'>
							<h5>Nenhuma venda encontrada</h5>
							<p>Tente ajustar os filtros ou o período de datas</p>
						</div>
					) : (
						<ListGroup variant='flush'>
							{filteredSales.map((sale, index) => (
								<ListGroup.Item
									key={sale.id || index}
									className='d-flex justify-content-between align-items-center py-3'
								>
									<div className='flex-grow-1'>
										<h6 className='mb-1 fw-bold'>
											{new Date(sale.timestamp).toLocaleDateString('pt-BR')} -{' '}
											{new Date(sale.timestamp).toLocaleTimeString('pt-BR')}
										</h6>
										<div className='d-flex flex-wrap gap-3 text-muted'>
											<small>
												<strong>Vendedor:</strong> {sale.salesmanName}
											</small>
											<small>
												<strong>Pagamento:</strong> {getPaymentMethodLabel(sale.paymentMethod)}
											</small>
										</div>
									</div>
									<div className='d-flex align-items-center gap-3'>
										<div className='text-end'>
											<h6 className='text-success mb-0 fw-bold'>
												{formatMoney(sale.totalPrice)}
											</h6>
										</div>
										<Button
											variant='outline-primary'
											size='sm'
											onClick={() => handleShowModal(sale.items)}
										>
											Ver Itens
										</Button>
									</div>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</Card.Body>

				<Card.Footer className='bg-white'>
					<Row className='g-4 text-center'>
						<Col md={4}>
							<div className='p-3 border rounded'>
								<small className='text-muted d-block'>Faturamento</small>
								<h4
									className={!showValues ? 'valor-blur' : ''}
									style={{ color: 'green', margin: 0 }}
								>
									{formatMoney(faturamento)}
								</h4>
							</div>
						</Col>
						<Col md={4}>
							<div className='p-3 border rounded'>
								<small className='text-muted d-block'>Lucro</small>
								<h4
									className={!showValues ? 'valor-blur' : ''}
									style={{ color: 'blue', margin: 0 }}
								>
									{formatMoney(lucro)}
								</h4>
							</div>
						</Col>
						<Col md={4}>
							<div className='p-3 border rounded'>
								<small className='text-muted d-block'>Visibilidade</small>
								<Button
									variant={showValues ? 'outline-secondary' : 'outline-primary'}
									onClick={() => setShowValues(!showValues)}
									className='w-100'
								>
									{showValues ? 'Ocultar Valores' : 'Exibir Valores'}
								</Button>
							</div>
						</Col>
					</Row>
				</Card.Footer>
			</Card>

			{/* Modal de Itens */}
			<Modal show={showModal} onHide={handleCloseModal} size='lg' centered>
				<Modal.Header closeButton>
					<Modal.Title>Itens da Venda</Modal.Title>
				</Modal.Header>
				<Modal.Body className='p-0'>
					<ListGroup variant='flush'>
						{selectedSaleItems.map((item, index) => (
							<ListGroup.Item key={index} className='py-3'>
								<div className='d-flex justify-content-between align-items-start mb-2'>
									<h6 className='mb-0 fw-bold'>{item.productName}</h6>
									<Badge bg='success'>
										{formatMoney(item.total)}
									</Badge>
								</div>
								<div className='d-flex flex-wrap gap-3 text-muted'>
									<small><strong>Marca:</strong> {item.brand}</small>
									<small><strong>Categoria:</strong> {item.category}</small>
									<small><strong>Quantidade:</strong> {item.quantity}</small>
								</div>
								<div className='mt-2'>
									<small className='text-muted'>
										{item.quantity} × {formatMoney(item.salePrice)} = {formatMoney(item.total)}
									</small>
								</div>
							</ListGroup.Item>
						))}
					</ListGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleCloseModal}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Estilos customizados */}
			<style>
				{`
					.card {
						transition: transform 0.2s ease, box-shadow 0.2s ease;
					}
					.card:hover {
						transform: translateY(-1px);
						box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
					}
					.list-group-item {
						transition: background-color 0.2s ease;
						border-left: none;
						border-right: none;
					}
					.list-group-item:hover {
						background-color: #f8f9fa;
					}
				`}
			</style>
		</Container>
	)
}