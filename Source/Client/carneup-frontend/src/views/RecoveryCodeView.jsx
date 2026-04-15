import React, { useState, useRef } from 'react'
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
	const [code, setCode] = useState(['', '', '', '', '', ''])
	const inputRefs = useRef([])

	const handleChange = (index, value) => {
		if (value !== '' && !/^[a-zA-Z0-9]+$/.test(value)) return

		const upperValue = value.toUpperCase()

		const newCode = [...code]
		newCode[index] = upperValue
		setCode(newCode)

		if (upperValue !== '' && index < 5) {
			inputRefs.current[index + 1].focus()
		}
	}

	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace' && code[index] === '' && index > 0) {
			inputRefs.current[index - 1].focus()
		}
	}

	return (
		<>
			<ViewTitle>Digite o código recebido</ViewTitle>
			<PinContainer>
				{code.map((digit, index) => (
					<PinInput
						key={index}
						type='text'
						maxLength='1'
						value={digit}
						ref={(el) => (inputRefs.current[index] = el)}
						onChange={(e) => handleChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
					/>
				))}
			</PinContainer>
			<ResendText>Reenviar em 01:00</ResendText>
			<Button onClick={() => navigate('reset')}>Criar senha</Button>
		</>
	)
}
