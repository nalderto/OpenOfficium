import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import firebase from 'firebase/app';
import { withRouter } from 'react-router-dom';
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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    container: {
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

class DeleteFeedbackBase extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        openThanks: false,
        reason: "",
        comments: '',
      };
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    };

    handleClickOpenThanks = () => {
        this.setState({ openThanks: true });

        let db = firebase.firestore();
        db.collection('DeletedFeedback').add({
          reason: this.state.reason,
          comments: this.state.comments,
        }).then(() => {
      
        }).catch({
        })
    };

    handleCloseThanks = () => {
        this.setState({ openThanks: false });
        this.props.history.push('/logout');
    }

    render() {
        return (
            <div className={this.props.classes.container}>
            <Typography variant="h3" color="secondary" style={{ marginTop: '100px', marginBottom: '30px' }}>Deletion Feedback</Typography>
            <Paper className={this.props.classes.paper}>
            <Typography variant="h5">What is the reason for deleting your Officium account?</Typography>
            <FormControl required style={{ margin: 20, minWidth: 300 }}>
                <InputLabel htmlFor="reason-required">Reason</InputLabel>
                    <Select
                        value={this.state.reason}
                        onChange={ this.handleChange('reason') }
                        name="reason"
                        inputProps={{
                          id: 'reason-required',
                        }}
                        style={{ marginTop: 20 }}
                    >
                    <MenuItem value="NoLongerUse">No longer use</MenuItem>
                    <MenuItem value="NotUseful">Not useful</MenuItem>
                    <MenuItem value="Buggy">Too many bugs</MenuItem>
                    <MenuItem value="NoReason">No reason</MenuItem>
                    <MenuItem value="Other"><em>Other</em></MenuItem>
                    </Select>
            </FormControl>
              <Typography variant="h5">Other comments:</Typography>
              <TextField
                id="comments"
                style={{ margin: 'theme.spacing.unit' }}
                onChange={ this.handleChange('comments') }
                placeholder="Comments"
                fullWidth
                multiline
                margin="normal"
                variant="outlined"
              />
            </Paper>
            <Button className={this.props.classes.button} onClick={() => this.handleClickOpenThanks()} variant="contained" color="primary">Submit</Button>
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
                  {"Sad to see you go"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    Thanks for taking the time to give us some feedback!
                    The Officium team wishes you luck on your future endeavors!
                      </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseThanks} style={{margin:'auto'}} color="primary">
                    Goodbye
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        );
    }
}
const DeleteFeedback = compose(
    withRouter,
    withFirebase,
  )(DeleteFeedbackBase);

export default withStyles(styles)(DeleteFeedback);