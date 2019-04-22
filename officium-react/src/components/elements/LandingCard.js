import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import businessImg from '../../img/business.jpg';
import calendarImg from '../../img/calendar.jpg';
import booksImg from '../../img/books.jpg';
import mapImg from '../../img/map.jpg';
import sortingImg from '../../img/sorting.jpg';
import updateImg from '../../img/update.jpg';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    card: {
      maxWidth: window.innerWidth/3 + 150,
      margin: 'auto',
      padding: theme.spacing.unit,
      marginBottom: 20,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    }
  });


class LandingCard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          imageFile: null
        }
    }
    
    componentWillMount(){

        switch(this.props.image){
            case ("business"): {
                this.setState({
                    imageFile: businessImg,
                });
                break;
            }
            case ("calendar"): {
                this.setState({
                    imageFile: calendarImg,
                });
                break;
            }
            case ("books"): {
                this.setState({
                    imageFile: booksImg,
                });
                break;
            }
            case ("map"): {
                this.setState({
                    imageFile:mapImg,
                });
                break;
            }
            case ("sorting"): {
                this.setState({
                    imageFile: sortingImg,
                });
                break;
            }
            case ("update"): {
                this.setState({
                    imageFile: updateImg,
                });
                break;
            }
            default:
                break;
        }
    }
    
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card} title={this.props.title}>
            <CardMedia
              className={classes.media}
              image={this.state.imageFile}
            />
            <CardContent>
              <Typography variant="h4">
                {this.props.title}
              </Typography>
              <Typography component="p" style={{marginTop: 15, marginBottom: 15, fontSize: 18,}}>
                {this.props.description}
              </Typography>
            </CardContent>
          </Card>
        );
    }
}

export default withStyles(styles)(LandingCard);