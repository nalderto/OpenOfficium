import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import Typography from '@material-ui/core/Typography';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const styles = theme => ({
  container: {
    // width: '80%',
    textAlign: 'center',
    marginTop: '100px !important',
    margin: 'auto',
  },
});

class JobMapBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: null,
      userPos: [0, 0],
      userLocation: "",
      mapMode: false,
      placedUser: false
    };
  }

  handleSwitch = event => {
    this.setState({mapMode: event.target.checked});
  };
  updateDimensions() {
    if (window.innerWidth < 900) {
      this.setState({
        optimismCheck: false,
        enthusiasmCheck: false,
        locationCheck: false,
        applicationCheck: false,
        distanceCheck: false
      })
    }
    else if (window.innerWidth > 900) {
      var user = firebase.auth().currentUser;
      var db = firebase.firestore();
      db.collection('users').doc(user.uid).get().then((doc) => {
        //Use bitstring system, a la Unix permissions, to store columns to show
          this.setState({
            userPos: [doc.data().Latitude, doc.data().Longitude],
            userLocation: doc.data().City
          });
      });
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();

    db.collection('users').doc(user.uid).collection('jobs').get().then((snapshot) => {
      this.setState({
        jobs: snapshot.docs,
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  handleYouClick = () => {
    this.props.history.push('/profile');
  }

  handleOpen = (id) => {
    this.props.history.push(`/jobs/details/${id}?from=jobmap`);
  }

  getRepeats = (loc, i) => {
    for(; i >= 0; i--){
      var job = this.state.jobs[i];
      if(job.data().Location === loc){
        return(
          <span>
            {this.getRepeats(job.data().Location, i-1)}
          {/* eslint-disable-next-line */}
            <span className={this.props.classes.companyName} style={{cursor:'pointer'}} onClick={event => this.handleOpen(job.id)}>
              {job.data().CompanyName}
              <br/>
            </span>
          </span>
        )
      }
    }
  }
  userUniqueLocation = () => {
    if(this.state.jobs === null){
      return true;
    }
    this.state.jobs.forEach((job) => {
      if(Math.abs(job.data().Latitude - this.state.userPos[0]) < 0.01 &&
         Math.abs(job.data().Longitude - this.state.userPos[1]) < 0.01 ){
        return false;
      }
    });
    return true;
  }

  render() {
    return (
      
      
        <div className={this.props.classes.container}>
          <Typography variant="h2" align="center" color="primary" style={{ margin: 40}}>Your Applications</Typography>
            <Map center={[39.833333, -98.5833333]} zoom={4} minZoom={4} maxBounds={[[15, -170], [75, -20]]}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {
                this.state.jobs ? (this.state.jobs.map((job, i) =>  {             
                  var atUser = 
                  Math.abs(job.data().Latitude - this.state.userPos[0]) < 0.01 &&
                  Math.abs(job.data().Longitude - this.state.userPos[1]) < 0.01;
                  return(
                    <Marker key={i} position={[job.data().Latitude, job.data().Longitude]}>
                      
                      <Popup>
                        {atUser && 
                                  <span style={{cursor:'pointer'}} onClick={this.handleYouClick}>
                                    You!
                                  <br/>
                                  </span>
                        }
                        {this.getRepeats(job.data().Location, i)} 
                      <br/>
                      {job.data().Location}
                      </Popup>
                    </Marker>
                  )
                })) : null 
              }
            {
              this.userUniqueLocation() &&
                <Marker position={[this.state.userPos[0], this.state.userPos[1]]}>
                  <Popup>
                    <span style={{cursor:'pointer'}} onClick={this.handleYouClick}>
                      You!
                    <br/>
                    </span>
                  </Popup>
                </Marker>
            }

            </Map>
        </div>
    );
  }
}
const JobMap = compose(
  withRouter,
  withFirebase,
)(JobMapBase);



export default withStyles(styles)(JobMap);
