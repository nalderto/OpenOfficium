import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  link: {
    margin: theme.spacing.unit,
    color: 'white',
  },
});


class SignedOutLinks extends React.Component {

  render() {
      return (
        <div>
          <Link component={RouterLink} to='/signup' className={this.props.classes.link}>
          Sign Up
          </Link>
          <Link component={RouterLink} to='/login' className={this.props.classes.link}>
          Login
          </Link>
        </div>
      )
  }
}

export default withStyles(styles)(SignedOutLinks);
