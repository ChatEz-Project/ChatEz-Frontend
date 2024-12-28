import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/Login/login';
import SignUp from './pages/SignUp/SignUp';
import Settings from './pages/Settings/Settings'
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
    <div className="App" style={{ color: "var(--background-color2)" }}>
      <Router>
        {!userLoggedIn ? <Redirect to="/" /> : null}
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/SignUp" component={SignUp} />
          <Route exact path="/Settings" component={Settings} />
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
