import styled from 'styled-components'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

const ViewTitle = styled.h2`
	font-size: 30px;
	font-weight: 400;
	margin-bottom: 10px;
	text-align: left;
	color: #fff;
	padding-left: 25px;
`

const ForgotLink = styled.span`
	font-size: 15px;
	font-weight: 600;
	color: #fff;
	text-decoration: none;
	cursor: pointer;
	margin-top: 10px;
	display: inline-block;
	align-self: flex-start;
	padding-left: 25px;
`

const FormContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 30px;
	align-items: center;
`

export const LoginView = ({ navigate }) => {
	return (
		<>
			<ViewTitle>Login</ViewTitle>

			<FormContainer>
				<Input type='text' placeholder='Digite seu e-mail ou usuário' />
				<Input type='password' placeholder='********' />
			</FormContainer>

			<ForgotLink onClick={() => navigate('forgot')}>
				Esqueci minha senha
			</ForgotLink>

			<Button onClick={() => alert('Mock: Entrar clicado')}>Entrar</Button>
		</>
	)
}
