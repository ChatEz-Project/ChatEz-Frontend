import React from 'react';
import TextInput from './TextInput';
import LoginButton from './LoginButton';
import SignUpLink from './SignUpLink';

const LoginForm: React.FC = () => {
  return (
    <form>
      <TextInput label="Email" type="email" />
      <TextInput label="Password" type="password" />
      <LoginButton />
      <SignUpLink />
    </form>
  );
};

export default LoginForm;
