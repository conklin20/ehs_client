import React from 'react'; 
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Hidden, Typography, Divider } from '@material-ui/core';
import CopyrightIcon from '@material-ui/icons/Copyright';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';
import SafetyIncidentList from '../Event/Safety/Incidents'; 
import coverImage from '../../images/mfg-plant.jpg';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100vh',
    margin: '0', 
    padding: '0'
  },
  homepageLeftCss: {
    backgroundImage: `url(${coverImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    zIndex: '-1'
  },
  homepageRightCss: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  icon: {
    margin: theme.spacing(0),
    fontSize: 20,
  },
}));

const Homepage = (props) => {
  const classes = useStyles();
  const { authUser, errors, removeError, currentUser } = props;
  //if user is not logged in, route them to the main landing page 
  if(!currentUser.isAuthenticated){
      return (
          <div className={classes.root}>
            <Grid container spacing={0}>
              <Hidden xsDown>
                <Grid item sm={9}>
                  <Paper className={[classes.paper, classes.homepageLeftCss]}
                    square={true}
                  >
                     {/* background image rendered */}
                  </Paper>
                </Grid>
              </Hidden>
              <Grid item xs={12} sm={3}>
                <Paper className={[classes.paper, classes.homepageRightCss]}
                    square={true}
                >                 
                  <Typography variant="h3" gutterBottom>Welcome to _________, the new Incident Investigation System!</Typography>
                  <AuthForm 
                      errors={errors}
                      removeError={removeError}
                      onAuth={authUser}
                      buttonText='Log In!'
                      heading='Log In Here'
                      domain='VSTO\'
                      {...props } 
                  />        
                  <Divider variant='middle'/>
                  <Typography>                        
                    <CopyrightIcon className={classes.icon} /> 2019 All Rights Reserved
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </div>
      );
  }
  //if user is logged in, route them to their dashboard
  return (
      <div>
          {/* {<SafetyIncidentList />} */}
      </div>
  )
};

export default Homepage; 