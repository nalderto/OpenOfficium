import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import firebase from 'firebase/app';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Chart from "react-google-charts";

const styles = theme => ({
  container: {
    textAlign: 'center',
    marginTop: '100px !important',
    margin: 'auto',
  },
});

class VisualBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      options: null,
      loaded: false,
    }
  }

  componentWillMount() {
    let user = firebase.auth().currentUser;
    let db = firebase.firestore();
    let data = [
      ["Online", "Pending", 0], // 0
      ["Email", "Pending", 0], // 1
      ["Phone", "Pending", 0], // 2
      ["In-Person", "Pending", 0], // 3
      ["Other", "Pending", 0], // 4
      ["Online", "Interview", 0], // 5
      ["Email", "Interview", 0], // 6
      ["Phone", "Interview", 0], // 7
      ["In-Person", "Interview", 0], // 8
      ["Other", "Interview", 0], // 9
      ["Online", "No Response", 0], // 10
      ["Email", "No Response", 0], // 11
      ["Phone", "No Response", 0], // 12
      ["In-Person", "No Response", 0], // 13
      ["Other", "No Response", 0], // 14
      ["Online", "Rejected", 0], // 15
      ["Email", "Rejected", 0], // 16
      ["Phone", "Rejected", 0], // 17
      ["In-Person", "Rejected", 0], // 18
      ["Other", "Rejected", 0], // 19
      ["Interview", "Rejected", 0], // 20
      ["Interview", "Offer", 0], // 21
      ["Offer", "Accepted", 0], // 22
      ["Offer", "Declined", 0], // 23
    ]
    db.collection('users').doc(user.uid).collection('jobs').get().then((doc) => {
      doc.forEach(job => {
        let applyMethod = job.get("HowApplied");
        let status = job.get("ApplicationStatus");
        let interview = job.get("HasInterviewed");
        switch (applyMethod) {
          case "Online":
            if (status === "Application Submitted") {
              data[0][2]++;
            }
            else if (status === "No Response") {
              data[10][2]++;
            }
            else if (status === "Rejected") {
              if (interview) {
                data[15][2]++;
                data[20][2]++;
              }
              else {
                data[15][2]++;
              }
            }
            else {
              data[5][2]++;
              data[21][2]++;
              if (status === "Denied Offer") {
                data[23][2]++;
              }
              else if (status === "Accepted Offer") {
                data[22][2]++;
              }
            }
            break;
          case "Email":
            if (status === "Application Submitted") {
              data[1][2]++;
            }
            else if (status === "No Response") {
              data[11][2]++;
            }
            else if (status === "Rejected") {
              if (interview) {
                data[16][2]++;
                data[20][2]++;
              }
              else {
                data[16][2]++;
              }
            }
            else {
              data[6][2]++;
              data[21][2]++;
              if (status === "Denied Offer") {
                data[23][2]++;
              }
              else if (status === "Accepted Offer") {
                data[22][2]++;
              }
            }
            break;
          case "Phone":
            if (status === "Application Submitted") {
              data[2][2]++;
            }
            else if (status === "No Response") {
              data[12][2]++;
            }
            else if (status === "Rejected") {
              if (interview) {
                data[17][2]++;
                data[20][2]++;
              }
              else {
                data[17][2]++;
              }
            }
            else {
              data[7][2]++;
              data[21][2]++;
              if (status === "Denied Offer") {
                data[23][2]++;
              }
              else if (status === "Accepted Offer") {
                data[22][2]++;
              }
            }

            break;
          case "In-Person":
            if (status === "Application Submitted") {
              data[3][2]++;
            }
            else if (status === "No Response") {
              data[13][2]++;
            }
            else if (status === "Rejected") {
              if (interview) {
                data[18][2]++;
                data[20][2]++;
              }
              else {
                data[18][2]++;
              }
            }
            else {
              data[8][2]++;
              data[21][2]++;
              if (status === "Denied Offer") {
                data[23][2]++;
              }
              else if (status === "Accepted Offer") {
                data[22][2]++;
              }
            }

            break;
          case "Other":
            if (status === "Application Submitted") {
              data[4][2]++;
            }
            else if (status === "No Response") {
              data[14][2]++;
            }
            else if (status === "Rejected") {
              if (interview) {
                data[19][2]++;
                data[20][2]++;
              }
              else {
                data[19][2]++;
              }
            }
            else {
              data[9][2]++;
              data[21][2]++;
              if (status === "Denied Offer") {
                data[23][2]++;
              }
              else if (status === "Accepted Offer") {
                data[22][2]++;
              }
            }

            break;
          default:
            break;
        }
      })
      let filteredData = [["From", "To", "Weight"]];
      for (let i = 1; i < data.length; i++) {
        if (data[i][2] !== 0) {
          filteredData.push(data[i]);
        }
      }
      this.setState({
        data: filteredData,
        options: {},
        loaded: true,
      })
    });

  }

  render() {
    if (this.state.loaded) {
      return (
        <div className={this.props.classes.container}>
          <Typography variant="h3" gutterBottom >Sankey Diagram</Typography>
          {this.state.data.length > 1 ? 
          <Chart
            chartType="Sankey"
            width="90%"
            height="600px"
            data={this.state.data}
            options={this.state.options}
            style={{margin: 'auto', paddingTop: '1%'}}
          /> :
          <Typography variant="h5" color="secondary" gutterBottom >No Job Data</Typography>}
        </div>
      );
    }
    else {
      return (
        <div className={this.props.classes.container}>
          <Typography variant="h3" gutterBottom >Sankey Diagram</Typography>
        </div>
      );
    }

  }
}
const Visual = compose(
  withRouter,
  withFirebase,
)(VisualBase);

export default withStyles(styles)(Visual);
