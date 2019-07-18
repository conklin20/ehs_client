import React from 'react';
import {Provider} from 'react-redux'; 
import {configureStore} from '../../store'; 
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import Main from './Main';
import { setAuthorizationToken, setCurrentUser } from '../../store/actions/auth';
import jwtDecode from 'jwt-decode'; 

const store = configureStore();

if (sessionStorage.jwtToken) {
  setAuthorizationToken(sessionStorage.jwtToken);
  // prevent someone from manually tampering with the key of jwtToken in sessionStorage
  try {    
    store.dispatch(setCurrentUser(jwtDecode(sessionStorage.jwtToken)));
  } catch(err) {
    //force logout
    store.dispatch(setCurrentUser({}));
  }
}

const App = () => (
  <Provider store={store}>
    <Router>
        <Navbar />
        <Main />
    </Router>    
  </Provider>
)

export default App;
