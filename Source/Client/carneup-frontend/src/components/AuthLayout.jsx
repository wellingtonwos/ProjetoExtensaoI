import styled from 'styled-components'

const BackgroundWrapper = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-image: url('/public/login_background_image.jpeg');
	background-size: cover;
	background-position: center;
`

const GlassBox = styled.div`
	background: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 24px;
	justify-content: center;
	width: 100%;
	max-width: 500px;
	min-height: 700px;
	display: flex;
	flex-direction: column;
`

const LogoTitle = styled.h1`
	font-size: 70px;
	font-weight: 400;
	text-align: center;
	color: #fff;
	letter-spacing: 2px;
	margin-bottom: 65px;
	text-transform: uppercase;
`

export const AuthLayout = ({ children }) => {
	return (
		<BackgroundWrapper>
			<GlassBox>
				<LogoTitle>Carne Up</LogoTitle>
				{children}
			</GlassBox>
		</BackgroundWrapper>
	)
}
