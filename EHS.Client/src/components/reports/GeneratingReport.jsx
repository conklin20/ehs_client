import React from 'react';
import { Typography, CircularProgress } from '@material-ui/core';


const GeneratingReport = props => {
    return (
        <div style={{marginTop: '20vh', minHeight: '60vh'}} >
            <Typography variant='h5' style={{margin: '10px'}}>Generating Report...</Typography>
            <CircularProgress />
        </div>
    )
}

export default GeneratingReport;