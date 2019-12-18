import React  from 'react';
import {Provider} from 'react-redux'; 
import {configureStore} from '../../store'; 
// import { BrowserRouter as Router } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import history from '../../services/history'; 
import Routes from './Routes'; 
import { setAuthorizationToken, setCurrentUser } from '../../store/actions/auth';
import jwtDecode from 'jwt-decode'; 
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const store = configureStore();

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#718792',
			main: '#455a64',
			dark: '#1c313a',
			contrastText: '#fff',
		},
		secondary: {
			light: '#ffa040',
			main: '#ff6f00',
			dark: '#c43e00',
			contrastText: '#000',
		},
		grey: {
			50: "#fafafa",
			100: "#f5f5f5",
			200: "#eeeeee",
			300: "#e0e0e0",
			400: "#bdbdbd",
			500: "#9e9e9e",
			600: "#757575",
			700: "#616161",
			800: "#424242",
			900: "#212121",
			A100: "#d5d5d5",
			A200: "#aaaaaa",
			A400: "#303030",
			A700: "#616161",
		}
	},
});

if (localStorage.jwtToken) {
	//using localStorage now instead of sessionStorage because session breaks opening a new tab/window (a new session is created).
	//need to confirm security around saving jwt tokens in localStorage
	console.log(localStorage.jwtToken)
	setAuthorizationToken(localStorage.jwtToken);
	// prevent someone from manually tampering with the key of jwtToken in localStorage
	try {    
		// console.log(localStorage.jwtToken)
		store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
	} catch(err) {
		//force logout
		store.dispatch(setCurrentUser({}));
	}
}

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
		<HashRouter history={history}>
			<Routes />
      	</HashRouter>
    </ThemeProvider> 
  </Provider>
)

export default App;
