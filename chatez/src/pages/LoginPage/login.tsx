import React from 'react';
import Container from '@mui/material/Container';
import LoginForm from './components/LoginForm';
import logo from '../../media/logo.svg';
import Logo from './components/Logo';

const LoginPage: React.FC = () => {
  return (
    <Container
      maxWidth="sm"
      className="d-flex flex-column align-items-center mt-5"
    >
      <Logo svgPath={logo} />
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
