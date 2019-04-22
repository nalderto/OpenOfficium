import React from 'react';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import 'firebase/auth';
import { GoogleLoginButton } from "react-social-login-buttons";
import { TwitterLoginButton } from "react-social-login-buttons";
import { GithubLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";
import AlertDialog from "./Profile";

class UnlinkFacebookBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      innerText: "Unlink from Facebook"
    };
  }

  onSubmit = event => {
    this.setState({
      innerText: "Unlinking..."
    });
    this.props.firebase
      .doUnlinkFromFacebook()
      .then(() => {
        this.setState({ error: null });
        this.props.removeFacebook();
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
    return false;
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} >
          <FacebookLoginButton size={'40px'}>
            <span>{this.state.innerText}</span>
          </FacebookLoginButton>
        </button>

        {error && <AlertDialog errorMessage={error.message} service={"Facebook"} />}
      </form>
    );
  }
}
class UnlinkGoogleBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      error: null,
      innerText: "Unlink from Google"
    };
  }

  onSubmit = event => {
    this.setState({
      innerText: "Unlinking..."
    });
    this.props.firebase
      .doUnlinkFromGoogle()
      .then(() => {
        this.setState({ error: null });
        this.props.removeGoogle();
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
    return false;
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} >
          <GoogleLoginButton size={'40px'}>
            <span>{this.state.innerText}</span>
          </GoogleLoginButton>
        </button>

        {error && <AlertDialog errorMessage={error.message} service={"Google"} />}
      </form>
    );
  }
}

class UnlinkTwitterBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      innerText: "Unlink from Twitter"
    };
  }

  onSubmit = event => {
    this.setState({
      innerText: "Unlinking..."
    });
    this.props.firebase
      .doUnlinkFromTwitter()
      .then(() => {
        this.setState({ error: null });
        this.props.removeTwitter();
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
    return false;
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} >
          <TwitterLoginButton size={'40px'}>
            <span>{this.state.innerText}</span>
          </TwitterLoginButton>
        </button>

        {error && <AlertDialog errorMessage={error.message} service={"Twitter"} />}
      </form>
    );
  }
}
class UnlinkGithubBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      innerText: "Unlink from Github"
    };
  }

  onSubmit = event => {
    this.setState({
      innerText: "Unlinking..."
    });
    this.props.firebase
      .doUnlinkFromGithub()
      .then(() => {
        this.setState({ error: null });
        this.props.removeGithub();
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
    return false;
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} >
          <GithubLoginButton size={'40px'}>
            <span>{this.state.innerText}</span>
          </GithubLoginButton>
        </button>

        {error && <AlertDialog errorMessage={error.message} service={"GitHub"} />}
      </form>
    );
  }
}


const UnlinkGoogle = compose(
  withRouter,
  withFirebase,
)(UnlinkGoogleBase);
const UnlinkTwitter = compose(
  withRouter,
  withFirebase,
)(UnlinkTwitterBase);
const UnlinkGithub = compose(
  withRouter,
  withFirebase,
)(UnlinkGithubBase);
const UnlinkFacebook = compose(
  withRouter,
  withFirebase,
)(UnlinkFacebookBase);

export { UnlinkGoogle, UnlinkTwitter, UnlinkGithub, UnlinkFacebook }
