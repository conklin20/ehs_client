import React, { useState } from 'react'; 
import { connect } from "react-redux";
import { Hidden, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    reportAside: {
        flex: 1, 
        // backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing(2),
    },     
})); 

const ReportAside = props => {	
    const classes = useStyles(); 
    
    return (     
        //This component will be hidden on lg (landscape tablet) and smaller 
        <Hidden lgDown>
            <div className={classes.reportAside}>
                <Typography variant="h4" gutterBottom>Report Aside</Typography>
                <Typography>
                    # of open actions past due by Dept
                </Typography>
            </div>
        </Hidden>
    )
    
}

function mapStateToProps(state) {
    // console.log(state)
    return {
    };
}

export default connect(mapStateToProps, null)(ReportAside); 
