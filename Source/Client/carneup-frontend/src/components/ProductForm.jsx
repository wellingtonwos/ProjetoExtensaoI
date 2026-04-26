import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from './Button'
import { Input } from './Input'

const FormContainer = styled.div`
	background-color: #ffffff;
	padding: 32px;
	border-radius: 4px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	border-top: 4px solid #610005;

	.form-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 24px;
		h3 {
			font-family: 'Epilogue', sans-serif;
			font-size: 20px;
			font-weight: 900;
			color: #610005;
			text-transform: uppercase;
			letter-spacing: -0.025em;
		}
		.icon {
			color: #610005;
		}
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 24px;

		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 24px;

			.full-width {
				grid-column: 1 / -1;
			}
		}

		.radio-group {
			display: flex;
			gap: 16px;
			label {
				display: flex;
				align-items: center;
				gap: 8px;
				cursor: pointer;
				font-size: 14px;
				font-weight: 600;
				color: #5a403c;
				text-transform: uppercase;
				letter-spacing: 0.05em;
			}
		}
	}
`

export const ProductForm = ({ onSubmit }) => {
	const [formData, setFormData] = useState({
		name: '',
		code: '',
		brand: '',
		category: '',
		unit: 'Kg',
		price: ''
	})

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit(formData)
	}

	return (
		<FormContainer>
			<div className='form-header'>
				<span className='material-symbols-outlined icon'>add_box</span>
				<h3>Cadastro de Novo Produto</h3>
			</div>

			<form onSubmit={handleSubmit}>
				<div className='form-grid'>
					<div className='full-width'>
						<Input
							label='Nome do Produto'
							name='name'
							value={formData.name}
							onChange={handleChange}
							placeholder='e.g. T-Bone Steak Premium'
							required
						/>
					</div>

					<Input
						label='Código'
						name='code'
						value={formData.code}
						onChange={handleChange}
						placeholder='CN-XXXX'
						required
					/>

					<Input
						label='Marca'
						name='brand'
						value={formData.brand}
						onChange={handleChange}
						placeholder='Heritage Farms'
						required
					/>

					<div>
						<label style={{
							fontSize: '10px',
							fontWeight: '700',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							color: '#5a403c',
							marginBottom: '8px',
							display: 'block'
						}}>
							Categoria
						</label>
						<select
							name='category'
							value={formData.category}
							onChange={handleChange}
							style={{
								width: '100%',
								padding: '12px',
								border: '1px solid #e7e5e4',
								borderRadius: '4px',
								fontFamily: 'Work Sans, sans-serif',
								fontSize: '14px',
								backgroundColor: '#ffffff'
							}}
							required
						>
							<option value=''>Selecionar Categoria</option>
							<option value='Bovine'>Bovine</option>
							<option value='Porcine'>Porcine</option>
							<option value='Poultry'>Poultry</option>
							<option value='Lamb'>Lamb</option>
							<option value='Processed'>Processed</option>
						</select>
					</div>

					<div>
						<label style={{
							fontSize: '10px',
							fontWeight: '700',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							color: '#5a403c',
							marginBottom: '8px',
							display: 'block'
						}}>
							Unidade de Medida
						</label>
						<div className='radio-group'>
							<label>
								<input
									type='radio'
									name='unit'
									value='Kg'
									checked={formData.unit === 'Kg'}
									onChange={handleChange}
								/>
								Kg
							</label>
							<label>
								<input
									type='radio'
									name='unit'
									value='Un'
									checked={formData.unit === 'Un'}
									onChange={handleChange}
								/>
								Un
							</label>
						</div>
					</div>

					<div className='full-width'>
						<Input
							label='Preço Base de Venda (R$)'
							name='price'
							type='number'
							value={formData.price}
							onChange={handleChange}
							placeholder='0.00'
							step='0.01'
							required
						/>
					</div>
				</div>

				<Button type='submit' style={{ width: '100%', marginTop: '24px' }}>
					Salvar Produto
				</Button>
			</form>
		</FormContainer>
	)
}