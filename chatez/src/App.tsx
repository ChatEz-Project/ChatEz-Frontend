import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/Login/login';
import SignUp from './pages/SignUp/SignUp';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import ChatPage from './pages/Chats/chats';
import { useAuth } from './contexts/authContext';
import { ChatProvider } from './contexts/chatContext';

function App() {
  const { userLoggedIn } = useAuth();

  return (
    <div className="App">
      <Router>
        {!userLoggedIn ? <Redirect to="/" /> : null}
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/SignUp" component={SignUp} />
          {userLoggedIn && (
            <Route
              exact
              path="/chats"
              component={() => (
                <ChatProvider>
                  <ChatPage />
                </ChatProvider>
              )}
            />
          )}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
