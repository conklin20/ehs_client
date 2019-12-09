import React from 'react';
import { Typography, CircularProgress } from '@material-ui/core';


const GeneratingReport = props => {
    return (
        <div style={{marginTop: '20vh'}} >
            <Typography variant='h5'>Generating Report...</Typography>
            <CircularProgress />
        </div>
    )
}

export default GeneratingReport;