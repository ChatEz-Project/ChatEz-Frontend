import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/Login/login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/Chats/chats';
import { useAuth } from './contexts/authContext';

function App() {
  const { userLoggedIn } = useAuth();

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          {userLoggedIn && <Route exact path="/home" component={HomePage} />}

          {/* 
            TODO: 
              - Logout page
              - Chat page
              - SignUp page
          */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
