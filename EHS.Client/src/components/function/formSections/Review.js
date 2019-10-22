import React, { Fragment } from 'react';
import { Typography, Grid,  Divider } from '@material-ui/core'; 
import Moment from 'react-moment'; 


const Review = (props) => {
    const classes = props.useStyles();    
    const { event } = props; 
    	
    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Review Event
            </Typography>
            <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                Instructions: Review all event information for accuracy. If this is a Draft, you can submit it from here. 
            </Typography>       
            <Divider/>    						
            <Grid container spacing={2}>			
                <Grid item xs={12}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span>Reported By: </span>
                        {event.reportedBy}
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
    );
}	

export default Review; 