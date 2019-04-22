import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import moment from 'moment';
import firebase from 'firebase/app';

const styles = theme => ({
    root: {
        backgroundColor: "grey",
        textAlign: 'center',
        marginTop: '100px',
        margin: 'auto',
        maxWidth: '75%',
        minWidth: '75%',
    },
    paperHeading: {
        margin: 15,
        position: "relative",
        top: 15,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 15
      },
    jobPanel: {
        padding: 30,
        margin: 30,
        backgroundColor: "#eae8ea",
    },
    label: {
        padding: 30,
        marginTop: 20,
        marginBottom: 20,
    },
    panes: {
        margin: '10px',
        textAlign: 'left',
    },
    item: {
        padding: theme.spacing.unit,
        marginBottom: 10,
        width: "80%",
        margin: "auto"
    },
});

class JobCompare extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = { 
            jobA: this.props.location.state.jobA,
            jobB: this.props.location.state.jobB,
            jobAid: this.props.location.state.jobAid,
            jobBid: this.props.location.state.jobBid,
        };
        
        if (!this.state.jobA || !this.state.jobB){
            this.props.history.push("/home");
        }
    }
    componentWillMount(){
        let db = firebase.firestore();
        var user = firebase.auth().currentUser;
        db.collection('users').doc(user.uid).get()
      .then(doc => {
        this.setState({
            profile: doc.data(),
        });
      });
    }
    
    getStars = (num) => {

        if (num === 1) {
          return (<div><Star/><StarBorder/><StarBorder/><StarBorder/><StarBorder/></div>);
        }
        else if (num === 2) {
          return (<div><Star/><Star/><StarBorder/><StarBorder/><StarBorder/></div>);
        }
        else if (num === 3) {
          return (<div><Star/><Star/><Star/><StarBorder/><StarBorder/></div>);
        }
        else if (num === 4) {
          return (<div><Star/><Star/><Star/><Star/><StarBorder/></div>);
        }
        else if (num === 5) {
          return (<div><Star/><Star/><Star/><Star/><Star/></div>);
        }
        else {
          return null;
        }
      }

    getColorFromStatus = (status) => {
        switch (status) {
            case ("Pending"): {
              return "#A0DFDA";
            }
            case ("No Response"): {
              return "#F3F08D";
            }
            case ("Rejected"): {
              return "#F28094";
            }
            case ("Denied Offer"): {
              return "#F6CA80";
            }
            case ("Accepted Offer"): {
              return "#80DC94";
            }
            case ("Received Offer"): {
                return "#80DC94";
              }
            default: 
              return null;
          }

    }

    getBackgroundColorFromComparison = (job, factor) => {
        switch (factor) {
            case ("Location"): {
                if (job === "a") {
                    if (this.state.jobA.Distance < this.state.jobB.Distance) return "#80DC94";
                    if (this.state.jobA.Distance === this.state.jobB.Distance) return "#F3F08D";
                    if (this.state.jobA.Distance > this.state.jobB.Distance) return "#F28094";
                }
                else {
                    if (this.state.jobB.Distance < this.state.jobA.Distance) return "#80DC94";
                    if (this.state.jobB.Distance === this.state.jobA.Distance) return "#F3F08D";
                    if (this.state.jobB.Distance > this.state.jobA.Distance) return "#F28094";
                }
                break;
            }
            case ("Enthusiasm"): {
                if (job === "a") {
                    if (this.state.jobA.Enthusiasm > this.state.jobB.Enthusiasm) return "#80DC94";
                    if (this.state.jobA.Enthusiasm === this.state.jobB.Enthusiasm) return "#F3F08D";
                    if (this.state.jobA.Enthusiasm < this.state.jobB.Enthusiasm) return "#F28094";
                }
                else {
                    if (this.state.jobB.Enthusiasm > this.state.jobA.Enthusiasm) return "#80DC94";
                    if (this.state.jobB.Enthusiasm === this.state.jobA.Enthusiasm) return "#F3F08D";
                    if (this.state.jobB.Enthusiasm < this.state.jobA.Enthusiasm) return "#F28094";
                }
                break;
            }
            case ("Optimism"): {
                if (job === "a") {
                    if (this.state.jobA.Optimism > this.state.jobB.Optimism) return "#80DC94";
                    if (this.state.jobA.Optimism === this.state.jobB.Optimism) return "#F3F08D";
                    if (this.state.jobA.Optimism < this.state.jobB.Optimism) return "#F28094";
                }
                else {
                    if (this.state.jobB.Optimism > this.state.jobA.Optimism) return "#80DC94";
                    if (this.state.jobB.Optimism === this.state.jobA.Optimism) return "#F3F08D";
                    if (this.state.jobB.Optimism < this.state.jobA.Optimism) return "#F28094";
                }
                break;
            }
            default: 
            return null;
        }
    }

    render(){

        let numbeoProfile = (
            null
        );

        if (this.state.profile) numbeoProfile = (
            <Paper className={this.props.classes.jobPanel}>  
                <Typography variant="h3" style={{margin:50}}>{this.state.profile.City}</Typography>

                {this.state.profile.numbeo_error ?
                <Typography variant="h5" color="secondary" style={{ marginLeft: '1vh', marginTop: 10 }}>
                    Error Retrieving City Information.
                </Typography>
                :
                null}
                <Paper className={this.props.classes.item}>


                {this.state.profile.numbeo_cpi_index ||
                this.state.profile.numbeo_rent_index ||
                this.state.profile.numbeo_cpi_and_rent_index ||
                this.state.profile.numbeo_purchasing_power_incl_rent_index ||
                this.state.profile.numbeo_restaurant_price_index ||
                this.state.profile.numbeo_groceries_index ||
                this.state.profile.numbeo_safety_index || 
                this.state.profile.numbeo_crime_index ||
                this.state.profile.numbeo_quality_of_life_index || 
                this.state.profile.numbeo_climate_index || 
                this.state.profile.numbeo_traffic_index ||
                this.state.profile.numbeo_pollution_index ||
                this.state.profile.numbeo_traffic_time_index ||
                this.state.profile.numbeo_traffic_co2_index ||
                this.state.profile.numbeo_traffic_inefficiency_index ||
                this.state.profile.numbeo_health_care_index 
                ?
                null
                :
                <Typography variant="h4" style={{ marginTop: 20}}>No Data Available</Typography>
                }

                {this.state.profile.numbeo_cpi_index ||
                this.state.profile.numbeo_rent_index ||
                this.state.profile.numbeo_cpi_and_rent_index ||
                this.state.profile.numbeo_purchasing_power_incl_rent_index ||
                this.state.profile.numbeo_restaurant_price_index ||
                this.state.profile.numbeo_groceries_index ?
                <div>
                <Typography variant="h4" style={{ marginTop: 20}}>Cost of Living</Typography>
                <Typography style={{ fontSize: 20, marginTop: 10 }}>*Indices are relative to New York City (NYC).</Typography>
                </div>
                : null}
                <Grid container direction="row" style={{ justifyContent: 'center' }}>                   
                    <Grid item className={this.props.classes.panes}>
                    {this.state.profile.numbeo_cpi_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                        CPI Index:
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_rent_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                        Rent:
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_cpi_and_rent_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                        CPI and Rent:
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_purchasing_power_incl_rent_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                        Purchasing Power:
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_restaurant_price_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                        Restaurant Price:
                        </Typography>
                        : ''}
                        {this.state.profile.numbeo_groceries_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                        Groceries:
                        </Typography>
                        : ''}
                    
                    </Grid>

                    <Grid item className={this.props.classes.panes}>
                    
                    {this.state.profile.numbeo_cpi_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                        {Math.round(this.state.profile.numbeo_cpi_index)}%
                </Typography>
                        : ''}
                    {this.state.profile.numbeo_rent_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                        {Math.round(this.state.profile.numbeo_rent_index)}%
                </Typography>
                        : ''}
                    {this.state.profile.numbeo_cpi_and_rent_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                        {Math.round(this.state.profile.numbeo_cpi_and_rent_index)}%
                </Typography>
                        : ''}
                    {this.state.profile.numbeo_purchasing_power_incl_rent_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                        {Math.round(this.state.profile.numbeo_purchasing_power_incl_rent_index)}%
                </Typography>
                        : ''}
                    {this.state.profile.numbeo_restaurant_price_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                        {Math.round(this.state.profile.numbeo_restaurant_price_index)}%
                </Typography>
                        : ''}
                        {this.state.profile.numbeo_groceries_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                        {Math.round(this.state.profile.numbeo_groceries_index)}%
                </Typography>
                        : ''}
                    </Grid>
                </Grid>

                {this.state.profile.numbeo_safety_index || this.state.profile.numbeo_crime_index ?
                <div>
                <Typography variant="h4" style={{ marginTop: 20}}>Crime and Safety</Typography>
                </div>
                : null}
                <Grid container direction="row" style={{ justifyContent: 'center' }}>
                    <Grid item className={this.props.classes.panes}>
                    {this.state.profile.numbeo_crime_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        Crime:
                        </Typography>
                        : ''}
                        {this.state.profile.numbeo_safety_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        Safety:
                        </Typography>
                        : ''}
                    </Grid>

                    <Grid item className={this.props.classes.panes}>
                    {this.state.profile.numbeo_crime_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>
                        {Math.round(this.state.profile.numbeo_crime_index)} / 100
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_safety_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>

                    {Math.round(this.state.profile.numbeo_safety_index)} / 100
                    </Typography>
                    : ''}
                    </Grid>
                </Grid>  
                
                {this.state.profile.numbeo_quality_of_life_index || 
                this.state.profile.numbeo_climate_index || 
                this.state.profile.numbeo_traffic_index ||
                this.state.profile.numbeo_pollution_index ||
                this.state.profile.numbeo_traffic_time_index ||
                this.state.profile.numbeo_traffic_co2_index ||
                this.state.profile.numbeo_traffic_inefficiency_index ||
                this.state.profile.numbeo_health_care_index ?
                <div>
                <Typography variant="h4" style={{ marginTop: 20, marginBottom: 10}}>Quality of Life</Typography>
                </div>
                : null }
                {this.state.profile.numbeo_quality_of_life_index || 
                this.state.profile.numbeo_climate_index || 
                this.state.profile.numbeo_health_care_index ?
                <span>(Higher is Better) </span>
                : null }
                <Grid container direction="row" style={{ justifyContent: 'center' }}>
                    <Grid item className={this.props.classes.panes}>
                    {this.state.profile.numbeo_quality_of_life_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        Quality of Life:
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_climate_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        Climate:
                        </Typography>
                        : ''}
                        {this.state.profile.numbeo_health_care_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        Health Care:
                        </Typography>
                        : ''}
                        </Grid>
                    <Grid item className={this.props.classes.panes}>
                    {this.state.profile.numbeo_quality_of_life_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>
                        {Math.round(this.state.profile.numbeo_quality_of_life_index)}
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_climate_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>
                        {Math.round(this.state.profile.numbeo_climate_index)}
                        </Typography>
                        : ''}
                        {this.state.profile.numbeo_health_care_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>
                        {Math.round(this.state.profile.numbeo_health_care_index)} / 100
                        </Typography>
                        : ''}
                    </Grid>

                    </Grid>
                    {this.state.profile.numbeo_traffic_index ||
                    this.state.profile.numbeo_pollution_index ||
                    this.state.profile.numbeo_traffic_time_index ||
                    this.state.profile.numbeo_traffic_co2_index ||
                    this.state.profile.numbeo_traffic_inefficiency_index ?
                    <span style={{marginTop:10}}>(Higher is Worse)</span>
                    : null}
                    <Grid container direction="row" style={{ justifyContent: 'center' }}>
                
                    <Grid item className={this.props.classes.panes}>
                        {this.state.profile.numbeo_traffic_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        Traffic:
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_pollution_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        Pollution:
                        </Typography>
                        : ''}
                        {this.state.profile.numbeo_traffic_time_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        Traffic Time to Work:
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_traffic_co2_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        CO2 Emissions:
                        </Typography>
                        : ''}
                        {this.state.profile.numbeo_traffic_inefficiency_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                        Traffic Inefficiency:
                        </Typography>
                        : ''}
                        
                    </Grid>


                    <Grid item className={this.props.classes.panes}>
                    {this.state.profile.numbeo_traffic_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>
                        {Math.round(this.state.profile.numbeo_traffic_index)}
                        </Typography>
                        : ''}
                    {this.state.profile.numbeo_pollution_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>
                        {Math.round(this.state.profile.numbeo_pollution_index)} / 100
                        </Typography>
                        : ''}
                        {this.state.profile.numbeo_traffic_time_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>
                        {Math.round(this.state.profile.numbeo_traffic_time_index)} minutes
                        </Typography>
                        : ''}
                        {this.state.profile.numbeo_traffic_co2_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>
                        {Math.round(this.state.profile.numbeo_traffic_co2_index)} grams
                        </Typography>
                        : ''}
                        {this.state.profile.numbeo_traffic_inefficiency_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh'}}>
                        {Math.round(this.state.profile.numbeo_traffic_inefficiency_index)}
                        </Typography>
                        : ''}
                    
                    </Grid>
                </Grid>
                </Paper>


            </Paper>
        );
        
        const numbeoA = (
            <div>
            <Typography variant="h3" style={{margin:50}}>{this.state.jobA.Location}</Typography>

            {this.state.jobA.numbeo_error ?
              <Typography variant="h5" color="secondary" style={{ marginLeft: '1vh', marginTop: 10 }}>
                Error Retrieving City Information.
              </Typography>
              :
              null}
            <Paper className={this.props.classes.item}>
            

            {this.state.jobA.numbeo_cpi_index ||
            this.state.jobA.numbeo_rent_index ||
            this.state.jobA.numbeo_cpi_and_rent_index ||
            this.state.jobA.numbeo_purchasing_power_incl_rent_index ||
            this.state.jobA.numbeo_restaurant_price_index ||
            this.state.jobA.numbeo_groceries_index ||
            this.state.jobA.numbeo_safety_index || 
            this.state.jobA.numbeo_crime_index ||
            this.state.jobA.numbeo_quality_of_life_index || 
            this.state.jobA.numbeo_climate_index || 
            this.state.jobA.numbeo_traffic_index ||
            this.state.jobA.numbeo_pollution_index ||
            this.state.jobA.numbeo_traffic_time_index ||
            this.state.jobA.numbeo_traffic_co2_index ||
            this.state.jobA.numbeo_traffic_inefficiency_index ||
            this.state.jobA.numbeo_health_care_index 
            ?
              null
              :
              <Typography variant="h4" style={{ marginTop: 20}}>No Data Available</Typography>
            }

            {this.state.jobA.numbeo_cpi_index ||
            this.state.jobA.numbeo_rent_index ||
            this.state.jobA.numbeo_cpi_and_rent_index ||
            this.state.jobA.numbeo_purchasing_power_incl_rent_index ||
            this.state.jobA.numbeo_restaurant_price_index ||
            this.state.jobA.numbeo_groceries_index ?
            <div>
            <Typography variant="h4" style={{ marginTop: 20}}>Cost of Living</Typography>
            <Typography style={{ fontSize: 20, marginTop: 10 }}>*Indices are relative to New York City (NYC).</Typography>
            </div>
            : null}
            <Grid container direction="row" style={{ justifyContent: 'center' }}>                   
                <Grid item className={this.props.classes.panes}>
                  {this.state.jobA.numbeo_cpi_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      CPI Index:
                    </Typography>
                    : ''}
                  {this.state.jobA.numbeo_rent_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Rent:
                    </Typography>
                    : ''}
                  {this.state.jobA.numbeo_cpi_and_rent_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      CPI and Rent:
                    </Typography>
                    : ''}
                  {this.state.jobA.numbeo_purchasing_power_incl_rent_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Purchasing Power:
                      </Typography>
                    : ''}
                  {this.state.jobA.numbeo_restaurant_price_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Restaurant Price:
                    </Typography>
                    : ''}
                    {this.state.jobA.numbeo_groceries_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Groceries:
                    </Typography>
                    : ''}
                  
                </Grid>

                <Grid item className={this.props.classes.panes}>
                  
                {this.state.jobA.numbeo_cpi_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobA.numbeo_cpi_index)}%
              </Typography>
                    : ''}
                {this.state.jobA.numbeo_rent_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobA.numbeo_rent_index)}%
              </Typography>
                    : ''}
                  {this.state.jobA.numbeo_cpi_and_rent_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobA.numbeo_cpi_and_rent_index)}%
              </Typography>
                    : ''}
                  {this.state.jobA.numbeo_purchasing_power_incl_rent_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobA.numbeo_purchasing_power_incl_rent_index)}%
              </Typography>
                    : ''}
                  {this.state.jobA.numbeo_restaurant_price_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobA.numbeo_restaurant_price_index)}%
              </Typography>
                    : ''}
                    {this.state.jobA.numbeo_groceries_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobA.numbeo_groceries_index)}%
              </Typography>
                    : ''}
                </Grid>
              </Grid>

              {this.state.jobA.numbeo_safety_index || this.state.jobA.numbeo_crime_index ?
              <div>
              <Typography variant="h4" style={{ marginTop: 20}}>Crime and Safety</Typography>
              </div>
              : null}
              <Grid container direction="row" style={{ justifyContent: 'center' }}>
                <Grid item className={this.props.classes.panes}>
                  {this.state.jobA.numbeo_crime_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Crime:
                    </Typography>
                    : ''}
                    {this.state.jobA.numbeo_safety_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Safety:
                    </Typography>
                    : ''}
                </Grid>

                <Grid item className={this.props.classes.panes}>
                {this.state.jobA.numbeo_crime_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobB.numbeo_crime_index > this.state.jobA.numbeo_crime_index || this.state.jobB.numbeo_crime_index === 0 ? "green" : "red"  }}>
                      {Math.round(this.state.jobA.numbeo_crime_index)} / 100
                    </Typography>
                    : ''}
                {this.state.jobA.numbeo_safety_index ?
                <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_safety_index > this.state.jobB.numbeo_safety_index || this.state.jobB.numbeo_safety_index === 0 ? "green" : "red"  }}>

                  {Math.round(this.state.jobA.numbeo_safety_index)} / 100
                </Typography>
                : ''}
                </Grid>
              </Grid>  
              
              {this.state.jobA.numbeo_quality_of_life_index || 
              this.state.jobA.numbeo_climate_index || 
              this.state.jobA.numbeo_traffic_index ||
              this.state.jobA.numbeo_pollution_index ||
              this.state.jobA.numbeo_traffic_time_index ||
              this.state.jobA.numbeo_traffic_co2_index ||
              this.state.jobA.numbeo_traffic_inefficiency_index ||
              this.state.jobA.numbeo_health_care_index ?
              <div>
              <Typography variant="h4" style={{ marginTop: 20, marginBottom: 10}}>Quality of Life</Typography>
              </div>
              : null }
              {this.state.jobA.numbeo_quality_of_life_index || 
              this.state.jobA.numbeo_climate_index || 
              this.state.jobA.numbeo_health_care_index ?
              <span>(Higher is Better) </span>
              : null }
              <Grid container direction="row" style={{ justifyContent: 'center' }}>
                <Grid item className={this.props.classes.panes}>
                  {this.state.jobA.numbeo_quality_of_life_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Quality of Life:
                    </Typography>
                    : ''}
                  {this.state.jobA.numbeo_climate_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Climate:
                    </Typography>
                    : ''}
                    {this.state.jobA.numbeo_health_care_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Health Care:
                    </Typography>
                    : ''}
                    </Grid>
                 <Grid item className={this.props.classes.panes}>
                   {this.state.jobA.numbeo_quality_of_life_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_quality_of_life_index > this.state.jobB.numbeo_quality_of_life_index || this.state.jobB.numbeo_quality_of_life_index === 0 ?  "green" : "red"    }}>
                      {Math.round(this.state.jobA.numbeo_quality_of_life_index)}
                    </Typography>
                    : ''}
                 {this.state.jobA.numbeo_climate_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_climate_index > this.state.jobB.numbeo_climate_index || this.state.jobB.numbeo_climate_index === 0 ? "green" : "red"   }}>
                      {Math.round(this.state.jobA.numbeo_climate_index)}
                    </Typography>
                    : ''}
                      {this.state.jobA.numbeo_health_care_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_health_care_index > this.state.jobB.numbeo_health_care_index || this.state.jobB.numbeo_health_care_index === 0 ?  "green" : "red"   }}>
                      {Math.round(this.state.jobA.numbeo_health_care_index)} / 100
                    </Typography>
                    : ''}
                   </Grid>

                   </Grid>
                   {this.state.jobA.numbeo_traffic_index ||
                this.state.jobA.numbeo_pollution_index ||
                this.state.jobA.numbeo_traffic_time_index ||
                this.state.jobA.numbeo_traffic_co2_index ||
                this.state.jobA.numbeo_traffic_inefficiency_index ?
                <span style={{marginTop:10}}>(Higher is Worse)</span>
                : null}
                 <Grid container direction="row" style={{ justifyContent: 'center' }}>
               
                   <Grid item className={this.props.classes.panes}>
                    {this.state.jobA.numbeo_traffic_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Traffic:
                      </Typography>
                    : ''}
                  {this.state.jobA.numbeo_pollution_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Pollution:
                    </Typography>
                    : ''}
                    {this.state.jobA.numbeo_traffic_time_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Traffic Time to Work:
                    </Typography>
                    : ''}
                  {this.state.jobA.numbeo_traffic_co2_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      CO2 Emissions:
                    </Typography>
                    : ''}
                    {this.state.jobA.numbeo_traffic_inefficiency_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Traffic Inefficiency:
                    </Typography>
                    : ''}
                    
                </Grid>


                   <Grid item className={this.props.classes.panes}>
                  {this.state.jobA.numbeo_traffic_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_traffic_index < this.state.jobB.numbeo_traffic_index || this.state.jobB.numbeo_traffic_index === 0 ? "green" : "red" }}>
                      {Math.round(this.state.jobA.numbeo_traffic_index)}
                    </Typography>
                    : ''}
                  {this.state.jobA.numbeo_pollution_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_pollution_index < this.state.jobB.numbeo_pollution_index || this.state.jobB.numbeo_pollution_index === 0 ? "green" : "red"  }}>
                      {Math.round(this.state.jobA.numbeo_pollution_index)} / 100
                    </Typography>
                    : ''}
                     {this.state.jobA.numbeo_traffic_time_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_traffic_time_index < this.state.jobB.numbeo_traffic_time_index || this.state.jobB.numbeo_traffic_time_index === 0 ? "green" : "red"  }}>
                      {Math.round(this.state.jobA.numbeo_traffic_time_index)} minutes
                    </Typography>
                    : ''}
                     {this.state.jobA.numbeo_traffic_co2_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_traffic_co2_index < this.state.jobB.numbeo_traffic_co2_index || this.state.jobB.numbeo_traffic_co2_index === 0 ? "green" : "red"  }}>
                      {Math.round(this.state.jobA.numbeo_traffic_co2_index)} grams
                    </Typography>
                    : ''}
                      {this.state.jobA.numbeo_traffic_inefficiency_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_traffic_inefficiency_index < this.state.jobB.numbeo_traffic_inefficiency_index || this.state.jobB.numbeo_traffic_inefficiency_index === 0 ? "green" : "red"  }}>
                      {Math.round(this.state.jobA.numbeo_traffic_inefficiency_index)}
                    </Typography>
                    : ''}
                  
                </Grid>
              </Grid>
            </Paper>
          </div>
        );

        const numbeoB = (
            <div>
            <Typography variant="h3" style={{margin:50}}>{this.state.jobB.Location}</Typography>

            {this.state.jobB.numbeo_error ?
              <Typography variant="h5" color="secondary" style={{ marginLeft: '1vh', marginTop: 10 }}>
                Error Retrieving City Information.
              </Typography>
              :
              null}
            <Paper className={this.props.classes.item}>
            

            {this.state.jobB.numbeo_cpi_index ||
            this.state.jobB.numbeo_rent_index ||
            this.state.jobB.numbeo_cpi_and_rent_index ||
            this.state.jobB.numbeo_purchasing_power_incl_rent_index ||
            this.state.jobB.numbeo_restaurant_price_index ||
            this.state.jobB.numbeo_groceries_index ||
            this.state.jobB.numbeo_safety_index || 
            this.state.jobB.numbeo_crime_index ||
            this.state.jobB.numbeo_quality_of_life_index || 
            this.state.jobB.numbeo_climate_index || 
            this.state.jobB.numbeo_traffic_index ||
            this.state.jobB.numbeo_pollution_index ||
            this.state.jobB.numbeo_traffic_time_index ||
            this.state.jobB.numbeo_traffic_co2_index ||
            this.state.jobB.numbeo_traffic_inefficiency_index ||
            this.state.jobB.numbeo_health_care_index 
            ?
              null
              :
              <Typography variant="h4" style={{ marginTop: 20}}>No Data Available</Typography>
            }

            {this.state.jobB.numbeo_cpi_index ||
            this.state.jobB.numbeo_rent_index ||
            this.state.jobB.numbeo_cpi_and_rent_index ||
            this.state.jobB.numbeo_purchasing_power_incl_rent_index ||
            this.state.jobB.numbeo_restaurant_price_index ||
            this.state.jobB.numbeo_groceries_index ?
            <div>
            <Typography variant="h4" style={{ marginTop: 20}}>Cost of Living</Typography>
            <Typography style={{ fontSize: 20, marginTop: 10 }}>*Indices are relative to New York City (NYC).</Typography>
            </div>
            : null}
            <Grid container direction="row" style={{ justifyContent: 'center' }}>                   
                <Grid item className={this.props.classes.panes}>
                  {this.state.jobB.numbeo_cpi_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      CPI Index:
                    </Typography>
                    : ''}
                  {this.state.jobB.numbeo_rent_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Rent:
                    </Typography>
                    : ''}
                  {this.state.jobB.numbeo_cpi_and_rent_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      CPI and Rent:
                    </Typography>
                    : ''}
                  {this.state.jobB.numbeo_purchasing_power_incl_rent_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Purchasing Power:
                      </Typography>
                    : ''}
                  {this.state.jobB.numbeo_restaurant_price_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Restaurant Price:
                    </Typography>
                    : ''}
                    {this.state.jobB.numbeo_groceries_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Groceries:
                    </Typography>
                    : ''}
                  
                </Grid>

                <Grid item className={this.props.classes.panes}>
                  
                {this.state.jobB.numbeo_cpi_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobB.numbeo_cpi_index)}%
              </Typography>
                    : ''}
                {this.state.jobB.numbeo_rent_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobB.numbeo_rent_index)}%
              </Typography>
                    : ''}
                  {this.state.jobB.numbeo_cpi_and_rent_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobB.numbeo_cpi_and_rent_index)}%
              </Typography>
                    : ''}
                  {this.state.jobB.numbeo_purchasing_power_incl_rent_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobB.numbeo_purchasing_power_incl_rent_index)}%
              </Typography>
                    : ''}
                  {this.state.jobB.numbeo_restaurant_price_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobB.numbeo_restaurant_price_index)}%
              </Typography>
                    : ''}
                    {this.state.jobB.numbeo_groceries_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                      {Math.round(this.state.jobB.numbeo_groceries_index)}%
              </Typography>
                    : ''}
                </Grid>
              </Grid>

              {this.state.jobB.numbeo_safety_index || this.state.jobB.numbeo_crime_index ?
              <div>
              <Typography variant="h4" style={{ marginTop: 20}}>Crime and Safety</Typography>
              </div>
              : null}
              <Grid container direction="row" style={{ justifyContent: 'center' }}>
                <Grid item className={this.props.classes.panes}>
                  {this.state.jobB.numbeo_crime_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Crime:
                    </Typography>
                    : ''}
                    {this.state.jobB.numbeo_safety_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Safety:
                    </Typography>
                    : ''}
                </Grid>

                <Grid item className={this.props.classes.panes}>
                {this.state.jobB.numbeo_crime_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_crime_index > this.state.jobB.numbeo_crime_index || this.state.jobA.numbeo_crime_index === 0 ? "green" : "red" }}>
                      {Math.round(this.state.jobB.numbeo_crime_index)} / 100
                    </Typography>
                    : ''}
                {this.state.jobB.numbeo_safety_index ?
                <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobB.numbeo_safety_index > this.state.jobA.numbeo_safety_index || this.state.jobA.numbeo_safety_index === 0 ? "green" : "red"  }}>

                  {Math.round(this.state.jobB.numbeo_safety_index)} / 100
                </Typography>
                : ''}
                </Grid>
              </Grid>  
              
              {this.state.jobB.numbeo_quality_of_life_index || 
              this.state.jobB.numbeo_climate_index || 
              this.state.jobB.numbeo_traffic_index ||
              this.state.jobB.numbeo_pollution_index ||
              this.state.jobB.numbeo_traffic_time_index ||
              this.state.jobB.numbeo_traffic_co2_index ||
              this.state.jobB.numbeo_traffic_inefficiency_index ||
              this.state.jobB.numbeo_health_care_index ?
              <div>
              <Typography variant="h4" style={{ marginTop: 20, marginBottom: 10}}>Quality of Life</Typography>
              </div>
              : null }
              {this.state.jobB.numbeo_quality_of_life_index || 
              this.state.jobB.numbeo_climate_index || 
              this.state.jobB.numbeo_health_care_index ?
              <span>(Higher is Better) </span>
              : null }
              <Grid container direction="row" style={{ justifyContent: 'center' }}>
                <Grid item className={this.props.classes.panes}>
                  {this.state.jobB.numbeo_quality_of_life_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Quality of Life:
                    </Typography>
                    : ''}
                  {this.state.jobB.numbeo_climate_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Climate:
                    </Typography>
                    : ''}
                    {this.state.jobB.numbeo_health_care_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Health Care:
                    </Typography>
                    : ''}
                    </Grid>
                 <Grid item className={this.props.classes.panes}>
                   {this.state.jobB.numbeo_quality_of_life_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobB.numbeo_quality_of_life_index > this.state.jobA.numbeo_quality_of_life_index || this.state.jobA.numbeo_quality_of_life_index === 0 ?  "green" : "red"   }}>
                      {Math.round(this.state.jobB.numbeo_quality_of_life_index)}
                    </Typography>
                    : ''}
                 {this.state.jobB.numbeo_climate_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobB.numbeo_climate_index > this.state.jobA.numbeo_climate_index || this.state.jobA.numbeo_climate_index === 0 ?  "green" : "red"  }}>
                      {Math.round(this.state.jobB.numbeo_climate_index)}
                    </Typography>
                    : ''}
                      {this.state.jobB.numbeo_health_care_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobB.numbeo_health_care_index > this.state.jobA.numbeo_health_care_index || this.state.jobA.numbeo_health_care_index === 0 ?   "green" : "red"  }} >
                      {Math.round(this.state.jobB.numbeo_health_care_index)} / 100
                    </Typography>
                    : ''}
                   </Grid>

                   </Grid>
                   {this.state.jobB.numbeo_traffic_index ||
                this.state.jobB.numbeo_pollution_index ||
                this.state.jobB.numbeo_traffic_time_index ||
                this.state.jobB.numbeo_traffic_co2_index ||
                this.state.jobB.numbeo_traffic_inefficiency_index ?
                <span style={{marginTop:10}}>(Higher is Worse)</span>
                : null}
                 <Grid container direction="row" style={{ justifyContent: 'center' }}>
               
                   <Grid item className={this.props.classes.panes}>
                    {this.state.jobB.numbeo_traffic_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Traffic:
                      </Typography>
                    : ''}
                  {this.state.jobB.numbeo_pollution_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Pollution:
                    </Typography>
                    : ''}
                    {this.state.jobB.numbeo_traffic_time_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Traffic Time to Work:
                    </Typography>
                    : ''}
                  {this.state.jobB.numbeo_traffic_co2_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      CO2 Emissions:
                    </Typography>
                    : ''}
                    {this.state.jobB.numbeo_traffic_inefficiency_index ?
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh'}}>
                      Traffic Inefficiency:
                    </Typography>
                    : ''}
                    
                </Grid>


                   <Grid item className={this.props.classes.panes}>
                  {this.state.jobB.numbeo_traffic_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_traffic_index > this.state.jobB.numbeo_traffic_index  || this.state.jobA.numbeo_traffic_index  === 0 ?  "green" : "red" }}>
                      {Math.round(this.state.jobB.numbeo_traffic_index)}
                    </Typography>
                    : ''}
                  {this.state.jobB.numbeo_pollution_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_pollution_index > this.state.jobB.numbeo_pollution_index  || this.state.jobA.numbeo_pollution_index  === 0 ?  "green" : "red" }}>
                      {Math.round(this.state.jobB.numbeo_pollution_index)} / 100
                    </Typography>
                    : ''}
                     {this.state.jobB.numbeo_traffic_time_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_traffic_time_index > this.state.jobB.numbeo_traffic_time_index  || this.state.jobA.numbeo_traffic_time_index === 0 ?  "green" : "red" }}>
                      {Math.round(this.state.jobB.numbeo_traffic_time_index)} minutes
                    </Typography>
                    : ''}
                     {this.state.jobB.numbeo_traffic_co2_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_traffic_co2_index > this.state.jobB.numbeo_traffic_co2_index || this.state.jobA.numbeo_traffic_co2_index === 0 ?  "green" : "red" }}>
                      {Math.round(this.state.jobB.numbeo_traffic_co2_index)} grams
                    </Typography>
                    : ''}
                      {this.state.jobB.numbeo_traffic_inefficiency_index ?
                    <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh', color: this.state.jobA.numbeo_traffic_inefficiency_index > this.state.jobB.numbeo_traffic_inefficiency_index || this.state.jobA.numbeo_traffic_inefficiency_index === 0 ? "green" : "red" }}>
                      {Math.round(this.state.jobB.numbeo_traffic_inefficiency_index)}
                    </Typography>
                    : ''}
                  
                </Grid>
              </Grid>
            </Paper>
          </div>
        );


        const jobPanelA = (
            <Paper className={this.props.classes.jobPanel}>
                    <Typography variant="h3" style={{marginBottom: 10}}>{this.state.jobA.JobTitle}</Typography>
                    <Typography variant="h4" style={{marginBottom: 30}}>{this.state.jobA.CompanyName}</Typography>
                    <Button variant="contained" color="primary" onClick={() => this.props.history.push(`/jobs/details/${this.state.jobAid}`)}>DETAILS</Button>
                <Paper style={{backgroundColor: this.getColorFromStatus(this.state.jobA.ApplicationStatus)}} className={this.props.classes.label}>
                    <Typography variant="h6"> Current Status: </Typography>
                    <Typography>{this.state.jobA.ApplicationStatus}</Typography>
                </Paper>
                <Paper className={this.props.classes.label} style={{minHeight: 150}}>
                    <Typography variant="h6">Notes</Typography>
                   {this.state.jobA.Notes ? 
                   <Typography style={{marginTop: 10}}>{this.state.jobA.Notes}</Typography> 
                   :
                   <Typography style={{marginTop: 10}}>You have not added any notes to this application.</Typography>
                   }
                </Paper>
                <Paper style={{backgroundColor: this.getBackgroundColorFromComparison("a", "Location")}} className={this.props.classes.label}>
                    <Typography variant="h6">Location</Typography>
                    <Typography style={{marginTop: 10}}>{this.state.jobA.Location}</Typography>
                    <Typography>{Math.round(this.state.jobA.Distance)} miles away</Typography>
                </Paper>
                <Paper style={{backgroundColor: this.getBackgroundColorFromComparison("a", "Enthusiasm")}} className={this.props.classes.label}>
                    <Typography variant="h6">Enthusiasm</Typography>
                    <Typography component={'span'} style={{marginTop: 10}}>{this.getStars(this.state.jobA.Enthusiasm)}</Typography>
                </Paper>
                <Paper style={{backgroundColor: this.getBackgroundColorFromComparison("a", "Optimism")}} className={this.props.classes.label}>
                    <Typography variant="h6">Optimism</Typography>
                    <Typography component={'span'} style={{marginTop: 10}}>{this.getStars(this.state.jobA.Optimism)}</Typography>
                </Paper>
                <Paper className={this.props.classes.label}>
                    <Typography variant="h6">Last Contact</Typography>
                    <Typography style={{marginTop: 10}}>{moment(this.state.jobA.LastContact).format("MM/DD/YYYY")}</Typography>
                </Paper>
                <Paper className={this.props.classes.label}>
                    <Typography variant="h6">Expected Contact</Typography>
                    {this.state.jobA.ExpectedContact ?
                    <Typography style={{marginTop: 10}}>{moment(this.state.jobA.ExpectedContact).format("MM/DD/YYYY")}</Typography>
                    :
                    <Typography style={{marginTop: 10}}>No Date Available</Typography>
                    }
                </Paper>
                

                {numbeoA}

            </Paper>
        );

        const jobPanelB = (
            <Paper className={this.props.classes.jobPanel}>                
                    <Typography variant="h3" style={{marginBottom: 10}}>{this.state.jobB.JobTitle}</Typography>
                    <Typography variant="h4" style={{marginBottom: 30}}>{this.state.jobB.CompanyName}</Typography>
                    <Button variant="contained" color="primary" onClick={() => this.props.history.push(`/jobs/details/${this.state.jobBid}`)}>DETAILS</Button>
                <Paper style={{backgroundColor: this.getColorFromStatus(this.state.jobB.ApplicationStatus)}} className={this.props.classes.label}>
                    <Typography variant="h6"> Current Status: </Typography>
                    <Typography>{this.state.jobB.ApplicationStatus}</Typography>
                </Paper>
                <Paper className={this.props.classes.label} style={{minHeight: 150}}>
                    <Typography variant="h6">Notes</Typography>
                   {this.state.jobB.Notes ? 
                   <Typography style={{marginTop: 10}}>{this.state.jobB.Notes}</Typography> 
                   :
                   <Typography style={{marginTop: 10}}>You have not added any notes to this application.</Typography>
                   }
                </Paper>
                <Paper style={{backgroundColor: this.getBackgroundColorFromComparison("b", "Location")}} className={this.props.classes.label}>
                    <Typography variant="h6">Location</Typography>
                    <Typography style={{marginTop: 10}}>{this.state.jobB.Location}</Typography>
                    <Typography>{Math.round(this.state.jobB.Distance)} miles away</Typography>
                </Paper>
                <Paper style={{backgroundColor: this.getBackgroundColorFromComparison("b", "Enthusiasm")}} className={this.props.classes.label}>
                    <Typography variant="h6">Enthusiasm</Typography>
                    <Typography component={'span'} style={{marginTop: 10}}>{this.getStars(this.state.jobB.Enthusiasm)}</Typography>
                </Paper>
                <Paper style={{backgroundColor: this.getBackgroundColorFromComparison("b", "Optimism")}} className={this.props.classes.label}>
                    <Typography variant="h6">Optimism</Typography>
                    <Typography component={'span'} style={{marginTop: 10}}>{this.getStars(this.state.jobB.Optimism)}</Typography>
                </Paper>
                <Paper className={this.props.classes.label}>
                    <Typography variant="h6">Last Contact</Typography>
                    <Typography style={{marginTop: 10}}>{moment(this.state.jobB.LastContact).format("MM/DD/YYYY")}</Typography>
                </Paper>
                <Paper className={this.props.classes.label}>
                    <Typography variant="h6">Expected Contact</Typography>
                    {this.state.jobB.ExpectedContact ?
                    <Typography style={{marginTop: 10}}>{moment(this.state.jobB.ExpectedContact).format("MM/DD/YYYY")}</Typography>
                    :
                    <Typography style={{marginTop: 10}}>No Date Available</Typography>
                    }
                </Paper>
                

                {numbeoB}

            </Paper>
        );

        return (
            <Grid container>
                <Paper className={this.props.classes.root}>
                    <Paper className={this.props.classes.paperHeading}>
                        <Button onClick={() => this.props.history.push("/home")}><Typography variant="h3" align="center" color="primary" style={{ margin: 40}}>← Back to Applications</Typography></Button>
                    </Paper>
                    <Grid container direction="row">
                        <Grid item sm={6}>    
                            {jobPanelA}
                        </Grid>
                        <Grid item sm={6}>
                            {jobPanelB}
                        </Grid>
                    </Grid>
                    <div style={{maxWidth: 630, margin:"auto"}}>
                            {numbeoProfile}
                    </div>
                </Paper>
            </Grid>
        );
       
    }


}
export default compose(
    withRouter,
    withFirebase,
  )(withStyles(styles)(JobCompare))
