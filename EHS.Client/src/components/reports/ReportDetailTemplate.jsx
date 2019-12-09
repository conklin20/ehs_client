import React, { Component, useEffect, useState, useRef, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import moment from 'moment';
import { Grid, Typography, Button } from '@material-ui/core';
import { ATTR_CATS } from '../../helpers/attributeCategoryEnum';
import filterLookupDataByKey  from '../../helpers/filterLookupDataByKey';
import PrintIcon from '@material-ui/icons/Print'
import ReactToPrint from 'react-to-print';

const useStyles = makeStyles(theme => ({
    header: {
        marginBottom: theme.spacing(1), 
    },
    reportBody: {
        textAlign: 'left',
    },
    print: {
        float: 'right',
        margin: 0,
    },
}));

// To use the ReactToPrint lib these have to be class based components
// WPO = WithPrintOption
class ReportDetailWPO extends Component {    
    constructor(props){
        super(props);
    }

    render() {
        
        const { data, lookupData, classes } = this.props; 

        return (
            <span>REPORT CONTENT GOES HERE</span>
        )
    }
}


const ReportComponentName = props => {
    const classes = useStyles();
    const componentRef = useRef();
    const { data, lookupData } = props; 

    return (        
        <Fragment>
            <ReactToPrint
                trigger={() => <Button className={classes.print} variant='outlined' color='primary'><PrintIcon fontSize='small'/></Button> }
                content={() => componentRef.current }
            />
            <ReportDetailWPO ref={componentRef} classes={classes} data={data} lookupData={lookupData} />
        </Fragment>
    )
}

export default ReportComponentName;