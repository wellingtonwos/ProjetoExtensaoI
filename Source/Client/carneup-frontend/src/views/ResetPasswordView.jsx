import styled from 'styled-components'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

const ViewTitle = styled.h2`
	font-size: 30px;
	font-weight: 400;
	margin-bottom: 35px;
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

export const ResetPasswordView = ({ navigate }) => {
	return (
		<>
			<ViewTitle>Cria sua nova senha</ViewTitle>
			<FormContainer>
				<Input type='password' placeholder='Nova senha' />
				<Input type='password' placeholder='Repita a senha' />
			</FormContainer>
			<Button onClick={() => navigate('success')}>Salvar senha</Button>
		</>
	)
}
