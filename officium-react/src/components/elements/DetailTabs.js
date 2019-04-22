import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InfoIcon from '@material-ui/icons/Info';
import DocumentIcon from '@material-ui/icons/Save';
import NotesIcon from '@material-ui/icons/Notes';
import CityIcon from '@material-ui/icons/LocationCity';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ContactsIcon from '@material-ui/icons/ContactMail';
import Paper from '@material-ui/core/Paper';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

function TabContainer({ children }) {
  return (
    { children }
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: 'auto',
    marginBottom: '5%',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);



const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: 20,
    backgroundColor: theme.palette.primary.main,
  },
  tab: {
    color: "white",
    width: 120
  }
});

class DetailTabs extends React.Component {
  state = {
    value: 0,
    job: this.props.job,
    width: window.innerWidth,
  };

  handleChangeTab = this.props.handleChangeTab;
  handleChange = (event, value) => {
    this.handleChangeTab(value);
    this.setState({
      value
    });
  };

  updateTab = (event, value) => {
    this.handleChangeTab(parseInt(event.target.value));
    this.setState({
      value: parseInt(event.target.value),
    });
  };

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
    })
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    const { classes } = this.props;

    return (
      this.state.width > 900 ?
        <Paper className={classes.root}>

          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            style={{ paddingLeft: "2.1%" }}
          >
            <Tab value={0} className={this.props.classes.tab} icon={<InfoIcon />} label="GENERAL INFORMATION" />
            <Tab value={1} className={this.props.classes.tab} icon={<DocumentIcon />} label="DOCUMENTS" />
            <Tab value={2} className={this.props.classes.tab} icon={<NotesIcon />} label="NOTES" />
            <Tab value={3} className={this.props.classes.tab} icon={<CityIcon />} label="CITY INFORMATION" />
            <Tab value={4} className={this.props.classes.tab} icon={<PersonPinIcon />} label="GLASSDOOR REVIEWS" />
            <Tab value={5} className={this.props.classes.tab} icon={<ContactsIcon />} label="CONTACTS" />
          </Tabs>

        </Paper>
        :
        <NativeSelect
          name="age"
          value={this.state.value}
          onChange={this.updateTab}
          className={classes.selectEmpty}
          input={<BootstrapInput/>}
        >
          <option value={0}>General Information</option>
          <option value={1}>Documents</option>
          <option value={2}>Notes</option>
          <option value={3}>City Information</option>
          <option value={4}>Glassdoor Review</option>
          <option value={5}>Contacts</option>
        </NativeSelect>
    );
  }
}

DetailTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DetailTabs);