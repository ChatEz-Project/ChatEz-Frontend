import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage/login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/ChatsPage/chats';
import { useAuth } from './contexts/authContext';

function App() {
  const { userLoggedIn } = useAuth();
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:8080/addFriend/bobber@gmail.com'
  //       );
  //       setData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  // console.log(data);

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
