import React, { useState, Fragment } from 'react'; 
import { connect } from "react-redux";
import { Hidden, Typography } from '@material-ui/core';

const ReportAside = props => {	
    
    return (     
        //This component will be hidden on lg (landscape tablet) and smaller 
        <Hidden lgDown>
            <Fragment >
                <Typography variant="h4" gutterBottom>Report Aside</Typography>
                <Typography>
                    # of open actions past due by Dept
                </Typography>
            </Fragment>
        </Hidden>
    )
    
}

function mapStateToProps(state) {
    // console.log(state)
    return {
    };
}

export default connect(mapStateToProps, null)(ReportAside); 
