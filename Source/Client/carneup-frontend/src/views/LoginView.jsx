import React, { useState } from 'react'
import styled from 'styled-components'

// ==========================================
// ESTILOS
// ==========================================

const Wrapper = styled.div`
	background-color: #eeeeee;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	font-family: 'Work Sans', sans-serif;
	color: #1a1c1c;
`

const Header = styled.header`
	width: 100%;
	padding: 24px;
	display: flex;
	justify-content: flex-end;
`

const HelpButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	background: transparent;
	border: none;
	color: #5a403c;
	cursor: pointer;
	transition: color 0.2s;

	&:hover {
		color: #1a1c1c;
	}
	span:first-child {
		font-weight: 500;
		font-size: 14px;
	}
`

const Main = styled.main`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
`

const LoginCard = styled.div`
	width: 100%;
	max-width: 480px;
	background-color: #ffffff;
	border-radius: 4px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	display: flex;
	flex-direction: column;
`

const HeroImage = styled.div`
	width: 100%;
	height: 160px;
	background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyu5khZZOK69PnDwJDilUi261VWwxEbGMLZiPd9eNhwQH15Jqt7pOPc4T-Q_uGTS2cl7RykRMc3TrEokgT7n6nCHDOUqdJ09heX-37UZdFUNPCejCEJZOBeec7joOWmFDdJv13-AKKlYryYUcEX7zE9kiyhumIzJregf1Xhx4lGgNMZDhVwZ7BaRiPL2nzAUxZx7QbgDawhxJ73MQVbN03E9z-4xIJhUyKtYqcrFNI1bLC_E_aNLH1FWvS_kStvsK31a2fLuFANOY');
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
	position: relative;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background-color: rgba(249, 249, 249, 0.2);
	}

	@media (max-width: 640px) {
		height: 128px;
	}
`

const ContentContainer = styled.div`
	padding: 0 32px 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const LogoBox = styled.div`
	width: 96px;
	height: 96px;
	border-radius: 50%;
	border: 4px solid #ffffff;
	margin-top: -48px;
	background-color: #f9f9f9;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	z-index: 10;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuApmaDLSHGHO5fognudTS_Uxh00Y8IRppqxSqR9owIO7Ly-O1DA_5PtVR4eUL34GOuy5qJ8lgdgQh1Z8o3Aqqo3gvQUPRUjvV6CGOLIuT4FCTCo8RGrk8hyVZnWtIssIpIMF77a_gTWdgcx8F8zBTjcXWhzwV-0XjC0Z7cRAVdXj7N-au1JueuGJQKfykBQF2GzhB96tO4DWdLmDjKIYsaurYIECJt2ybcuZc4LNzefh8gJP83jbJ3pS112rTA--eJXDLx8wfW_jr8');
	background-position: center;
	background-size: cover;
`

const Title = styled.h1`
	font-family: 'Epilogue', sans-serif;
	font-size: 30px;
	font-weight: 700;
	color: #1a1c1c;
	letter-spacing: -0.025em;
	margin-top: 24px;
	margin-bottom: 32px;
	text-align: center;
`

const Form = styled.form`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 24px;
`

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

const Label = styled.label`
	font-weight: 600;
	font-size: 14px;
	color: #1a1c1c;
	text-transform: uppercase;
	letter-spacing: 0.05em;
`

const InputWrapper = styled.div`
	position: relative;

	.icon {
		position: absolute;
		left: 16px;
		top: 50%;
		transform: translateY(-50%);
		color: #5a403c;
	}
`

const StyledInput = styled.input`
	width: 100%;
	height: 56px;
	background-color: #f3f3f3;
	border: none;
	border-bottom: 2px solid
		${(props) => (props.$hasError ? '#ba1a1a' : '#e3beb8')};
	padding: 0 16px 0 48px;
	font-family: 'Work Sans', sans-serif;
	font-size: 16px;
	color: #1a1c1c;
	outline: none;
	transition: border-color 0.2s;

	&::placeholder {
		color: rgba(90, 64, 60, 0.5);
	}
	&:focus {
		border-color: ${(props) => (props.$hasError ? '#ba1a1a' : '#b32925')};
	}
`

const ErrorMessage = styled.span`
	color: #ba1a1a; /* Cor de erro oficial da sua paleta */
	font-size: 14px;
	font-weight: 600;
	text-align: center;
	margin-top: -8px;
`

const ForgotPasswordLink = styled.button`
	background: none;
	border: none;
	font-size: 14px;
	color: #610005;
	font-weight: 500;
	text-align: right;
	margin-top: -16px;
	cursor: pointer;
	transition: color 0.2s;

	&:hover {
		color: #8a040d;
		text-decoration: underline;
	}
`

const SubmitButton = styled.button`
	width: 100%;
	height: 56px;
	border-radius: 4px;
	background: linear-gradient(to right, #610005, #8a040d);
	color: #ffffff;
	border: none;
	font-family: 'Epilogue', sans-serif;
	font-weight: 700;
	font-size: 18px;
	letter-spacing: 0.025em;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-top: 8px;
	transition: all 0.2s;

	&:hover {
		opacity: 0.9;
	}
	&:active {
		transform: scale(0.98);
	}
`

const Footer = styled.footer`
	width: 100%;
	padding: 16px 0;
	text-align: center;
	font-size: 12px;
	color: #5a403c;
`

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export const LoginView = ({ navigate }) => {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()
		setError(false)

		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

		if (login.trim() === '' || !passwordRegex.test(password)) {
			setError(true)
			return
		}

		alert('Login validado com sucesso! Redirecionando...')
	}

	return (
		<Wrapper>
			<Header>
				<HelpButton>
					<span>Precisa de ajuda?</span>
					<span className='material-symbols-outlined'>help</span>
				</HelpButton>
			</Header>

			<Main>
				<LoginCard>
					<HeroImage />
					<ContentContainer>
						<LogoBox />
						<Title>CarneUp</Title>

						<Form onSubmit={handleSubmit}>
							<InputGroup>
								<Label htmlFor='login'>Usuário ou E-mail</Label>
								<InputWrapper>
									<span className='material-symbols-outlined icon'>person</span>
									<StyledInput
										id='login'
										type='text'
										placeholder='Digite seu e-mail ou usuário'
										value={login}
										onChange={(e) => setLogin(e.target.value)}
										$hasError={error}
									/>
								</InputWrapper>
							</InputGroup>

							<InputGroup>
								<Label htmlFor='password'>Senha</Label>
								<InputWrapper>
									<span className='material-symbols-outlined icon'>lock</span>
									<StyledInput
										id='password'
										type='password'
										placeholder='••••••••'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										$hasError={error}
									/>
								</InputWrapper>
							</InputGroup>

							{error && <ErrorMessage>E-mail ou senha incorretos</ErrorMessage>}

							<ForgotPasswordLink
								type='button'
								onClick={() => navigate('forgot')}
							>
								Esqueceu a senha?
							</ForgotPasswordLink>

							<SubmitButton type='submit' onClick={() => navigate('dashboard')}>
								<span>Entrar</span>
								<span className='material-symbols-outlined'>arrow_forward</span>
							</SubmitButton>
						</Form>
					</ContentContainer>
				</LoginCard>
			</Main>

			<Footer>CarneUp System v1.0.0 © 2026</Footer>
		</Wrapper>
	)
}
