import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
	max-width: 450px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  padding: 14px 16px;
  color: #FFF;
  font-size: 14px;
  outline: none;
	display: flex;
  transition: border 0.3s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    border-color: #FFF;
  }


`;

export const Input = (props) => {
  return <StyledInput {...props} />;
};