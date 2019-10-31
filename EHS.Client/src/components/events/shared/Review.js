import React, { Fragment } from 'react';
import { Typography, Grid,  Divider, Button } from '@material-ui/core'; 
import Moment from 'react-moment'; 
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import filterLookupDataByKey from '../../../helpers/filterLookupDataByKey';


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

    const actions = event.actions.map((a, i) => {
        return (
            <Fragment >
                <Grid item xs={1}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span className={classes.span}> {i+1} </span>
                    </Typography>	
                </Grid>   
                <Grid item xs={6} md={3}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span className={classes.span}>Assigned To: </span>
                        {lookupData.employees.find(e => e.employeeId === a.assignedTo).fullName}
                    </Typography>	
                </Grid>   
                <Grid item xs={6} md={2}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Due Date: </span>
                        <Moment format={currentUser.user.dateFormat || 'MM/DD/YYYY'}>
                            {a.dueDate}
                        </Moment>                  
                    </Typography>	
                </Grid>  
                <Grid item xs={6} md={3}>	
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Completion Date: </span>
                        <Moment format={currentUser.user.dateFormat || 'MM/DD/YYYY'}>
                            {a.completionDate}
                        </Moment>                  
                    </Typography>	
                </Grid>  
                <Grid item xs={6} md={3}>	
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>ApprovalDate Date: </span>
                        <Moment format={currentUser.user.dateFormat || 'MM/DD/YYYY'}>
                            {a.approvalDate}
                        </Moment>                  
                    </Typography>	
                </Grid>  
                <Grid item xs={1}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span className={classes.span}>__________ </span>
                    </Typography>	
                </Grid>   
                <Grid item xs={11} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span className={classes.span}>Action to Take/Taken: </span>
                        {a.actionToTake}
                    </Typography>	
                </Grid>
                <Divider />
            </Fragment>     
        )
    })

    const involvement = lookupData['logicalHierarchyAttributes'].filter(attr => attr.key === 'Employee Involvement');
    const peopleInvolved = involvement.map(i => {

        const people = event.peopleInvolved.filter(r => r.roleId === i.hierarchyAttributeId)

        return (
            <Grid item xs={12}>		
                <Typography className={classes.label} variant="body1" gutterBottom>
                    <span className={classes.span}> {`${i.value}: `} </span>
                    {`${people.map(p => ' ' + lookupData.employees.find(e => e.employeeId === p.employeeId).fullName)} `}
                </Typography>	
            </Grid>   
        )      
    })

    const immediateCauseList = filterLookupDataByKey(props.lookupData, 'logicalHierarchyAttributes', 'Immediate Causes', null, true)
    const rootCauseList = filterLookupDataByKey(props.lookupData, 'logicalHierarchyAttributes', 'Root Causes', null, true)
    const contributingFactorList = filterLookupDataByKey(props.lookupData, 'logicalHierarchyAttributes', 'Contributing Factors', null, true)
    const causes = ['Immediate Causes','Root Causes','Contributing Factors'].map(causeType => {                
        switch(causeType){
            case 'Immediate Causes':
                return (
                    <Grid item xs={12}>		
                        <Typography className={classes.label} variant="body1" gutterBottom>
                            <span className={classes.span}> {`${causeType}: `} </span>
                            {`
                                ${event.causes
                                .filter(c => immediateCauseList.some(icl => icl.value === c.causeId))
                                .map(ic => ' ' + immediateCauseList.find(icl => icl.value === ic.causeId).label)}
                            `}
                        </Typography>	
                    </Grid>  
                );
            case 'Root Causes':
                return (
                    <Grid item xs={12}>		
                        <Typography className={classes.label} variant="body1" gutterBottom>
                            <span className={classes.span}> {`${causeType}: `} </span>
                            {`
                                ${event.causes
                                .filter(c => rootCauseList.some(rcl => rcl.value === c.causeId))
                                .map(rc => ' ' + rootCauseList.find(rcl => rcl.value === rc.causeId).label)}
                            `}
                        </Typography>	
                    </Grid>  
                );
            case 'Contributing Factors':
                return (
                    <Grid item xs={12}>		
                        <Typography className={classes.label} variant="body1" gutterBottom>
                            <span className={classes.span}> {`${causeType}: `} </span>
                            {`
                                ${event.causes
                                .filter(c => contributingFactorList.some(cfl => cfl.value === c.causeId))
                                .map(cf => ' ' + contributingFactorList.find(cfl => cfl.value === cf.causeId).label)}
                            `}
                        </Typography>	
                    </Grid>  
                );
            default: 
                console.log(`Invalid Type: ${causeType}`)
                return causeType
        }
    })

    const files = event.files.map(f => {        
        return (
            <Grid item xs={12}>		
                <Typography className={classes.label} variant="body1" gutterBottom>
                    {f.userFileName}
                </Typography>	
            </Grid>   
        )      
    })

    // console.log(lookupData)
    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Review Event
            </Typography>
            <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                Instructions: Review all event information for accuracy. If this is a Draft, you can submit it from here. 
            </Typography>       
            <Divider />    						
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h6' className={classes.sectionTitle} >
                        Reporting Information
                    </Typography>
                </Grid>
                <Grid item xs={6} md={3}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span className={classes.span}>Reported By: </span>
                        {lookupData.employees.find(e => e.employeeId === event.reportedBy).fullName}
                    </Typography>	
                </Grid>      
                <Grid item xs={6} md={3}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Date Reported: </span>
                        <Moment format={currentUser.user.dateFormat || 'MM/DD/YYYY'}>
                            {event.reportedOn}
                        </Moment>                  
                    </Typography>	
                </Grid>       
                <Grid item xs={6} md={3}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Time Reported: </span>
                        <Moment format="LTS" add={{ hours: currentUser.user.timeZone}}>
                            {event.reportedOn}
                        </Moment>	                     
                    </Typography>	
                </Grid>     
                <Grid item xs={6} md={3}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>   
                        <span className={classes.span}>Event Status: </span>
                        {event.eventStatus}               
                    </Typography>	
                </Grid>        
            </Grid>	
            
            <Divider />    		

            <Grid container spacing={2}>                
                <Grid item xs={12}>
                    <Typography variant='h6' className={classes.sectionTitle} >
                        Event Location
                    </Typography>
                </Grid>
                <Grid item xs={6}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span className={classes.span}>Logical/Reporting Location: </span>
                        {`${event.site} > ${event.area} > ${event.department}`}
                    </Typography>	
                </Grid>      
                <Grid item xs={6} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Physical Location: </span>
                        {`${event.localeSite} > ${event.localePlant} > ${event.localePlantArea}`}
                    </Typography>	
                </Grid>       
            </Grid>
            
            <Divider />    		

            <Grid container spacing={2}>                
                <Grid item xs={12}>
                    <Typography variant='h6' className={classes.sectionTitle} >
                        Event Details
                    </Typography>
                </Grid>
                <Grid item xs={12}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span className={classes.span}>Category: </span>
                        {event.resultingCategory !== event.initialCategory && event.resultingCategory ? 
                            `Initial Category - ${event.initialCategory} / Resulting Category - ${event.resultingCategory}`
                            : `Resulting Category - ${event.resultingCategory}`    
                        }
                    </Typography>	
                </Grid>      
                <Grid item xs={6} md={3}>		
                    <Typography className={classes.label} variant="body1" gutterBottom>
                        <span className={classes.span}>Date of Event: </span>
                        {event.eventDate}
                        {/* <Moment format={currentUser.user.dateFormat || 'MM/DD/YYYY'}>
                            {event.eventDate}
                        </Moment>             */}
                    </Typography>	
                </Grid>      
                <Grid item xs={6} md={3} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Employee Involved: </span>
                        { lookupData.employees.some(e => e.employeeId === event.employeeId) 
                            ? lookupData.employees.find(e => e.employeeId === event.employeeId).fullName 
                            : `${event.employeeId} - Employee Not Found`}
                    </Typography>	
                </Grid>      
                <Grid item xs={6} md={3} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Shift: </span>
                        {event.shift}
                    </Typography>	
                </Grid>      
                <Grid item xs={6} md={3} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Job Title: </span>
                        {event.jobTitle}
                    </Typography>	
                </Grid>        
                <Grid item xs={12} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>What Happened: </span>
                        {event.whatHappened}
                    </Typography>	
                </Grid> 
                { event.isInjury ?      
                    <Grid item xs={12} >		
                        <Typography className={classes.label} variant="body1" gutterBottom>  
                            <span className={classes.span}>Injury Information: </span>
                            { `Nature of Injury: ${event.natureOfInjury} - Body Part: ${event.bodyPart}` }
                        </Typography>	
                    </Grid> 
                    : null
                }   
                { event.firstAid === true ?      
                    <Grid item xs={12} >		
                        <Typography className={classes.label} variant="body1" gutterBottom>  
                            <span className={classes.span}>First Aid: </span>
                            { event.firstAidType }
                        </Typography>	
                    </Grid> 
                    : null
                }   
                { event.transported === true ?      
                    <Grid item xs={12} >		
                        <Typography className={classes.label} variant="body1" gutterBottom>  
                            <span className={classes.span}>Transported to: </span>
                            { event.offPlantMedicalFacility }
                        </Typography>	
                    </Grid> 
                    : null
                }   
                <Grid item xs={3} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>ER?: </span>
                        {event.er ? 'Yes' : 'No' }
                    </Typography>	
                </Grid>      
                <Grid item xs={3} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Illness?: </span>
                        {event.isIllness ? 'Yes' : 'No' }
                    </Typography>	
                </Grid>      
                <Grid item xs={3} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Lost Time?: </span>
                        {event.lostTime ? 'Yes' : 'No' }
                    </Typography>	
                </Grid>      
                <Grid item xs={3} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Hours Worked: </span>
                        {event.hoursWorkedPrior }
                    </Typography>	
                </Grid>       
                <Grid item xs={4} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Work Environment: </span>
                        {event.workEnvironment }
                    </Typography>	
                </Grid>      
                <Grid item xs={4} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Material Involved: </span>
                        {event.materialInvolved }
                    </Typography>	
                </Grid>      
                <Grid item xs={4} >		
                    <Typography className={classes.label} variant="body1" gutterBottom>  
                        <span className={classes.span}>Equipment Involved: </span>
                        {event.equipmentInvolved }
                    </Typography>	
                </Grid>      
            </Grid>
            
            <Divider />    		

            <Grid container spacing={2}>                     
                <Grid item xs={12}>
                    <Typography variant='h6' className={classes.sectionTitle} >
                        Actions
                    </Typography>
                </Grid>  
                {actions}
            </Grid>            
            
            <Divider />    		

            <Grid container spacing={2}>                     
                <Grid item xs={12}>
                    <Typography variant='h6' className={classes.sectionTitle} >
                        People Involved
                    </Typography>
                </Grid>  
                {peopleInvolved}
            </Grid>       
            
            <Divider />    		

            <Grid container spacing={2}>                     
                <Grid item xs={12}>
                    <Typography variant='h6' className={classes.sectionTitle} >
                        Causes
                    </Typography>
                </Grid>  
                {causes}
            </Grid>
            
            <Divider />    		

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
                disabled={event.eventStatus === 'Closed' || event.eventStatus === 'Cancelled' ? true : false}
                >
                { event.eventStatus === 'Draft' 
                    ? 'Submit Event'
                    : event.eventStatus === 'Open'
                        ? 'Update Event' 
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
