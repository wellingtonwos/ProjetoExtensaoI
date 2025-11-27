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

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StockManagement from './pages/StockManagement'
import Sales from './pages/Sales'
import Reports from './pages/Reports'
import Brands from './pages/Brands'
import Categories from './pages/Categories'

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
				<BootstrapNavbar.Brand as={Link} to='/'>
					CarneUp
				</BootstrapNavbar.Brand>
				<BootstrapNavbar.Toggle aria-controls='basic-navbar-nav' />
				<BootstrapNavbar.Collapse id='basic-navbar-nav'>
					<Nav className='me-auto'>
						<Nav.Link as={Link} to='/'>
							Dashboard
						</Nav.Link>{' '}
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
			<ToastContainer autoClose={3000} />
			<AppNavbar />
			<Container className='mt-3'>
				<Routes>
					<Route path='/login' element={<Login />} />

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

					<Route path='*' element={<Navigate to='/' />} />
				</Routes>
			</Container>
		</BrowserRouter>
	)
}

export default App
