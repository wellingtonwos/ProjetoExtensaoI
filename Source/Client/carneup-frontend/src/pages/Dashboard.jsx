import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
	const navigate = useNavigate()

	return (
		<Container className='mt-4'>
			<h3>Welcome to CarneUp</h3>
			<p>Select an action below:</p>
			<Row className='g-3 mt-2'>
				<Col md={3}>
					<Card className='h-100'>
						<Card.Body className='d-flex flex-column'>
							<Card.Title>Stock Management</Card.Title>
							<Card.Text>Register and manage products and purchases.</Card.Text>
							<div className='mt-auto'>
								<Button onClick={() => navigate('/stock')}>Open</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className='h-100'>
						<Card.Body className='d-flex flex-column'>
							<Card.Title>Sales (POS)</Card.Title>
							<Card.Text>
								Open the point of sale to record sales quickly.
							</Card.Text>
							<div className='mt-auto'>
								<Button onClick={() => navigate('/sales')}>Open</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className='h-100'>
						<Card.Body className='d-flex flex-column'>
							<Card.Title>Reports</Card.Title>
							<Card.Text>View sales and stock reports.</Card.Text>
							<div className='mt-auto'>
								<Button onClick={() => navigate('/reports')}>Open</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className='h-100'>
						<Card.Body className='d-flex flex-column'>
							<Card.Title>Settings</Card.Title>
							<Card.Text>Basic system settings and users.</Card.Text>
							<div className='mt-auto'>
								<Button disabled>Open</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}
