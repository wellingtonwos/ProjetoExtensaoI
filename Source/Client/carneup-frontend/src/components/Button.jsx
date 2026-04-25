import styled from 'styled-components'

const StyledButton = styled.button`
	width: 100%;
	max-width: 300px;
	max-height: 50px;
	margin-top: 32px;
	display: flex;
	justify-content: center;
	align-self: center;
	border: none;
	border-radius: 15px;
	background: #fff;
	color: #000;
	font-size: 24px;
	font-weight: 800;
	cursor: pointer;
	opacity: ${(props) => (props.disabled ? 0.6 : 1)};
	pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`

export const Button = ({ children, onClick, disabled = false }) => {
	return (
		<StyledButton onClick={onClick} disabled={disabled}>
			{children}
		</StyledButton>
	)
}
