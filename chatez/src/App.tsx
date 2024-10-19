import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage/login';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8080/addFriend/bobber@gmail.com'
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  console.log(data);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
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
