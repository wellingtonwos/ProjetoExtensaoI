import React from 'react'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export default function TopNavbar() {
	const token =
		typeof window !== 'undefined' ? localStorage.getItem('token') : null

	function handleLogout() {
		localStorage.removeItem('token')
		window.location.href = '/login'
	}

	return (
		<Navbar bg='dark' variant='dark' expand='lg'>
			<Container>
				<LinkContainer to='/'>
					<Navbar.Brand>Junior Prime Beef</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle />
				<Navbar.Collapse className='justify-content-end'>
					<Nav className='me-auto'>
						{token ? (
							<>
								<LinkContainer to='/stock'>
									<Nav.Link>Estoque</Nav.Link>
								</LinkContainer>
								<LinkContainer to='/sales'>
									<Nav.Link>Vendas</Nav.Link>
								</LinkContainer>
								<LinkContainer to='/reports'>
									<Nav.Link>Relatórios</Nav.Link>
								</LinkContainer>
								<LinkContainer to='/suppliers'>
									<Nav.Link>Fornecedores</Nav.Link>
								</LinkContainer>
							</>
						) : null}
					</Nav>
					{token ? (
						<Button variant='outline-light' onClick={handleLogout}>
							Sair
						</Button>
					) : null}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
