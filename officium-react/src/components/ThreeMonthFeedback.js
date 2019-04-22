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
import Slider from '@material-ui/lab/Slider';
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
    slider: {
        margin: 'auto',
        marginBottom: 10,
        padding: 20,
        width: 300,
        textAlign: 'center',
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ThreeMonthFeedbackBase extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        openThanks: false,
        reason: "",
        comments: '',
        usefulfeature: '',
        suggestedfeature: '',
        recommend: "",
        rating: 3,
      };
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    };

    handleRatingChange = (event, sliderValue) => {
        this.setState({
            rating: sliderValue,
        });
    };

    handleClickOpenThanks = () => {
        this.setState({ openThanks: true });

        var user = firebase.auth().currentUser;
        let db = firebase.firestore();
        db.collection('Reports').doc(user.uid).collection("General").add({
          reason: this.state.reason,
          comments: this.state.comments,
          usefulfeature: this.state.usefulfeature,
          suggestedfeature: this.state.suggestedfeature,
          recommend: this.state.recommend,
          rating: this.state.rating,
        }).then(() => {

        }).catch({

        })
    };

    handleCloseThanks = () => {
        this.setState({ openThanks: false });
        this.props.history.push('/home');
    }

    render() {
        return (
            <div className={this.props.classes.container}>
            <Typography variant="h3" color="secondary" style={{ marginTop: '100px', marginBottom: '30px' }}>General Feedback</Typography>
            <Paper className={this.props.classes.paper}>
            <Typography variant="h5">How would you rate Officium thus far?</Typography>
            <Slider className={this.props.classes.slider}
                value={this.state.rating}
                min={1}
                max={5}
                step={1}
                onChange={this.handleRatingChange}
              />
            <Typography variant="h5">What has been the most useful feature?</Typography>
            <TextField
                id="usefulfeature"
                style={{ margin: 'theme.spacing.unit' }}
                onChange={ this.handleChange('usefulfeature') }
                placeholder="Feature"
                fullWidth
                multiline
                margin="normal"
                variant="outlined"
              />
            <Typography variant="h5">Do you have any suggestions for any new features?</Typography>
            <TextField
                id="suggestedfeature"
                style={{ margin: 'theme.spacing.unit' }}
                onChange={ this.handleChange('suggestedfeature') }
                placeholder="Suggestion"
                fullWidth
                multiline
                margin="normal"
                variant="outlined"
              />
            <Typography variant="h5">Would you recommend Officium to a friend?</Typography>
            <FormControl style={{ margin: 20, minWidth: 200 }}>
                <InputLabel>Recommend?</InputLabel>
                    <Select
                        value={this.state.recommend}
                        onChange={ this.handleChange('recommend') }
                        name="recommend"
                        style={{ marginTop: 20 }}
                    >
                    <MenuItem value="NoLongerUse">Yes!</MenuItem>
                    <MenuItem value="NotUseful">Nope.</MenuItem>
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
                  {"Wow, you rock"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    Thanks for taking the time to give us some feedback!
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
const ThreeMonthFeedback = compose(
    withRouter,
    withFirebase,
  )(ThreeMonthFeedbackBase);

export default withStyles(styles)(ThreeMonthFeedback);