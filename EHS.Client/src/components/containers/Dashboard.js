import React, { useState } from 'react'; 
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Hidden, Typography } from '@material-ui/core';
import EventList from './EventList';
import ReportAside from '../containers/ReportAside'; 
import UserAside from '../containers/UserAside'; 

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
  icon: {
    margin: theme.spacing(0),
    fontSize: 20,
  },
}));

const Dashboard = ( props ) => {    
	const classes = useStyles();
	
	return (
		<div className={classes.root}>			
			<Grid container spacing={0}>
				<Hidden smDown>
					<Grid item md={2}>
						<Paper className={[classes.paper, ]}
							square={true}
						>
						<Typography variant="h4" gutterBottom>Report Aside!</Typography>  
						<ReportAside   
						/>
						</Paper>
					</Grid>
				</Hidden>
				<Grid item xs={12} md={8}>
					<Paper className={[classes.paper, ]}
							square={true}
					>                 
						<Typography variant="h3" gutterBottom>Incident List!</Typography>     
						
						<EventList 
								currentUser={props.currentUser} 
						/>
					</Paper>
				</Grid>				
				<Hidden smDown>
					<Grid item md={2}>
						<Paper className={[classes.paper, ]}
								square={true}
						>                 
							<Typography variant="h4" gutterBottom>User Aside!</Typography>     
							<UserAside 
							/>
						</Paper>
					</Grid>
				</Hidden>
			</Grid>
		</div>
	) 
    
}

export default Dashboard; 