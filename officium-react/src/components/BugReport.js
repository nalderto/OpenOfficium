import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField/';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const styles = theme => ({
  container: {
    // width: '80%',
    textAlign: 'center',
    marginTop: '100px !important',
    margin: 'auto',
  },
  button: {
    marginTop: '20px',
    margin: theme.spacing.unit,
    position: 'relative',
  },
  paper: {
    backgroundColor: '#edf3ff',
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    margin: 'auto',
    'max-width': 500,
    'max-height': '90%',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class BugReportBase extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          openThanks: false,
          page: '',
          description: '',
        };
      }

      handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };

      handleClickOpenThanks = () => {
        this.setState({ openThanks: true });

        var user = firebase.auth().currentUser;
        let db = firebase.firestore();
        db.collection('Reports').doc(user.uid).collection("Bugs").add({
          pg: this.state.page,
          desc: this.state.description,
        }).then(() => {

        }).catch({

        })
      };

      handleCloseThanks = () => {
        this.setState({ openThanks: false });
        this.props.history.push('/profile');
      }

      render() {
        return (
            <div className={this.props.classes.container}>
              <Typography variant="h3" color="secondary" style={{ marginTop: '100px', marginBottom: '30px' }}>Report a Bug</Typography>
              <Paper className={this.props.classes.paper}>
                <Typography variant="h5">What page did you see the bug on?</Typography>
                <TextField
                  id="page"
                  style={{ margin: 'theme.spacing.unit' }}
                  onChange={ this.handleChange('page') }
                  placeholder="Page"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Typography variant="h5">Please describe the bug you encountered.</Typography>
                <TextField
                  id="description"
                  style={{ margin: 'theme.spacing.unit' }}
                  onChange={ this.handleChange('description') }
                  placeholder="Description"
                  fullWidth
                  multiline
                  margin="normal"
                  variant="outlined"
                />
              </Paper>
              <Button className={this.props.classes.button} onClick={this.handleClickOpenThanks} variant="contained" color="primary">Submit</Button>
              <div>
                <Dialog
                  open={this.state.openThanks}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={this.handleCloseThanks}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle id="alert-dialog-slide-title">
                    {"Thanks!"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      Thanks for taking the time to let us know the bug you found!
                        </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleCloseThanks} style={{margin:'auto'}} color="primary">
                      Cool!
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
        );
    }
}
const BugReport = compose(
    withRouter,
    withFirebase,
  )(BugReportBase);

export default withStyles(styles)(BugReport);
