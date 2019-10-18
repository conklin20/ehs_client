import React, { useState } from 'react'; 
import { connect } from "react-redux";
import { Hidden, Typography } from '@material-ui/core';


const ReportAside = props => {	
    const classes = props.classes;
    
    return (     
        
        <Hidden smDown>
            <div className={classes.leftAside}>
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
