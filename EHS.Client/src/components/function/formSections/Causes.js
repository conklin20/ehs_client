import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, TextField, Divider, Checkbox, FormControlLabel  } from '@material-ui/core'; 

const useStyles = makeStyles(theme => ({

}));

const Causes = (props) => {
    const classes = useStyles();
    // const handleChange = name => event => {
    //     setValues({ ...values, [name]: event.target.value });
    // };        

    const {  } = props; 


    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Event Causes
            </Typography>
        </Fragment>
    );
}	

export default Causes; 