import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import TopNavbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StockManagement from './pages/StockManagement'
import Sales from './pages/Sales'
import Reports from './pages/Reports'
import Suppliers from './pages/Suppliers'

function PrivateRoute({ children }) {
	const token = localStorage.getItem('token')
	return token ? children : <Navigate to='/login' replace />
}

export default function App() {
	return (
		<BrowserRouter>
			<TopNavbar />
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
					path='/suppliers'
					element={
						<PrivateRoute>
							<Suppliers />
						</PrivateRoute>
					}
				/>
			</Routes>
			<ToastContainer position='top-right' autoClose={3000} />
		</BrowserRouter>
	)
}
