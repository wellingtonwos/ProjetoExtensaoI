import styled from 'styled-components'
import { Button } from '../components/Button'

const ViewTitle = styled.h2`
	font-size: 30px;
	font-weight: 400;
	margin-bottom: 88px;
	text-align: center;
	color: #fff;
`

export const SuccessView = ({ navigate }) => {
	return (
		<>
			<ViewTitle>Senha salva com sucesso!</ViewTitle>
			<Button onClick={() => navigate('login')}>Fazer Login</Button>
		</>
	)
}
