import { useState } from 'react'

import { GlobalStyle } from './GlobalStyle'

import { LoginView } from './views/LoginView'
import { DashboardView } from './views/DashboardView'
import { SalesView } from './views/SalesView'

import { ForgotPasswordView } from './views/ForgotPasswordView'
import { RecoveryCodeView } from './views/RecoveryCodeView'
import { ResetPasswordView } from './views/ResetPasswordView'
import { SuccessView } from './views/SuccessView'

export default function App() {
	const [currentView, setCurrentView] = useState('login')
	const [recoveryEmail, setRecoveryEmail] = useState('')
	const [recoveryCode, setRecoveryCode] = useState('')

	const renderView = () => {
		switch (currentView) {
			case 'login':
				return <LoginView navigate={setCurrentView} />
			case 'dashboard':
				return <DashboardView navigate={setCurrentView} />
			case 'sales':
				return <SalesView navigate={setCurrentView} />
			case 'forgot':
				return (
					<ForgotPasswordView
						navigate={setCurrentView}
						setRecoveryEmail={setRecoveryEmail}
					/>
				)
			case 'code':
				return (
					<RecoveryCodeView
						navigate={setCurrentView}
						recoveryEmail={recoveryEmail}
						setRecoveryCode={setRecoveryCode}
					/>
				)
			case 'reset':
				return (
					<ResetPasswordView
						navigate={setCurrentView}
						recoveryCode={recoveryCode}
					/>
				)
			case 'success':
				return <SuccessView navigate={setCurrentView} />
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
