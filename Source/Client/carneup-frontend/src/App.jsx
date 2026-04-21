import { useState } from 'react'

import { GlobalStyle } from './GlobalStyle'

import { LoginView } from './views/LoginView'
import { DashboardView } from './views/DashboardView'
import { SalesView } from './views/SalesView'

import { ForgotPasswordView } from './views/ForgotPasswordView'

export default function App() {
	const [currentView, setCurrentView] = useState('login')

	const renderView = () => {
		switch (currentView) {
			case 'login':
				return <LoginView navigate={setCurrentView} />
			case 'dashboard':
				return <DashboardView navigate={setCurrentView} />
			case 'sales':
				return <SalesView navigate={setCurrentView} />
			case 'forgot':
				return <ForgotPasswordView navigate={setCurrentView} />
			default:
				return <LoginView navigate={setCurrentView} />
		}
	}

	return (
		<>
			<GlobalStyle />
			{renderView()}
		</>
	)
}
