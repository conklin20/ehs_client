import React, {  } from 'react';
import SafeDaysReport from '../reports/safety/incidents/SafeDaysReport';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(3), 
        overflowY: 'scroll',
        maxHeight: '45vh',
        height: '100%',
        width: '100%',
        paddingRight: '25px',
        boxSizing: 'content-box',
    },
}));

const SafeDays = props => {
    const classes = useStyles(); 	

    const { lookupData, reportData } = props; 

    return (
        <div className={classes.container}>
            <SafeDaysReport
                data={reportData}
                lookupData={lookupData}
            />
        </div>
    )
}

export default SafeDays;