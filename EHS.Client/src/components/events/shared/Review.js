import React, { Fragment } from 'react';
import { Typography, Grid,  Divider, Button } from '@material-ui/core'; 
import Moment from 'react-moment'; 
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import filterLookupDataByKey from '../../../helpers/filterLookupDataByKey';
import { S_I_STATUS } from '../../../helpers/eventStatusEnum';
import { ATTR_CATS } from '../../../helpers/attributeCategoryEnum';
import EventDetailReport from '../../reports/safety/incidents/EventDetailReport';

const useStyles = makeStyles(theme => ({
    sectionTitle: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: theme.spacing(3), 
        textDecoration: 'underline',
    },
    span: {
        fontWeight: 'bold',
    }, 
    actionItem: {
        // display: 'flex', 
        // justifyContent: 'space-between'
    },
    submitBtn: {
        margin: theme.spacing(2, 0), 
    },
}));

const Review = (props) => {
    const classes = useStyles();    

    const { event, lookupData, currentUser, handleSubmit } = props; 

    const files = event.files.map(f => {    
        return (
            <Grid item key={f.eventFileId} xs={12}>		
                <Typography className={classes.label} variant="body1" gutterBottom>
                    {f.userFileName}
                </Typography>	
            </Grid>   
        )      
    })

    // console.log(event)
    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Review Event
            </Typography>
            <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                Instructions: Review all event information for accuracy. If this is a Draft, you can submit it from here. 
            </Typography>     
            
            <EventDetailReport
                data={[event]}
                lookupData={lookupData}
            />  
            
            <Grid container spacing={2}>                     
                <Grid item xs={12}>
                    <Typography variant='h6' className={classes.sectionTitle} >
                        Files
                    </Typography>
                </Grid>  
                {files}
            </Grid>
            
            <Divider />

            <Button 
                variant='contained'
                color='primary'
                className={classes.submitBtn}
                onClick={handleSubmit}
                fullWidth
                disabled={event.eventStatus !== S_I_STATUS.DRAFT ? true : false}
                >
                { event.eventStatus === S_I_STATUS.DRAFT
                    ? 'Submit Event'
                    : event.eventStatus === S_I_STATUS.OPEN
                        ? 'Event Already Submitted' 
                        : 'Event Closed'
                }
            </Button>

        </Fragment>
    );
}	

function mapStateToProps(state) {
	// console.log(state)
	return {
			lookupData: state.lookupData,
			currentUser: state.currentUser,
	};
}

export default connect(mapStateToProps, { 
    
})(Review); 
