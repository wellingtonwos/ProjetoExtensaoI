import styled from 'styled-components'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

const ViewTitle = styled.h2`
	font-size: 30px;
	font-weight: 400;
	margin-bottom: 50px;
	text-align: center;
	color: #fff;
`

const FormContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 30px;
	align-items: center;
`

export const ForgotPasswordView = ({ navigate }) => {
	return (
		<>
			<ViewTitle>Esqueci minha senha</ViewTitle>
			<FormContainer>
				<Input type='text' placeholder='Digite seu e-mail ou usuário' />
			</FormContainer>
			<Button onClick={() => navigate('code')}>Enviar código</Button>
		</>
	)
}
