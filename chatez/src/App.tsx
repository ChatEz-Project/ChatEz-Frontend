import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/Login/login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import HomePage from './pages/chats';
import { useAuth } from './contexts/authContext';

function App() {
  const { userLoggedIn } = useAuth();

  return (
    <div className="App">
      <Router>
        {!userLoggedIn ? <Redirect to="/" /> : null}
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
