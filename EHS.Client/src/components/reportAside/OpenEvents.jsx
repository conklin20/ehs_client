import React, {  } from 'react';
import OpenEventsReport from '../reports/safety/incidents/OpenEventsReport';
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
        textAlign: 'left'
        // backgroundColor: theme.palette.background.paper,
    },
}));

const OpenEvents = props => {
    const classes = useStyles(); 	

    const { lookupData, reportData } = props; 

    return (
        <div id='openEventsAside' className={classes.container}>
            <OpenEventsReport
                data={reportData}
                lookupData={lookupData}
                width={300}
                height={500}
                divElement='openEventsAside'
            />
        </div>
    )
}

export default OpenEvents;