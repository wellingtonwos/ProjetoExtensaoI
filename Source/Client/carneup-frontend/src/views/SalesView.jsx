import styled from 'styled-components'

// --- ESTILOS ---
const VendasWrapper = styled.div`
	background-color: #fafaf9; /* stone-50 */
	color: #1a1c1c;
	display: flex;
	height: 100vh;
	overflow: hidden;
	font-family: 'Work Sans', sans-serif;
`

const CompactSidebar = styled.aside`
	display: flex;
	flex-direction: column;
	height: 100%;
	background-color: #f5f5f4; /* stone-100 */
	width: 80px;
	border-right: 1px solid #e7e5e4;

	@media (min-width: 1024px) {
		width: 256px;
	}
`

const LogoArea = styled.div`
	padding: 24px;
	text-align: center;
	@media (min-width: 1024px) {
		text-align: left;
	}

	h1 {
		font-family: 'Epilogue', sans-serif;
		font-size: 24px;
		font-weight: 900;
		color: #7f1d1d;
	}
	p {
		display: none;
		font-size: 10px;
		text-transform: uppercase;
		color: #78716c;
		@media (min-width: 1024px) {
			display: block;
		}
	}
`

const MainArea = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	min-width: 0;
`

const Header = styled.header`
	height: 64px;
	background-color: #ffffff;
	border-bottom: 1px solid #e7e5e4;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24px;
	flex-shrink: 0;

	.search-container {
		display: flex;
		align-items: center;
		background-color: #f5f5f4;
		border-radius: 999px;
		padding: 8px 16px;
		width: 320px;

		input {
			background: transparent;
			border: none;
			outline: none;
			font-family: 'Epilogue', sans-serif;
			font-size: 14px;
			width: 100%;
			margin-left: 8px;
		}
	}
`

const ContentArea = styled.main`
	flex: 1;
	display: flex;
	overflow: hidden;
`

const ProductSection = styled.section`
	flex: 1;
	display: flex;
	flex-direction: column;
	background-color: #fafaf9;
`

const Categories = styled.div`
	padding: 24px;
	background-color: #ffffff;
	border-bottom: 1px solid #e7e5e4;
	display: flex;
	gap: 12px;
	overflow-x: auto;

	button {
		padding: 16px 32px;
		border-radius: 12px;
		font-family: 'Epilogue', sans-serif;
		font-size: 14px;
		font-weight: 900;
		border: none;
		cursor: pointer;
		white-space: nowrap;

		&.active {
			background-color: #610005;
			color: #ffffff;
			box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		}
		&.inactive {
			background-color: #f5f5f4;
			color: #44403c;
		}
	}
`

const ProductGrid = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 24px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 24px;
	align-content: flex-start;
	@media (min-width: 1280px) {
		grid-template-columns: repeat(3, 1fr);
	}
`

const ProductCard = styled.button`
	background-color: #ffffff;
	border-radius: 12px;
	border: 1px solid #e7e5e4;
	overflow: hidden;
	text-align: left;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	transition: all 0.2s;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	img {
		width: 100%;
		aspect-ratio: 16/10;
		object-fit: cover;
	}
	.info {
		padding: 20px;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.category {
		font-size: 10px;
		font-family: 'Epilogue', sans-serif;
		font-weight: 900;
		color: #991b1b;
		text-transform: uppercase;
	}
	h3 {
		font-family: 'Epilogue', sans-serif;
		font-size: 20px;
		font-weight: 800;
		text-transform: uppercase;
		margin-top: 4px;
	}
	.price-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-top: 24px;
	}
	.price {
		font-size: 30px;
		font-family: 'Epilogue', sans-serif;
		font-weight: 900;
		color: #610005;
	}
`

const CartSidebar = styled.aside`
	width: 450px;
	background-color: #ffffff;
	border-left: 1px solid #e7e5e4;
	display: flex;
	flex-direction: column;
	z-index: 20;
	box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
`

const CartHeader = styled.div`
	padding: 24px;
	border-bottom: 1px solid #f5f5f4;
	background-color: rgba(250, 250, 249, 0.5);
	h2 {
		font-family: 'Epilogue', sans-serif;
		font-size: 24px;
		font-weight: 900;
		text-transform: uppercase;
	}
`

const CartFooter = styled.div`
	padding: 24px;
	background-color: #ffffff;
	border-top: 2px solid #f5f5f4;

	.total-box {
		background-color: #1c1917;
		padding: 24px;
		border-radius: 12px;
		color: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 24px;

		.label {
			font-size: 10px;
			font-family: 'Epilogue', sans-serif;
			font-weight: 900;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			opacity: 0.6;
		}
		.value {
			font-size: 48px;
			font-family: 'Epilogue', sans-serif;
			font-weight: 900;
			line-height: 1;
		}
	}

	.finalize-btn {
		width: 100%;
		padding: 24px;
		background-color: #610005;
		color: #ffffff;
		border-radius: 12px;
		font-family: 'Epilogue', sans-serif;
		font-size: 18px;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.3em;
		border: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;
	}
`

// --- COMPONENTE ---
export const VendasView = () => {
	return (
		<VendasWrapper>
			<CompactSidebar>
				<LogoArea>
					<h1>CarneUp</h1>
					<p>Master Butcher</p>
				</LogoArea>
				{/* Adicionar ícones de navegação aqui */}
			</CompactSidebar>

			<MainArea>
				<Header>
					<div className='search-container'>
						<span
							className='material-symbols-outlined'
							style={{ color: '#a8a29e' }}
						>
							search
						</span>
						<input type='text' placeholder='PESQUISAR PRODUTO...' />
					</div>
				</Header>

				<ContentArea>
					<ProductSection>
						<Categories>
							<button className='active'>TODOS</button>
							<button className='inactive'>BOVINO</button>
							<button className='inactive'>SUÍNO</button>
							<button className='inactive'>FRANGO</button>
						</Categories>

						<ProductGrid>
							<ProductCard>
								<img
									src='https://lh3.googleusercontent.com/aida-public/AB6AXuC84ad8Fmzd2bqdgT_W5PBpqhxtiUITlJ9RBl0MojB8HhALiMllTu7c9iK1Ia271QYrIs69BvI1eVchZvIQQAZjG1RRgGRfHy0JNhviJbhmOTu3oWvqn5jpgKws40VgSzmOGYUitSKyJqCMqCwH2vc1CN6o5QvgVTafcWP-mOVlwXJaRBuAhLCI72bvvFkbx9JMI8xZKEKAZTfNOTWGfESxEfXgmZK-evGWiY2AerdLEsdaZDIUT-SV1YsmFRYj1TTNyYUlGmER_bk'
									alt='Picanha'
								/>
								<div className='info'>
									<div>
										<span className='category'>Bovino</span>
										<h3>Picanha Maturatta</h3>
									</div>
									<div className='price-row'>
										<span
											style={{
												fontSize: '12px',
												fontWeight: 'bold',
												color: '#a8a29e',
											}}
										>
											R$ / KG
										</span>
										<span className='price'>124,50</span>
									</div>
								</div>
							</ProductCard>
							{/* Replicar o ProductCard para os outros itens */}
						</ProductGrid>
					</ProductSection>

					<CartSidebar>
						<CartHeader>
							<h2>Pedido Atual</h2>
						</CartHeader>

						<div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
							{/* Lista de itens do carrinho */}
						</div>

						<CartFooter>
							<div className='total-box'>
								<div>
									<p className='label'>Valor Total</p>
								</div>
								<div className='value'>R$ 254,23</div>
							</div>
							<button className='finalize-btn'>
								Finalizar Venda
								<span className='material-symbols-outlined'>chevron_right</span>
							</button>
						</CartFooter>
					</CartSidebar>
				</ContentArea>
			</MainArea>
		</VendasWrapper>
	)
}
