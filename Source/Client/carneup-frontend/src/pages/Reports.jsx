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
		return formatDateTimeLocal(new Date(d.getFullYear(), d.getMonth(), 1, 0, 0));
	};

	const getToday = () => {
		const now = new Date();
		return formatDateTimeLocal(now);
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
			// Método de pagamento
			if (sale.paymentMethod) {
				paymentMethods.add(sale.paymentMethod)
			}

			// Marca e categoria dos itens
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
			// Filtro por método de pagamento
			if (filters.paymentMethod && sale.paymentMethod !== filters.paymentMethod) {
				return false
			}

			// Filtro por marca e categoria (verifica se algum item atende)
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

	// Aplica filtros quando sales ou filters mudam
	useEffect(() => {
		applyFilters()
	}, [sales, filters])

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
			<div className='mb-4'>
				<h3>Histórico de Vendas</h3>

				<Card className='mt-3 bg-light'>
					<Card.Body className='py-3'>
						<Form onSubmit={handleFilter}>
							{/* Filtro por Data */}
							<Row className='align-items-end mb-3'>
								<Col md={4}>
									<Form.Group>
										<Form.Label>Data Início</Form.Label>
										<Form.Control
											type='datetime-local'
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
											type='datetime-local'
											value={endDate}
											onChange={(e) => setEndDate(e.target.value)}
											required
										/>
									</Form.Group>
								</Col>
								<Col md={4}>
									<div className='d-grid'>
										<Button 
											type='submit' 
											variant='primary'
											disabled={isLoading}
										>
											{isLoading ? '⏳ Carregando...' : '🔍 Buscar Vendas'}
										</Button>
									</div>
								</Col>
							</Row>

							{/* Filtros Adicionais */}
							<Row className='align-items-end'>
								<Col md={3}>
									<Form.Group>
										<Form.Label>Método de Pagamento</Form.Label>
										<Form.Select
											value={filters.paymentMethod}
											onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
										>
											<option value="">Todos</option>
											<option value="PIX">PIX</option>
											<option value="CASH">Dinheiro</option>
											<option value="DEBIT">Débito</option>
											<option value="CREDIT">Crédito</option>
										</Form.Select>
									</Form.Group>
								</Col>
								<Col md={3}>
									<Form.Group>
										<Form.Label>Marca</Form.Label>
										<Form.Select
											value={filters.brand}
											onChange={(e) => handleFilterChange('brand', e.target.value)}
										>
											<option value="">Todas</option>
											{filterOptions.brands.map(brand => (
												<option key={brand} value={brand}>
													{brand}
												</option>
											))}
										</Form.Select>
									</Form.Group>
								</Col>
								<Col md={3}>
									<Form.Group>
										<Form.Label>Categoria</Form.Label>
										<Form.Select
											value={filters.category}
											onChange={(e) => handleFilterChange('category', e.target.value)}
										>
											<option value="">Todas</option>
											{filterOptions.categories.map(category => (
												<option key={category} value={category}>
													{category}
												</option>
											))}
										</Form.Select>
									</Form.Group>
								</Col>
								<Col md={3}>
									<div className='d-grid gap-2'>
										<Button 
											variant='outline-secondary' 
											onClick={clearFilters}
											disabled={!filters.paymentMethod && !filters.brand && !filters.category}
										>
											🗑️ Limpar Filtros
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
					<div>
						<span className='badge bg-secondary me-2'>{filteredSales.length} Vendas</span>
						{(filters.paymentMethod || filters.brand || filters.category) && (
							<span className='badge bg-warning'>Filtrado</span>
						)}
					</div>
				</Card.Header>

				<Card.Body style={{ maxHeight: '55vh', overflowY: 'auto' }}>
					{filteredSales.length === 0 ? (
						<div className='text-center py-5 text-muted'>
							<h5>Nenhum registro encontrado</h5>
							<p>Tente alterar os filtros acima.</p>
						</div>
					) : (
						<ListGroup variant='flush'>
							{filteredSales.map((sale, index) => (
								<ListGroup.Item
									key={sale.id || index}
									className='d-flex justify-content-between align-items-center'
								>
									<div>
										<strong>
											{sale.timestamp
												? new Date(sale.timestamp).toLocaleString('pt-BR')
												: '--/--/--'}
										</strong>
										<br />
										<small className='text-muted'>
											Vend: {sale.salesmanName} | Pgto: {getPaymentMethodLabel(sale.paymentMethod)}
										</small>
										<br />
										<span className='text-success fw-bold'>
											Total: {formatMoney(sale.totalPrice)}
										</span>
										&nbsp; Descontos: {formatMoney(sale.discounts)}
									</div>

									<Button
										variant='outline-secondary'
										size='sm'
										onClick={() => handleShowModal(sale.items)}
									>
										Ver Itens
									</Button>
								</ListGroup.Item>
							))}
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
							<h5>Lucro:</h5>
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
								{showValues ? 'Ocultar' : 'Exibir'}
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
								<strong>{item.productName}</strong>
								<br />
								<small className='text-muted'>
									Marca: {item.brand} | Categoria: {item.category}
								</small>
								<br />
								{item.quantity} x {formatMoney(item.salePrice)} = {formatMoney(item.total)}
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
		</Container>
	)
}