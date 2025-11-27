import React, { useState, useEffect } from 'react'
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Card,
	ListGroup,
	Badge,
	InputGroup,
} from 'react-bootstrap'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Sales() {
	const [availableStock, setAvailableStock] = useState([])
	const [selectedOptionId, setSelectedOptionId] = useState('')
	const [quantity, setQuantity] = useState('')
	const [discount, setDiscount] = useState('')

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
						code: product.code,
						productId: product.id, 
						purchaseId: purchase.purchase_id, 
						name: product.product_name,
						unit: product.unitMeasurement,
						brand_name: product.brand_name,
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

	const getTotalWithDiscount = () => {
		const discountValue = parseFloat(discount) || 0
		return Math.max(0, total - discountValue)
	}

	const selectedItemData = availableStock.find(
		(i) => i.value === Number(selectedOptionId)
	)
	let labelTexto = 'Quantidade / Peso'
	let placeholderTexto = '0.00'
	let stepValue = '0.01'

	if (selectedItemData) {
		if (selectedItemData.unit === 'KG') {
			labelTexto = 'Peso (KG)'
			placeholderTexto = 'Ex: 1.250'
			stepValue = '0.001'
		} else {
			labelTexto = 'Quantidade (UN)'
			placeholderTexto = 'Ex: 2'
			stepValue = '1'
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

		// VALIDAÇÃO PARA UNIDADE - não permite números quebrados se for UN
		if (item.unit === 'UN' && !Number.isInteger(Number(quantity))) {
			toast.error('Para produtos por unidade, a quantidade deve ser um número inteiro.')
			return
		}

		if (Number(quantity) > item.quantityAvailable) {
			toast.error(`Estoque insuficiente! Disponível: ${item.quantityAvailable}`)
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
		return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
	}

	const handleRemoveItem = (uniqueId) => {
		const newCart = cart.filter(item => item.uniqueId !== uniqueId)
		setCart(newCart)
		setTotal(newCart.reduce((acc, i) => acc + i.total, 0))
	}

	const handleFinalize = async () => {
		try {
			// Converte o desconto para número
			const discountValue = parseFloat(discount) || 0
			
			// Validação do desconto
			if (discountValue < 0) {
				toast.error('Desconto não pode ser negativo.')
				return
			}
			
			if (discountValue >= total) {
				toast.error('Desconto não pode ser maior ou igual ao total da compra.')
				return
			}

			const storedUserId = localStorage.getItem('userId')
			const userId = storedUserId ? Number(storedUserId) : 1

			const payload = {
				timestamp: getLocalTimestamp(),
				paymentMethod: paymentMethod,
				discount: discountValue,
				userId: userId,
				items: cart.map((i) => ({
					productId: i.productId,
					purchaseId: i.purchaseId,
					quantity: i.quantity,
				})),
			}

			await api.post('/sales', payload)

			toast.success('Venda realizada com sucesso!')
			setCart([])
			setTotal(0)
			setDiscount('')
			loadStock()
		} catch (err) {
			console.error(err)
			const msg = err.response?.data?.message || 'Erro ao finalizar venda.'
			toast.error(msg)
		}
	}

	const discountValue = parseFloat(discount) || 0

	return (
		<Container className='mt-4'>
			<div className='text-center mb-4'>
				<h2 className='fw-bold text-dark'>Sistema de Vendas</h2>
				<p className='text-muted'>Adicione produtos ao carrinho e finalize a venda</p>
			</div>

			<Row>
				<Col md={7}>
					<Card className='shadow-sm border-0 mb-4'>
						<Card.Header className='bg-light'>
							<h5 className='mb-0'>Adicionar Produtos</h5>
						</Card.Header>
						<Card.Body className='p-4'>
							<Form onSubmit={handleAddItem}>
								<Row className='g-3'>
									<Col md={8}>
										<Form.Group>
											<Form.Label className='fw-bold'>Produto em Estoque</Form.Label>
											<Form.Select
												value={selectedOptionId}
												onChange={(e) => setSelectedOptionId(e.target.value)}
												autoFocus
											>
												<option value=''>Selecione um produto...</option>
												{availableStock.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.code} - {opt.name} ({opt.brand_name}) - {opt.quantityAvailable} {opt.unit} - R$ {opt.price.toFixed(2)}
													</option>
												))}
											</Form.Select>
										</Form.Group>
									</Col>
									<Col md={4}>
										<Form.Group>
											<Form.Label className='fw-bold'>{labelTexto}</Form.Label>
											<Form.Control
												type='number'
												step={stepValue}
												value={quantity}
												onChange={(e) => setQuantity(e.target.value)}
												placeholder={placeholderTexto}
											/>
										</Form.Group>
									</Col>
								</Row>
								<div className='text-center mt-4'>
									<Button 
										type='submit' 
										variant='primary' 
										size='lg'
										className='px-5'
										disabled={!selectedOptionId || !quantity}
									>
										Adicionar ao Carrinho
									</Button>
								</div>
							</Form>
						</Card.Body>
					</Card>

					<Card className='shadow-sm border-0'>
						<Card.Header className='bg-light d-flex justify-content-between align-items-center'>
							<h5 className='mb-0'>Carrinho de Compras</h5>
							<Badge bg='secondary'>
								{cart.length} item{cart.length !== 1 ? 's' : ''}
							</Badge>
						</Card.Header>
						<Card.Body className='p-0'>
							{cart.length === 0 ? (
								<div className='text-center py-5 text-muted'>
									<h5>Carrinho vazio</h5>
									<p>Adicione produtos para começar a venda</p>
								</div>
							) : (
								<ListGroup variant='flush'>
									{cart.map((item) => (
										<ListGroup.Item
											key={item.uniqueId}
											className='d-flex justify-content-between align-items-center py-3'
										>
											<div className='flex-grow-1'>
												<h6 className='mb-1 fw-bold'>{item.name}</h6>
												<small className='text-muted'>
													{item.quantity} {item.unit} × R$ {item.unitSalePrice.toFixed(2)}
													{item.unit === 'KG' && ` (${item.quantity}kg)`}
												</small>
											</div>
											<div className='d-flex align-items-center gap-3'>
												<strong className='text-success'>
													R$ {item.total.toFixed(2)}
												</strong>
												<Button
													variant='outline-danger'
													size='sm'
													onClick={() => handleRemoveItem(item.uniqueId)}
												>
													Remover
												</Button>
											</div>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</Card.Body>
					</Card>
				</Col>

				<Col md={5}>
					<Card className='shadow-sm border-0 sticky-top' style={{top: '20px'}}>
						<Card.Header className='bg-light'>
							<h5 className='mb-0'>Resumo da Venda</h5>
						</Card.Header>
						<Card.Body className='p-4'>
							{/* Total */}
							<div className='text-center mb-4'>
								<small className='text-muted'>TOTAL DA COMPRA</small>
								<h2 className='fw-bold text-dark'>R$ {total.toFixed(2)}</h2>
							</div>

							{/* Desconto */}
							<Form.Group className='mb-4'>
								<Form.Label className='fw-bold'>Desconto</Form.Label>
								<InputGroup>
									<InputGroup.Text>R$</InputGroup.Text>
									<Form.Control
										type='text'
										value={discount}
										onChange={(e) => setDiscount(e.target.value.replace(/[^\d.,]/g, '').replace(',', '.'))}
										placeholder='0.00'
									/>
								</InputGroup>
								<Form.Text className='text-muted'>
									Digite o valor do desconto em reais
								</Form.Text>
							</Form.Group>

							{/* Total com desconto */}
							{discountValue > 0 && (
								<div className='alert alert-success mb-4'>
									<div className='d-flex justify-content-between align-items-center'>
										<span className='fw-bold'>Total com desconto:</span>
										<h4 className='mb-0 text-success'>R$ {getTotalWithDiscount().toFixed(2)}</h4>
									</div>
									<small className='text-muted'>
										Desconto de R$ {discountValue.toFixed(2)} aplicado
									</small>
								</div>
							)}

							{/* Forma de pagamento */}
							<Form.Group className='mb-4'>
								<Form.Label className='fw-bold'>Forma de Pagamento</Form.Label>
								<Form.Select
									value={paymentMethod}
									onChange={(e) => setPaymentMethod(e.target.value)}
								>
									<option value='PIX'>Pix</option>
									<option value='CASH'>Dinheiro</option>
									<option value='CREDIT'>Crédito</option>
									<option value='DEBIT'>Débito</option>
								</Form.Select>
							</Form.Group>

							{/* Botão finalizar */}
							<Button
								variant='success'
								size='lg'
								className='w-100 py-3 fw-bold'
								onClick={handleFinalize}
								disabled={cart.length === 0 || discountValue >= total}
							>
								{cart.length === 0 ? (
									'Adicione produtos'
								) : discountValue >= total ? (
									'Desconto inválido'
								) : (
									<>Finalizar Venda - R$ {getTotalWithDiscount().toFixed(2)}</>
								)}
							</Button>

							{/* Resumo rápido */}
							{cart.length > 0 && (
								<div className='mt-3 p-3 bg-light rounded'>
									<small className='text-muted d-block'>Resumo:</small>
									<small>
										{cart.length} produto{cart.length !== 1 ? 's' : ''} • 
										{discountValue > 0 ? ` R$ ${total.toFixed(2)} - R$ ${discountValue.toFixed(2)} = R$ ${getTotalWithDiscount().toFixed(2)}` : ` R$ ${total.toFixed(2)}`}
									</small>
								</div>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>

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
					}
					.list-group-item:hover {
						background-color: #f8f9fa;
					}
					.btn:disabled {
						opacity: 0.6;
					}
				`}
			</style>
		</Container>
	)
}