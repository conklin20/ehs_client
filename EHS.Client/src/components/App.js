import React from 'react';
import {Provider} from 'react-redux'; 
import {configureStore} from '../store'; 
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import Main from './Main';
import { setAuthorizationToken, setCurrentUser } from '../store/actions/auth';
import jwtDecode from 'jwt-decode'; 

const store = configureStore();

if(localStorage.jwtToken){
  setAuthorizationToken(localStorage.jwtToken); 
  //prevent someone from manually tampering with a key of jwtToken in localStorage
  try {
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
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
