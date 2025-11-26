import React from 'react'
import {
	BrowserRouter,
	Routes,
	Route,
	Link,
	Navigate,
	useLocation,
} from 'react-router-dom'
import {
	Nav,
	Container,
	Navbar as BootstrapNavbar,
	Button,
} from 'react-bootstrap'

// Imports das Páginas
import Login from './pages/Login'
import Dashboard from './pages/Dashboard' // <--- 1. IMPORTE AQUI
import StockManagement from './pages/StockManagement'
import Sales from './pages/Sales'
import Reports from './pages/Reports'
import Brands from './pages/Brands'
import Categories from './pages/Categories'

// Componente Navbar
function AppNavbar() {
	const location = useLocation()
	const isLoginPage = location.pathname === '/login'

	if (isLoginPage) return null

	const handleLogout = () => {
		localStorage.removeItem('authToken')
		window.location.href = '/login'
	}

	return (
		<BootstrapNavbar bg='dark' variant='dark' expand='lg'>
			<Container>
				{/* Link da marca agora leva para o Dashboard */}
				<BootstrapNavbar.Brand as={Link} to='/'>
					Junior Prime Beef
				</BootstrapNavbar.Brand>
				<BootstrapNavbar.Toggle aria-controls='basic-navbar-nav' />
				<BootstrapNavbar.Collapse id='basic-navbar-nav'>
					<Nav className='me-auto'>
						<Nav.Link as={Link} to='/'>
							Dashboard
						</Nav.Link>{' '}
						{/* Link no menu */}
						<Nav.Link as={Link} to='/stock'>
							Estoque
						</Nav.Link>
						<Nav.Link as={Link} to='/sales'>
							Vendas
						</Nav.Link>
						<Nav.Link as={Link} to='/reports'>
							Relatórios
						</Nav.Link>
						<Nav.Link as={Link} to='/brands'>
							Marcas
						</Nav.Link>
						<Nav.Link as={Link} to='/categories'>
							Categorias
						</Nav.Link>
					</Nav>
					<Nav>
						<Button variant='outline-light' size='sm' onClick={handleLogout}>
							Sair
						</Button>
					</Nav>
				</BootstrapNavbar.Collapse>
			</Container>
		</BootstrapNavbar>
	)
}

function PrivateRoute({ children }) {
	const token = localStorage.getItem('authToken')
	return token ? children : <Navigate to='/login' />
}

function App() {
	return (
		<BrowserRouter>
			<AppNavbar />
			<Container className='mt-3'>
				<Routes>
					<Route path='/login' element={<Login />} />

					{/* 2. DEFINA O DASHBOARD COMO A ROTA RAIZ "/" */}
					<Route
						path='/'
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>

					<Route
						path='/stock'
						element={
							<PrivateRoute>
								<StockManagement />
							</PrivateRoute>
						}
					/>
					<Route
						path='/sales'
						element={
							<PrivateRoute>
								<Sales />
							</PrivateRoute>
						}
					/>
					<Route
						path='/reports'
						element={
							<PrivateRoute>
								<Reports />
							</PrivateRoute>
						}
					/>
					<Route
						path='/brands'
						element={
							<PrivateRoute>
								<Brands />
							</PrivateRoute>
						}
					/>
					<Route
						path='/categories'
						element={
							<PrivateRoute>
								<Categories />
							</PrivateRoute>
						}
					/>

					{/* Redireciona qualquer rota desconhecida para o Dashboard */}
					<Route path='*' element={<Navigate to='/' />} />
				</Routes>
			</Container>
		</BrowserRouter>
	)
}

export default App
