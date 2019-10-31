import React, { Fragment } from 'react';
import { Typography, Grid,  Divider } from '@material-ui/core'; 
import Moment from 'react-moment'; 


const ReportingInformation = (props) => {
    const classes = props.useStyles();    
    const { event, currentUser, lookupData } = props; 
        
    // console.log(event)
    // console.log(Object.keys(event).length && Object.keys(lookupData).length)
    return (
        <Fragment>  
            { 
                Object.keys(event).length && Object.keys(lookupData).length ?  
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
                                {event.reportedBy === 'N/A' ? event.reportedBy : lookupData.employees.find(e => e.employeeId === event.reportedBy).fullName}
                            </Typography>	
                        </Grid>       	
                        <Grid item xs={12}>		
                            <Typography className={classes.label} variant="body1" gutterBottom>
                                <span>Date Reported: </span>
                                <Moment format={currentUser.user.dateFormat || 'MM/DD/YYYY'}>
                                    {event.reportedOn}
                                </Moment> 
                            </Typography>	
                        </Grid>       	
                        <Grid item xs={12}>		
                            <Typography className={classes.label} variant="body1" gutterBottom>   
                                <span>Time Reported: </span>
                                <Moment format="LTS" add={{ hours: currentUser.user.timeZone}}>
                                    {event.reportedOn}
                                </Moment>	
                            </Typography>	
                        </Grid>      
                        <Grid item xs={12}>		
                            <Typography className={classes.label} variant="body1" gutterBottom>   
                                <span>Event Status: </span>
                                {event.eventStatus}
                            </Typography>	
                        </Grid>        
                    </Grid>
                </Fragment>
                : null }
        </Fragment>
    );
}	

export default ReportingInformation; 