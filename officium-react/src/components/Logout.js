import React from 'react';
import firebase from 'firebase/app';

class Logout extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidMount(){
    var that = this;
    firebase.auth().signOut()
      .then(function() {
          this.reDirect();
      })
      .catch(function(error) {
        that.setState({
          loading: false
        });
      });
  }

  reDirect = () => {
    this.props.history.push('/');
  }

  render() {
    if (this.state.loading) {
      return <p>Logging out...</p>;
    }
    else {
      return <p>There was an error logging you out.</p>;
    }
  }
}
export default (Logout);
