import React, { Component, useEffect, useState, useRef, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import moment from 'moment';
import { Grid, Typography, Button } from '@material-ui/core';
import { ATTR_CATS } from '../../../../helpers/attributeCategoryEnum';
import filterLookupDataByKey  from '../../../../helpers/filterLookupDataByKey';
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
    sectionTitle: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: theme.spacing(2), 
        textDecoration: 'underline',
    },
    reportTitle: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    span: {
        fontWeight: 'bold',
    }, 
    action: {
        borderLeft: 'solid 2px',
        borderLeftColor: 'rgba(0,0,0,.54)',
        marginBottom: theme.spacing(1), 
        paddingLeft: '5px',
    },
    actionToTake: {
    }
}));

// To use the ReactToPrint lib these have to be class based components
// WPO = WithPrintOption
class EventDetailReportWPO extends Component {    
    constructor(props){
        super(props);
    }

    render() {
        
        const { data, lookupData, classes } = this.props; 

        //people involved
        const involvement = lookupData['globalHierarchyAttributes'].filter(attr => attr.key === 'Employee Involvement');
        const peopleInvolved = involvement.map(i => {
            const people = data.peopleInvolved.filter(r => r.roleId === i.hierarchyAttributeId)
            return (
                <Grid item xs={12}>		
                    <Typography variant="body2">
                        <span className={classes.span}> {`${i.value}: `} </span>
                        {`${people.map(p => ' ' + lookupData.employees.find(e => e.employeeId === p.employeeId).fullName)} `}
                    </Typography>	
                </Grid>   
            )      
        })

        //causes
    const immediateCauseList = filterLookupDataByKey(lookupData, ATTR_CATS.IMMEDIATE_CAUSES.lookupDataKey, ATTR_CATS.IMMEDIATE_CAUSES.key, null, true)
    const rootCauseList = filterLookupDataByKey(lookupData, ATTR_CATS.ROOT_CAUSES.lookupDataKey, ATTR_CATS.ROOT_CAUSES.key, null, true)
    const contributingFactorList = filterLookupDataByKey(lookupData, ATTR_CATS.CONTRIBUTING_FACTORS.lookupDataKey, ATTR_CATS.CONTRIBUTING_FACTORS.key, null, true)
    const causes = ['Immediate Causes','Root Causes','Contributing Factors'].map(causeType => {                
        switch(causeType){
            case 'Immediate Causes':
                return (
                    <Grid item xs={12}>		
                        <Typography className={classes.label} variant="body2" >
                            <span className={classes.span}> {`${causeType}: `} </span>
                            {`
                                ${data.causes
                                .filter(c => immediateCauseList.some(icl => icl.value === c.causeId))
                                .map(ic => ' ' + immediateCauseList.find(icl => icl.value === ic.causeId).label)}
                            `}
                        </Typography>	
                    </Grid>  
                );
            case 'Root Causes':
                return (
                    <Grid item xs={12}>		
                        <Typography className={classes.label} variant="body2" >
                            <span className={classes.span}> {`${causeType}: `} </span>
                            {`
                                ${data.causes
                                .filter(c => rootCauseList.some(rcl => rcl.value === c.causeId))
                                .map(rc => ' ' + rootCauseList.find(rcl => rcl.value === rc.causeId).label)}
                            `}
                        </Typography>	
                    </Grid>  
                );
            case 'Contributing Factors':
                return (
                    <Grid item xs={12}>		
                        <Typography className={classes.label} variant="body2" >
                            <span className={classes.span}> {`${causeType}: `} </span>
                            {`
                                ${data.causes
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


        return (
            <div className={classes.reportBody}>			
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant='h6' className={classes.reportTitle}>
                            {`${data.eventType} #${data.eventId}`}
                        </Typography>		
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h6' className={classes.sectionTitle} >
                            Reporting Information
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Reported By: </span>
                            {data.reportedBy === 'N/A' ? 'N/A' : lookupData.employees.find(e => e.employeeId === data.reportedBy).fullName}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Date Reported: </span>
                            { `${moment(data.reportedOn).format('ll')}` }
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Time Reported: </span>
                            { `${moment(data.reportedOn).format('LT')}` }
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Event Status: </span>
                            {data.eventStatus}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant='h6' className={classes.sectionTitle} >
                            Event Location
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Logical Hierarchy: </span>
                            {`${data.site} > ${data.area || 'N/A'} > ${data.department || 'N/A'}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Physical Hierarchy: </span>
                            {`${data.localeSite} > ${data.localePlant || 'N/A'} > ${data.localePlantArea || 'N/A'}`}
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography variant='h6' className={classes.sectionTitle} >
                            Event Detail
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Employee Involved: </span>
                            { lookupData.employees.some(e => e.employeeId === data.employeeId) 
                                ? lookupData.employees.find(e => e.employeeId === data.employeeId).fullName 
                                : `${data.employeeId} - Employee Not Found`}
                        </Typography>	
                    </Grid>      
                    <Grid item xs={8}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Category: </span>
                            { data.resultingCategory && data.resultingCategory !== data.initialCategory ? 
                                `Initial Category - ${data.initialCategory} / Resulting Category - ${data.resultingCategory}`
                                : `Category - ${data.initialCategory}`    
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Date of Event: </span>
                            { `${moment(data.eventDate).format('llll')}` }
                        </Typography>	
                    </Grid>    
                    <Grid item xs={4}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Job Title: </span>
                            {data.jobTitle}
                        </Typography>	
                    </Grid>      
                    <Grid item xs={2}>
                        <Typography variant='body2' >
                            <span className={classes.span}>Shift: </span>
                            {data.shift}
                        </Typography>	
                    </Grid>          
                    <Grid item xs={12}>
                        <Typography variant='body2' >
                            <span className={classes.span}>What Happened: </span>
                            {data.whatHappened}
                        </Typography>	
                    </Grid> 
                    { data.isInjury ?      
                        <Grid item xs={12} >		
                            <Typography variant='body2' >
                                <span className={classes.span}>Injury Information: </span>
                                { `Nature of Injury: ${data.natureOfInjury} - Body Part: ${data.bodyPart}` }
                            </Typography>	
                        </Grid> 
                        : null
                    }   
                    { data.firstAid === true ?      
                        <Grid item xs={12} >		
                            <Typography variant='body2' >
                                <span className={classes.span}>First Aid: </span>
                                { data.firstAidType }
                            </Typography>	
                        </Grid> 
                        : null
                    }   
                    { data.transported === true ?      
                        <Grid item xs={12} >		
                            <Typography variant='body2' >
                                <span className={classes.span}>Transported to: </span>
                                { data.offPlantMedicalFacility }
                            </Typography>	
                        </Grid> 
                        : null
                    }   
                    <Grid item xs={3} >		
                        <Typography variant='body2' >
                            <span className={classes.span}>ER?: </span>
                            {data.er ? 'Yes' : 'No' }
                        </Typography>	
                    </Grid>      
                    <Grid item xs={3} >		
                        <Typography variant='body2' >
                            <span className={classes.span}>Illness?: </span>
                            {data.isIllness ? 'Yes' : 'No' }
                        </Typography>	
                    </Grid>      
                    <Grid item xs={3} >		
                        <Typography variant='body2' >
                            <span className={classes.span}>Lost Time?: </span>
                            {data.lostTime ? 'Yes' : 'No' }
                        </Typography>	
                    </Grid>      
                    <Grid item xs={3} >		
                        <Typography variant='body2' >
                            <span className={classes.span}>Hours Worked: </span>
                            {data.hoursWorkedPrior }
                        </Typography>	
                    </Grid>       
                    <Grid item xs={4} >		
                        <Typography variant='body2' >
                            <span className={classes.span}>Work Environment: </span>
                            {data.workEnvironment }
                        </Typography>	
                    </Grid>      
                    <Grid item xs={4} >		
                        <Typography variant='body2' > 
                            <span className={classes.span}>Material Involved: </span>
                            {data.materialInvolved }
                        </Typography>	
                    </Grid>      
                    <Grid item xs={4} >		
                        <Typography variant='body2' >
                            <span className={classes.span}>Equipment Involved: </span>
                            {data.equipmentInvolved }
                        </Typography>	
                    </Grid>    
                    
                    <Grid item xs={12}>
                        <Typography variant='h6' className={classes.sectionTitle} >
                            Actions
                        </Typography>
                        {
                            data.actions.map(a => {
                                return (			
                                    <Grid container className={classes.action}>
                                        <Grid item xs={4} >		
                                            <Typography variant='body2' >
                                                <span className={classes.span}>Assigned To: </span>
                                                {lookupData.employees.find(e => e.employeeId === a.assignedTo).fullName}
                                            </Typography>	
                                        </Grid>
                                        <Grid item xs={4} >		
                                            <Typography variant='body2' >
                                                <span className={classes.span}>Completed On: </span>
                                                {moment(a.completionDate).format('ll') }
                                            </Typography>	
                                        </Grid>
                                        <Grid item xs={4} >	
                                            <Typography variant='body2' >
                                                <span className={classes.span}>Approved On: </span>
                                                {moment(a.approvalDate).format('ll') }
                                            </Typography>	
                                        </Grid>  
                                        <Grid item xs={12} >	
                                            <Typography variant='body2' >
                                                <div className={classes.actionToTake}>                                                    
                                                    <span className={classes.span}>Action To Take: </span>
                                                    {a.actionToTake}
                                                </div>                                                
                                            </Typography>	
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                    

                    <Grid item xs={12}>
                        <Typography variant='h6' className={classes.sectionTitle} >
                            People Involved
                        </Typography>
                        {peopleInvolved}
                    </Grid>
                                    
                    <Grid item xs={12}>
                        <Typography variant='h6' className={classes.sectionTitle} >
                            Causes
                        </Typography>
                        {causes}
                    </Grid>
                    
                </Grid>
            </div>
        )
    }
}


const EventDetailReport = props => {
    const classes = useStyles();
    const componentRef = useRef();
    const { data, lookupData } = props; 

    return (        
        <Fragment>
            <ReactToPrint
                trigger={() => <Button className={classes.print} variant='outlined' color='primary'><PrintIcon fontSize='small'/></Button> }
                content={() => componentRef.current }
            />
            <EventDetailReportWPO ref={componentRef} classes={classes} data={data[0]} lookupData={lookupData} />
        </Fragment>
    )
}

export default EventDetailReport;