import React from 'react';
import { BrowserRouter, Switch} from 'react-router-dom'
import { Link as RouterLink, Route } from 'react-router-dom'
import Link from '@material-ui/core/Link';
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Logout from './components/Logout'
import SignUp from './components/Signup'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import logo from './img/white_logo.png';
import firebase from 'firebase/app';
import 'firebase/auth';
import PrivateRoute from './components/routing/PrivateRoute'
import LoggedInRoute from './components/routing/LoggedInRoute'
import Home from './components/Home'
import Profile from './components/Profile'
import JobMap from './components/JobMap'
import SignedInLinks from './components/routing/SignedInLinks'
import SignedOutLinks from './components/routing/SignedOutLinks'
import JobWizard from './components/JobWizard'
import JobDetails from './components/JobDetails'
import NotFound from './components/NotFound'
import BugReport from './components/BugReport'
import DeleteFeedback from './components/DeleteFeedback'
import Visual from './components/Visual'
import JobCompare from './components/JobCompare'
import ThreeMonthFeedback from './components/ThreeMonthFeedback';

const styles = theme => ({
  logo: {
    color: 'white',
    'max-width': '100px',
    'max-height': '100px',
    margin: theme.spacing.unit,
    display: 'block',
  },
  links: {
    margin: '0 auto',
    'text-align': 'right',
    flexGrow: 1,
  }
});

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
  }

  componentWillMount(){
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          that.setState({
            authenticated: true,
            currentUser: user,
            loading: false
          });
        }
        else {
          that.setState({
            authenticated: false,
            currentUser: null,
            loading: false
          });
        }
    });
  }
  render() {

    if (this.state.loading) {
      return <p></p>;
    }
    return (
      <BrowserRouter>
        <div className="App">
          <AppBar color="primary">
            <Toolbar>
              <Link component={RouterLink} to='/'>
                <img className={this.props.classes.logo} src={logo} alt="Officium" />
              </Link>
              <div className={this.props.classes.links}>
                {this.state.authenticated ? <SignedInLinks/> : <SignedOutLinks/>}
              </div>
            </Toolbar>
          </AppBar>
          <Switch>
          <PrivateRoute exact
            path="/home"
            component={Home}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path="/home/:jobid"
            component={Home}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path="/compare"
            component={JobCompare}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path="/logout"
            component={Logout}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path="/profile"
            component={Profile}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path="/jobmap"
            component={JobMap}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path="/visual"
            component={Visual}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path="/bugreport"
            component={BugReport}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path="/deletefeedback"
            component={DeleteFeedback}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path="/threemonthfeedback"
            component={ThreeMonthFeedback}
            authenticated={this.state.authenticated}
          />

          <LoggedInRoute Route exact
            path={"/"}
            component={LandingPage}
            authenticated={this.state.authenticated}
          />
          <Route exact
            path={"/login"}
            component={() => <Login auth={this.state.authenticated} />}
          />
          <Route exact
            path={"/signup"}
            component={() => <SignUp auth={this.state.authenticated} />}
          />
           <PrivateRoute exact
            path={"/jobs/new"}
            component={JobWizard}
            authenticated={this.state.authenticated}
          />
          <PrivateRoute exact
            path={"/jobs/edit/:id"}
            component={JobWizard}
            authenticated={this.state.authenticated}
            edit={true}
          />
          <PrivateRoute exact
            path={"/jobs/details/:id"}
            component={JobDetails}
            authenticated={this.state.authenticated}
          />

          <Route path="" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);
