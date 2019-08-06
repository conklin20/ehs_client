import React, { useState, Fragment } from 'react';
import { Typography, Grid, TextField,  } from '@material-ui/core'; 

//Safety Incident Event Details
const SIEventDetails = (props) => {
    const classes = props.useStyles();
    // const handleChange = name => event => {
    //     setValues({ ...values, [name]: event.target.value });
    // };        

    const { values, lookupData, handleChange } = props; 

    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Event Details
            </Typography>
            <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                Instructions: Fill out this form, provding as much detail as you can about the event
            </Typography>       				
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    
                </Grid>
                <Grid item xs={12} md={6}>
                    
								
                </Grid>
                <Grid item xs={12}>		
                    <TextField
                        id='what-happened'
                        label='What Happened?'
                        multiline
                        fullWidth
                        rows='4'
                        value={values.whatHappened}
                        onChange={handleChange('eventDetails', 'whatHappened')}
                        helperText='Explain in as much detail possible what happened...'
                        variant="outlined"
                    />                    
                </Grid>
            </Grid>
        </Fragment>
    );
}	

export default SIEventDetails; 