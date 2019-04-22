import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';


// Instructions on implementing Firebase
// https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
import Firebase, { FirebaseContext } from './components/Firebase';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#2A7FFF',
    },
    error: red,
  },
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <FirebaseContext.Provider value={new Firebase()}>
          <App />
      </FirebaseContext.Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
