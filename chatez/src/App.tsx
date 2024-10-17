import logo from './media/logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1>ChatEz</h1>
      <img src={logo} alt="chatEz" />
      <br />
      <Button variant="outline-primary">Button</Button>
    </div>
  );
}

export default App;
