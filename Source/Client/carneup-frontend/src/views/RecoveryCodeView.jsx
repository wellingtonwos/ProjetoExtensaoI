import styled from 'styled-components'
import { Button } from '../components/Button'

const ViewTitle = styled.h2`
	font-size: 30px;
	font-weight: 400;
	margin-bottom: 50px;
	text-align: center;
	color: #fff;
`

const PinContainer = styled.div`
	display: flex;
	justify-content: center;
	gap: 30px;
	margin-bottom: 16px;
`

const PinInput = styled.input`
	width: 45px;
	height: 50px;
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 15px;
	text-align: center;
	color: #fff;
	font-size: 18px;
	outline: none;

	&:focus {
		border-color: #fff;
	}
`

const ResendText = styled.div`
	font-size: 15px;
	text-align: center;
	color: rgba(255, 255, 255, 0.8);
	margin-top: 32px;
	font-weight: 600;
`

export const RecoveryCodeView = ({ navigate }) => {
	return (
		<>
			<ViewTitle>Digite o código recebido</ViewTitle>
			<PinContainer>
				{[1, 2, 3, 4, 5, 6].map((_, index) => (
					<PinInput key={index} type='text' maxLength='1' />
				))}
			</PinContainer>
			<ResendText>Reenviar em 01:00</ResendText>
			<Button onClick={() => navigate('reset')}>Criar senha</Button>
		</>
	)
}
