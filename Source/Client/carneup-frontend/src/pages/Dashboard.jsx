import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
	const navigate = useNavigate()

	return (
		<Container className='mt-4'>
			<div className='text-center mb-5'>
				<h3 className='fw-bold'>Bem vindo ao CarneUp</h3>
				<p className='text-muted'>Selecione uma das opções abaixo:</p>
			</div>
			
			<Row className='g-4'>
				<Col md={6} lg={3}>
					<Card 
						className='h-100 shadow-sm hover-card' 
						role='button'
						onClick={() => navigate('/stock')}
					>
						<Card.Body className='d-flex flex-column text-center p-4'>
							<div className='mb-3'>
								<div className='dashboard-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3' 
									style={{width: '60px', height: '60px'}}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
										<path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.6 0 1-.4 1-1s-.4-1-1-1h-1V4c0-1.1-.9-2-2-2H6C4.9 2 4 2.9 4 4v7H3c-.6 0-1 .4-1 1s.4 1 1 1zM6 4h12v7H6V4z"/>
									</svg>
								</div>
							</div>
							<Card.Title className='h5'>Gerenciamento de Estoque</Card.Title>
							<Card.Text className='text-muted flex-grow-1'>
								Registre e controle produtos e compras
							</Card.Text>
							<small className='text-primary fw-bold mt-2'>Acessar →</small>
						</Card.Body>
					</Card>
				</Col>
				
				<Col md={6} lg={3}>
					<Card 
						className='h-100 shadow-sm hover-card' 
						role='button'
						onClick={() => navigate('/sales')}
					>
						<Card.Body className='d-flex flex-column text-center p-4'>
							<div className='mb-3'>
								<div className='dashboard-icon bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3' 
									style={{width: '60px', height: '60px'}}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
										<path d="M2 2h2v2H2V2zm4 0h2v2H6V2zm2 2h2v2H8V4zm2-2h2v2h-2V2zm2 2h2v2h-2V4zm2-2h2v2h-2V2zm2 2h2v2h-2V4zm2-2h2v2h-2V2zm2 2h2v2h-2V4zm0 2h2v12H2V6h2v10h16V6h2V4h-2V2h2c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h2v2H2v2z"/>
									</svg>
								</div>
							</div>
							<Card.Title className='h5'>Vendas</Card.Title>
							<Card.Text className='text-muted flex-grow-1'>
								Abra o sistema de vendas
							</Card.Text>
							<small className='text-success fw-bold mt-2'>Acessar →</small>
						</Card.Body>
					</Card>
				</Col>
				
				<Col md={6} lg={3}>
					<Card 
						className='h-100 shadow-sm hover-card' 
						role='button'
						onClick={() => navigate('/reports')}
					>
						<Card.Body className='d-flex flex-column text-center p-4'>
							<div className='mb-3'>
								<div className='dashboard-icon bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3' 
									style={{width: '60px', height: '60px'}}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
										<path d="M16 11h2v2h-2v-2zm-4 0h2v2h-2v-2zm-4 0h2v2H8v-2zm8-6h2v2h-2V5zm-4 0h2v2h-2V5zm-4 0h2v2H8V5zm8 12h2v2h-2v-2zm-4 0h2v2h-2v-2zm-4 0h2v2H8v-2zM4 5h2v2H4V5zm0 6h2v2H4v-2zm0 6h2v2H4v-2z"/>
									</svg>
								</div>
							</div>
							<Card.Title className='h5'>Relatórios</Card.Title>
							<Card.Text className='text-muted flex-grow-1'>
								Veja os relatórios e histórico das vendas realizadas
							</Card.Text>
							<small className='text-info fw-bold mt-2'>Acessar →</small>
						</Card.Body>
					</Card>
				</Col>
				
				<Col md={6} lg={3}>
					<Card 
						className='h-100 shadow-sm' 
						role='button'
						onClick={() => {/* manter desabilitado por enquanto */}}
					>
						<Card.Body className='d-flex flex-column text-center p-4'>
							<div className='mb-3'>
								<div className='dashboard-icon bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3' 
									style={{width: '60px', height: '60px'}}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
										<path d="M19 14v3h3v2h-3v3h-2v-3h-3v-2h3v-3h2zm-9 2c0-.4.1-.8.3-1.1l-3.8-3.8c-.3.2-.7.3-1.1.3-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2c0 .4-.1.8-.3 1.1l3.8 3.8c.3-.2.7-.3 1.1-.3 1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2z"/>
									</svg>
								</div>
							</div>
							<Card.Title className='h5'>Configurações</Card.Title>
							<Card.Text className='text-muted flex-grow-1'>
								Configurações de sistema e usuários
							</Card.Text>
							<small className='text-muted mt-2'>Em breve</small>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Adicione este estilo no seu CSS global ou no componente */}
			<style>
				{`
					.hover-card {
						transition: all 0.3s ease;
						cursor: pointer;
					}
					.hover-card:hover {
						transform: translateY(-5px);
						box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
					}
					.dashboard-icon {
						transition: all 0.3s ease;
					}
					.hover-card:hover .dashboard-icon {
						transform: scale(1.1);
					}
				`}
			</style>
		</Container>
	)
}