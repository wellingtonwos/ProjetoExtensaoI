import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
	const navigate = useNavigate()

	return (
		<Container className='mt-4'>
			<h3>Bem vindo ao CarneUp</h3>
			<p>Selecione uma das opções abaixo:</p>
			<Row className='g-3 mt-2'>
				<Col md={3}>
					<Card className='h-100'>
						<Card.Body className='d-flex flex-column'>
							<Card.Title>Gerenciamento de estoque</Card.Title>
							<Card.Text>Registre e controle produtos e compras.</Card.Text>
							<div className='mt-auto'>
								<Button onClick={() => navigate('/stock')}>Abrir</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className='h-100'>
						<Card.Body className='d-flex flex-column'>
							<Card.Title>Vendas</Card.Title>
							<Card.Text>Abra o sistema de vendas</Card.Text>
							<div className='mt-auto'>
								<Button onClick={() => navigate('/sales')}>Abrir</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className='h-100'>
						<Card.Body className='d-flex flex-column'>
							<Card.Title>Relatórios</Card.Title>
							<Card.Text>
								Veja os relatórios/histórico das vendas realizadas
							</Card.Text>
							<div className='mt-auto'>
								<Button onClick={() => navigate('/reports')}>Abrir</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className='h-100'>
						<Card.Body className='d-flex flex-column'>
							<Card.Title>Configurações</Card.Title>
							<Card.Text>Configurações de sistema e usuários</Card.Text>
							<div className='mt-auto'>
								<Button disabled>Abrir</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}
