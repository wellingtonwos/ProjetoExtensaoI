import React from 'react';
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
					<Navbar.Brand>CarneUp</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle />
				<Navbar.Collapse className='justify-content-end'>
					<Nav className='me-auto'>
						{token ? (
							<>
								<LinkContainer to='/stock'>
									<Nav.Link>Stock</Nav.Link>
								</LinkContainer>
								<LinkContainer to='/sales'>
									<Nav.Link>Sales</Nav.Link>
								</LinkContainer>
								<LinkContainer to='/reports'>
									<Nav.Link>Reports</Nav.Link>
								</LinkContainer>
							</>
						) : null}
					</Nav>
					{token ? (
						<Button variant='outline-light' onClick={handleLogout}>
							Logout
						</Button>
					) : null}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
