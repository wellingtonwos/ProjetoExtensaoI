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

	const [filters, setFilters] = useState({
		paymentMethod: '',
		brand: '',
		category: '',
		product: ''
	})

	const [filterOptions, setFilterOptions] = useState({
		paymentMethods: [],
		brands: [],
		categories: [],
		products: []
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
	const [selectedSaleAllItems, setSelectedSaleAllItems] = useState([])

	const navigate = useNavigate()

	const formatMoney = (value) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(value || 0)
	}

	const extractFilterOptions = (salesData) => {
		const paymentMethods = new Set()
		const brands = new Set()
		const categories = new Set()
		const products = new Set()

		salesData.forEach(sale => {
			if (sale.paymentMethod) {
				paymentMethods.add(sale.paymentMethod)
			}

			sale.items?.forEach(item => {
				if (item.brand) brands.add(item.brand)
				if (item.category) categories.add(item.category)
				if (item.productName) products.add(item.productName)
			})
		})

		setFilterOptions({
			paymentMethods: Array.from(paymentMethods).sort(),
			brands: Array.from(brands).sort(),
			categories: Array.from(categories).sort(),
			products: Array.from(products).sort()
		})
	}

	const applyFilters = () => {
		if (sales.length === 0) {
			setFilteredSales([]);
			return;
		}

		const filtered = sales.map(sale => {
			const paymentMethodMatch = !filters.paymentMethod || sale.paymentMethod === filters.paymentMethod;
			
			if (!paymentMethodMatch) return null;

			const filteredItems = sale.items?.filter(item => {
				const brandMatch = !filters.brand || item.brand === filters.brand;
				const categoryMatch = !filters.category || item.category === filters.category;
				const productMatch = !filters.product || item.productName === filters.product;
				return brandMatch && categoryMatch && productMatch;
			}) || [];

			const shouldIncludeSale = 
				(!filters.brand && !filters.category && !filters.product) || 
				filteredItems.length > 0;

			if (!shouldIncludeSale) return null;

			const totalItemsPrice = filteredItems.reduce((sum, item) => sum + (item.total || 0), 0);
			const discount = sale.discounts || 0;
			const filteredTotalPrice = totalItemsPrice - discount;
			const filteredTotalCost = filteredItems.reduce((sum, item) => {
				const cost = (item.purchasePrice || 0) * (item.quantity || 0);
				return sum + cost;
			}, 0);

			return {
				...sale,
				items: filteredItems,
				filteredTotalPrice: filteredTotalPrice > 0 ? filteredTotalPrice : 0,
				filteredTotalCost,
				filteredProfit: filteredTotalPrice - filteredTotalCost
			};
		}).filter(sale => sale !== null);

		setFilteredSales(filtered);
	};

	const faturamento = filteredSales.reduce((sum, sale) => sum + (sale.filteredTotalPrice || 0), 0);
	const lucro = filteredSales.reduce((sum, sale) => {
		const saleTotalPrice = sale.filteredTotalPrice || 0;
		const saleTotalCost = sale.filteredTotalCost || 0;
		return sum + (saleTotalPrice - saleTotalCost);
	}, 0);
	const lucroPercentual = faturamento > 0 ? (lucro / faturamento) * 100 : 0;

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

	const handleShowModal = (filteredItems, allItems) => {
		setSelectedSaleItems(filteredItems || [])
		setSelectedSaleAllItems(allItems || [])
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
			category: '',
			product: ''
		})
	}

	const isItemFiltered = (item) => {
		const brandMatch = !filters.brand || item.brand === filters.brand;
		const categoryMatch = !filters.category || item.category === filters.category;
		const productMatch = !filters.product || item.productName === filters.product;
		return brandMatch && categoryMatch && productMatch;
	}

	const hasActiveFilters = filters.brand || filters.category || filters.product;

	return (
		<Container className='mt-4'>
			<div className='text-center mb-4'>
				<h2 className='fw-bold text-dark'>Relatórios de Vendas</h2>
				<p className='text-muted'>Histórico e análise de vendas</p>
			</div>

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
							<Col md={3}>
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
							<Col md={3}>
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
							<Col md={3}>
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
							<Col md={3}>
								<Form.Group>
									<Form.Label className='fw-bold'>Produto</Form.Label>
									<Form.Select
										value={filters.product}
										onChange={(e) => handleFilterChange('product', e.target.value)}
									>
										<option value="">Todos os produtos</option>
										{filterOptions.products.map(product => (
											<option key={product} value={product}>
												{product}
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
								disabled={!filters.paymentMethod && !filters.brand && !filters.category && !filters.product}
							>
								Limpar Filtros
							</Button>
						</div>
					</Form>
				</Card.Body>
			</Card>

			{error && <Alert variant='danger' className='text-center'>{error}</Alert>}

			<Card className='shadow-sm border-0'>
				<Card.Header className='bg-light d-flex justify-content-between align-items-center'>
					<h5 className='mb-0'>Resultados das Vendas</h5>
					<div className='d-flex gap-2'>
						<Badge bg='secondary'>
							{filteredSales.length} venda{filteredSales.length !== 1 ? 's' : ''}
						</Badge>
						{(filters.paymentMethod || filters.brand || filters.category || filters.product) && (
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
											<small className={sale.discounts > 0 ? 'text-danger' : 'text-muted'}>
												<strong>Desconto:</strong> {formatMoney(sale.discounts || 0)}
											</small>
										</div>
									</div>
									<div className='d-flex align-items-center gap-3'>
										<div className='text-end'>
											<h6 className='text-success mb-0 fw-bold'>
												{formatMoney(sale.filteredTotalPrice)}
											</h6>
											<small className='text-muted'>
												{sale.items?.length || 0} item(s) filtrado(s)
											</small>
										</div>
										<Button
											variant='outline-primary'
											size='sm'
											onClick={() => handleShowModal(sale.items, sale.items)}
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
								<small className='text-muted d-block'>
									Lucro {showValues && `(${lucroPercentual.toFixed(1)}%)`}
								</small>
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

			<Modal show={showModal} onHide={handleCloseModal} size='lg' centered>
				<Modal.Header closeButton>
					<Modal.Title>
						Itens da Venda {hasActiveFilters ? '(Itens filtrados destacados)' : ''}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className='p-0'>
					<ListGroup variant='flush'>
						{selectedSaleAllItems.map((item, index) => {
							const isFiltered = hasActiveFilters && isItemFiltered(item);
							
							return (
								<ListGroup.Item 
									key={index} 
									className='py-3'
									style={{ 
										backgroundColor: isFiltered ? '#e7f3ff' : 'white',
										borderLeft: isFiltered ? '4px solid #0d6efd' : 'none',
										borderRight: isFiltered ? '2px solid #0d6efd' : 'none'
									}}
								>
									<div className='d-flex justify-content-between align-items-start mb-2'>
										<div className='d-flex align-items-center gap-2'>
											<h6 className='mb-0 fw-bold'>{item.productName}</h6>
											{isFiltered && (
												<Badge bg='primary'>Filtrado</Badge>
											)}
										</div>
										<Badge bg={isFiltered ? 'success' : 'secondary'}>
											{formatMoney(item.total)}
										</Badge>
									</div>
									<div className='d-flex flex-wrap gap-3 text-muted'>
										<small><strong>Marca:</strong> {item.brand}</small>
										<small><strong>Categoria:</strong> {item.category}</small>
										<small><strong>Quantidade:</strong> {item.quantity}</small>
										<small><strong>Preço unit.:</strong> {formatMoney(item.salePrice)}</small>
									</div>
									<div className='mt-2'>
										<small className='text-muted'>
											{item.quantity} × {formatMoney(item.salePrice)} = {formatMoney(item.total)}
										</small>
									</div>
								</ListGroup.Item>
							);
						})}
					</ListGroup>
					{selectedSaleAllItems.length === 0 && (
						<div className='text-center py-4 text-muted'>
							<p>Nenhum item encontrado</p>
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleCloseModal}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>

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