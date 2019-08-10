import React, { useState, useEffect, Fragment } from 'react';
import { Typography, Grid, TextField, Divider } from '@material-ui/core'; 
import Moment from 'react-moment'; 


const ReportingInformation = (props) => {
    const classes = props.useStyles();    
    const { values, currentUser } = props; 
 	
    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Reporting Information
            </Typography>
            <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                Instructions: No input required, these fields will be defaulted 
            </Typography>       
            <Divider/>    						
            <Grid container spacing={2}>			
                <Grid item xs={12}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span>Reported By: </span>
                        {values.reportedBy}
                    </Typography>	
                </Grid>       	
                <Grid item xs={12}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span>Date Reported: </span>
                        <Moment format={currentUser.user.dateFormat || 'MM/DD/YYYY'}>
                            {values.reportedOn}
                        </Moment> 
                    </Typography>	
                </Grid>       	
                <Grid item xs={12}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>   
                        <span>Time Reported: </span>
                        <Moment format="LTS" add={{ hours: currentUser.user.timeZone}}>
                            {values.reportedOn}
                        </Moment>	
                    </Typography>	
                </Grid>      
                <Grid item xs={12}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>   
                        <span>Event Status: </span>
                        {values.eventStatus}
                    </Typography>	
                </Grid>        
            </Grid>
        </Fragment>
    );
}	

export default ReportingInformation; 