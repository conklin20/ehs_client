import React, { useState, Fragment } from 'react'; 
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    body: {
        padding: theme.spacing(5),
    }
}));

const PageNotFound = props => {
    const classes = useStyles(); 

    return (
        <Paper className={classes.body}>
            <Typography variant="h2" gutterBottom>
                Oops! The page you're looking for wasn't found 
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                We couldn't locate the page you're looking for. 
                <Link to='/dashboard'>
                    Navigate back to safety.
                </Link>
            </Typography>
        </Paper>
    )
}

export default connect(null, null)(PageNotFound); 