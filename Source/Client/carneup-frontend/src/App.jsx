import { useState } from 'react'

import { AuthLayout } from './components/AuthLayout'

import { LoginView } from './views/LoginView'
import { ForgotPasswordView } from './views/ForgotPasswordView'
import { RecoveryCodeView } from './views/RecoveryCodeView'
import { ResetPasswordView } from './views/ResetPasswordView'
import { SuccessView } from './views/SuccessView'

export default function App() {
	const [currentView, setCurrentView] = useState('login')

	const renderView = () => {
		switch (currentView) {
			case 'login':
				return <LoginView navigate={setCurrentView} />
			case 'forgot':
				return <ForgotPasswordView navigate={setCurrentView} />
			case 'code':
				return <RecoveryCodeView navigate={setCurrentView} />
			case 'reset':
				return <ResetPasswordView navigate={setCurrentView} />
			case 'success':
				return <SuccessView navigate={setCurrentView} />
			default:
				return <LoginView navigate={setCurrentView} />
		}
	}

	return <AuthLayout>{renderView()}</AuthLayout>
}
