import React, { useState, useEffect, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Link } from 'react-router-dom'; 
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import { fetchSafetyIncidents } from '../../../../store/actions/safetyIncidents';
import { 
	fetchLogicalHierarchyTree, 
    fetchPhysicalHierarchyTree, 
    fetchGlobalHierarchyAttributes,
	fetchLogicalHierarchyAttributes, 
    fetchPhysicalHierarchyAttributes, 
    fetchEmployees, 
 } from '../../../../store/actions/lookupData'; 
import { 
    postNewSafetyIncident, 
    updateSafetyIncident,
    fetchEvent
} from '../../../../store/actions/safetyIncidents'; 
import { fetchActionsByEventId } from '../../../../store/actions/actions'; 
import { fetchPeopleByEventId } from '../../../../store/actions/peopleInvolved'; 
import { fetchCausesByEventId } from '../../../../store/actions/causes';
import { fetchFilesByEventId } from '../../../../store/actions/media';  
import { addNotification } from '../../../../store/actions/notifications'
import ReportingInformation from '../../shared/ReportingInformation'; 
import EventLocation from '../../shared/EventLocation'; 
import SIEventDetails from './SIEventDetails'; 
import Actions from '../../shared/Actions'; 
import Causes from '../../shared/Causes'; 
import PeopleInvolved from '../../shared/PeopleInvolved'; 
import Media from '../../shared/Media';
import Review from '../../shared/Review'
import { 
	Button, 
	Dialog,
	DialogActions, 
	DialogContent, 
	DialogTitle, 
    Step,
    Stepper, 
    StepButton,
	Typography,
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { 
    EVENT_ACTION_REQUIRED, 
    EVENT_PEOPLE_REQUIRED, 
    EVENT_CAUSES_REQUIRED, 
    EVENT_LOGICAL_HIERARCHY_REQUIRED, 
    EVENT_PHSYICAL_HIERARCHY_REQUIRED, 
    EVENT_CATEGORY_REQUIRED,
    EVENT_INVALID,
    EVENT_SUBMITTED,
    EVENT_ALREADY_SUBMITTED,
    EVENT_UPDATE_FAILED,
    EVENT_DRAFT_FAILED,
    EVENT_UPDATE_SUCCESS, 
} from '../../../../helpers/notificationMessages';
import { S_I_STATUS } from '../../../../helpers/eventStatusEnum';

const useStyles = makeStyles(theme => ({
	root: {
        flexGrow: 1,
    },
    dialogTitle: {
        display: 'flex', 
        justifyContent: 'space-between', 

    },
    content: {
        minHeight: '500px'
    },
	container: {
        display: 'flex',
        flexWrap: 'wrap',
	},
    label: {
        margin: theme.spacing(1),
    },
    caption: {
        margin: theme.spacing(1),
    },
	dense: {
	    marginTop: theme.spacing(2),
	},  
	form: {
		margin: 'auto',
        // width: 'fit-content',
        height: '70vh',
      },
	formControl: {
		marginTop: theme.spacing(2),
		marginRight: theme.spacing(1),
		minWidth: 250,
	},
		formControlLabel: {
		// marginTop: theme.spacing(1),
    },	
    slider: {
        width: 250,
    },
	sectionHeading: {
		fontStyle: 'italic'
    }, 
    sectionBody: {        
        height: '80%',
		display: 'flex',
		flexDirection: 'column',
        justifyContent: 'space-between',
    },
    button: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    completed: {
      display: 'inline-block',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    divider: {
        marginTop: '15px',
        marginBottom: '15px',
    }, 
    safetySection: {
        margin: theme.spacing(2),
    }
  }));

const getSteps = () => {
    return [
        'Reporting Information',
        'Event Location',
        'Event Details',
        'Actions', 
        'People Involved', 
        'Causes',
        'Media', 
        'Review'
    ]
}

// All of the State related to an event needs to live here
const SafetyEventForm = props => {
    const classes = useStyles();
    
    const [activeStep, setActiveStep] = useState(props.match.params.stepNo - 1 || 0);
    const [completed, setCompleted] = useState(new Set());
    const steps = getSteps();

    const { currentUser, lookupData } = props
    
    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {

        fetchData(); 
    
		return () => {            
            //should probably handle this differently, but for now will revert the search back to Open incidents when this form unmounts
            props.fetchSafetyIncidents('?eventStatuses=Open')
			console.log('SafetyEventForm Unmounting...')
		}
	}, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 
    
    
    const [event, setEvent] = useState({})

	const fetchData = async () => {
        //if existing event, get event detail from api
        if(props.match.params.eventId) setEvent(await props.fetchEvent(props.match.params.eventId))
                        
        const timestamp = moment.utc().format(); 
        //if this is a new event form, and the lookup data has been loaded, set the initial values for the evnt 
        if(props.match.path.includes('/events/si/new')){
            setEvent({
                eventType: 'Safety Incident', 
                reportedBy: currentUser.user.userId,
                reportedOn: timestamp, 
                createdBy:  currentUser.user.userId, 
                eventStatus: S_I_STATUS.DRAFT,   
                // departmentId: currentUser.user.logicalHierarchyId, 
                // localeId: currentUser.user.physicalHierarchyId,
                eventDate: timestamp, 
                hoursWorkedPrior: .5, 
                //defaulting an empty array for actions, people, causes, and files
                actions: [], 
                peopleInvolved: [], 
                causes: [], 
                files: []
            })
        }
        
        //fetch lookupData IF it doesnt already exist in redux
		if(!lookupData.employees) props.fetchEmployees();
		if(!lookupData.logicalHierarchies ) props.fetchLogicalHierarchyTree(currentUser.user.logicalHierarchyPath.split('|')[currentUser.user.logicalHierarchyPath.split('|').length-1]);
		if(!lookupData.physicalHierarchies) props.fetchPhysicalHierarchyTree(currentUser.user.physicalHierarchyPath.split('|')[currentUser.user.physicalHierarchyPath.split('|').length-1]);
		if(!lookupData.globalHierarchyAttributes) props.fetchGlobalHierarchyAttributes(1000, 'singlepath', '?attributetype=global&enabled=true'); //first arg will be the root hierarchy
		if(!lookupData.logicalHierarchyAttributes) props.fetchLogicalHierarchyAttributes(event.departmentId || currentUser.user.logicalHierarchyId, 'singlepath', '?attributetype=logical&enabled=true');
        if(!lookupData.physicalHierarchyAttributes) props.fetchPhysicalHierarchyAttributes(event.localeId || currentUser.user.physicalHierarchyId, 'singlepath', '?attributetype=physical&enabled=true');
            
    }
    
    //function to check if all data has been loaded/returned from the API. only then can the user navigate around the form 
    const dataIsLoading = () =>  {
        return Object.keys(lookupData).length < 6 ? true : false
    }

    // const [actions, setActions] = useState(event ? event.actions : null);

    // Handle field change 
    const handleChange = (section, input) => e => {
        setEvent({ ...event, [input]: e.target.type === 'checkbox' ? e.target.checked : e.target.value})
    }

    //for the react-select (single) component
    const handleAutoCompleteChange = (state, action)  => {
        setEvent({ ...event, [action.name]: state.value });
    }

    const handleSliderChange = (e, value) => {
        setEvent({ ...event, hoursWorkedPrior: value })
    }

    const handleRefreshData = () => {
        props.fetchLogicalHierarchyAttributes(event.departmentId || currentUser.user.logicalHierarchyId, 'singlepath', '?attributetype=logical&enabled=true');
        props.fetchPhysicalHierarchyAttributes(event.localeId || currentUser.user.physicalHierarchyId, 'singlepath', '?attributetype=physical&enabled=true');

    }

    //Code copied from material-ui for the stepping functionality   
    const totalSteps = () => {
        return getSteps().length;
    }
    
    const completedSteps = () => {
        return completed.size; 
    }

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps(); 
    }
    
    const isLastStep = () => {
      return activeStep === totalSteps() - 1;
    }
  
    const handleNext = () => {
      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? // It's the last step, but not all steps have been completed
            // find the first step that has been completed
            steps.findIndex((step, i) => !completed.has(i))
          : activeStep + 1;
  
      setActiveStep(newActiveStep);
    }
  
    const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    }
  
    const handleStep = step => () => {
      setActiveStep(step);
    };

    const handleComplete = () => {
        //if on step 1 (Event Location), dont let user proceed with selecting a logical hierarchy 
        if(activeStep+1 === 2 && !event.departmentId) {
            return props.addNotification(EVENT_LOGICAL_HIERARCHY_REQUIRED, 'error')
        }
        //if on step 1 (Event Location), dont let user proceed with selecting a physical hierarchy 
        if(activeStep+1 === 2 && !event.localeId) {
            return props.addNotification(EVENT_PHSYICAL_HIERARCHY_REQUIRED, 'error')
        }

        const newCompleted = new Set(completed);
        newCompleted.add(activeStep);
        setCompleted(newCompleted);
        
        if (completed.size !== totalSteps() ) {
            handleNext();
        }
    }
    
    const isStepComplete = (step) => {
        return completed.has(step);
    }  
    
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <ReportingInformation 
                            useStyles={useStyles} 
                            currentUser={currentUser}
                            lookupData={lookupData} 
                            event={event}
                        />
            case 1: 
                return <EventLocation 
                            useStyles={useStyles} 
                            lookupData={lookupData} 
                            currentUser={currentUser}
                            event={event}
                            handleAutoCompleteChange={handleAutoCompleteChange}
                            handleRefreshData={handleRefreshData}
                        />        
            case 2: 
                return <SIEventDetails 
                            useStyles={useStyles} 
                            lookupData={lookupData} 
                            event={event}
                            currentUser={currentUser}
                            handleChange={handleChange}
                            handleAutoCompleteChange={handleAutoCompleteChange}
                            handleSliderChange={handleSliderChange}
                        />             
            case 3: 
                return <Actions  
                            useStyles={useStyles} 
                            event={event}
                            refreshActions={refreshActions}
                        />        
            case 4: 
                return <PeopleInvolved 
                            useStyles={useStyles} 
                            event={event}
                            refreshPeopleInvolved={refreshPeopleInvolved}
                        />     
            case 5: 
                return <Causes  
                            useStyles={useStyles} 
                            event={event}
                            refreshCauses={refreshCauses}
                        />     
            case 6: 
                return <Media  
                            useStyles={useStyles} 
                            event={event}
                            refreshEventFiles={refreshEventFiles}
                        />     
            case 7: 
                return <Review 
                            useStyles={useStyles}
                            lookupData={lookupData} 
                            event={event}
                            handleSubmit={handleSubmit}
                        />     
            default:
                props.addNotification('Unkown Step', 'warning'); 
                return 'Unknown Step';
        }
    }

    const refreshActions = () => {
        props.fetchActionsByEventId(event.eventId)
            .then(res => {
                //update the actions property since its changed
                if(res.status === 200){
                    setEvent({ ...event, actions: res.data});
                } else {
                    console.log(`Expected Status Code 200. Received ${res.status}`);
                }
            })
    };

    const refreshPeopleInvolved = () => {
        props.fetchPeopleByEventId(event.eventId)
            .then(res => {
                //update the peopleInvolved property since its changed 
                if(res.status === 200){
                    setEvent({ ...event, peopleInvolved: res.data});
                } else {
                    console.log(`Expected Status Code 200. Received ${res.status}`);
                }
            })
    };

    const refreshCauses = () => {
        props.fetchCausesByEventId(event.eventId)
            .then(res => {
                //update the cause list since its changed 
                if(res.status === 200){
                    setEvent({ ...event, causes: res.data});
                } else {
                    console.log(`Expected Status Code 200. Received ${res.status}`); 
                }
            })
    };

    const refreshEventFiles = () => {
        props.fetchFilesByEventId(event.eventId)
            .then(files => {
                //update the file list since its changed 
                setEvent({ ...event, files: files});
            })
            .catch(err => {
                console.log(`fetchFilesByEventId rejected promise:`, err); 
            });
    };
    
    const handleSaveDraft = e => {
        //if this event doesnt have an Id, it means its new and we need to post a new event 
        if(handleValidateDraftForm()){
            if(!event.hasOwnProperty('eventId')) {
                props.postNewSafetyIncident(event)
                    .then(res => {
                        //201, Created
                        if(res.status === 201){
                            // setEvent( { ...event, ...res.data} ) 
                            //On initial save, get the event from the db we need fields that arent returned from the insert 
                            props.fetchEvent(res.data.eventId)
                                .then(res => {
                                    setEvent( { supervisorId: event.supervisorId
                                                , reportedOn: moment.utc(res.reportedOn).format()
                                                , ...res } )
                                })
                            // handleComplete();
                        } else {
                            props.addNotification(EVENT_DRAFT_FAILED.replace('{0}', event.eventId), 'info')
                            console.log(`Failed to save draft: ${res.status}`)
                        }
                    });        
            } else if(handleValidateDraftForm()) {
                //update event 
                props.updateSafetyIncident(event, currentUser.user.userId)
                    .then(res => {
                        if(res.status === 202) {
                            setEvent( { ...event, ...res.data } )
                            handleComplete();
                        } else {
                            props.addNotification(EVENT_UPDATE_FAILED.replace('{0}', event.eventId), 'info')
                            console.log(`Failed to update draft: ${res.status}`)
                        }
                    })
            }
            else {
                props.addNotification(EVENT_INVALID, 'error')
            }
        }
    }
    
    //updating an open event 
    const handleSaveOpen = e => {
        e.preventDefault();
        
        if(handleValidateCompletedForm()) {            
            props.updateSafetyIncident(event, currentUser.user.userId)
                .then(res => {
                    if(res.status === 202) {
                        setEvent( { ...event, ...res.data } );
                        props.addNotification(EVENT_UPDATE_SUCCESS.replace('{0}', event.eventId), 'info');
                    } else {
                        // props.addNotification(EVENT_SUBMITTED.replace('{0}', event.eventId), 'error')
                        console.log(`Failed to submit draft: Failed with status ${res.response.status} (${res.response.statusText})`);
                    }
                })
        } else {
            props.addNotification(EVENT_UPDATE_FAILED.replace('{0}', event.eventId), 'info');
        }
        
    }
    
    const handleSubmit = e => {
        e.preventDefault();

        //shouldnt be able to Submit anything but a draft anyways, but this is a safeguard against that 
        if(event.eventStatus === S_I_STATUS.DRAFT && handleValidateCompletedForm()) {
            // change status to Open
            event.eventStatus = S_I_STATUS.OPEN;
            
            props.updateSafetyIncident(event, currentUser.user.userId)
                .then(res => {
                    if(res.status === 202) {
                        setEvent( { ...event, ...res.data } )
                        props.addNotification(EVENT_SUBMITTED.replace('{0}', event.eventId), 'success')
                        props.history.push('/dashboard')
                    } else {
                        // props.addNotification(EVENT_SUBMITTED.replace('{0}', event.eventId), 'error')
                        setEvent( { ...event, eventStatus: S_I_STATUS.DRAFT })
                        console.log(`Failed to submit draft: Failed with status ${res.response.status} (${res.response.statusText})`)
                    }
                })
        } else {
            if(event.eventStatus !== S_I_STATUS.DRAFT){
                props.addNotification(EVENT_ALREADY_SUBMITTED.replace('{0}', event.eventId), 'info')
            }
        }
    }
    
    //the web api/server will do most of the validation for us against the Event fields. However, it will not validate the relational tables (Actions, People, Causes, Media)
    const handleValidateDraftForm = () => {
        const validationErrors = [];
        if(!event.departmentId)
        {
            validationErrors.push(EVENT_LOGICAL_HIERARCHY_REQUIRED)
        }
        if(!event.localeId){
            validationErrors.push(EVENT_PHSYICAL_HIERARCHY_REQUIRED)
        }
        if(!event.initialCategory) {
            validationErrors.push(EVENT_CATEGORY_REQUIRED)
        }

        if (validationErrors.length > 0 ) {
            props.addNotification(validationErrors.join(), 'error')
            return false
        }
        
        return true
    }    

    //the web api/server will do most of the validation for us against the Event fields. However, it will not validate the relational tables (Actions, People, Causes, Media)
    const handleValidateCompletedForm = () => {
        const validationErrors = []; 
        if(!event.actions.length > 0) {
            validationErrors.push(EVENT_ACTION_REQUIRED)
        }

        if(!event.peopleInvolved.length > 0) {
            validationErrors.push(EVENT_PEOPLE_REQUIRED)
        }

        if(!event.causes.length > 0) {
            validationErrors.push(EVENT_CAUSES_REQUIRED)
        }

        if (validationErrors.length > 0 ) {
            props.addNotification(validationErrors.join(), 'error')
            return false
        }
        
        return true
    }

    // console.log(event)
	return (
		<div className={classes.root}>
            { (event && Object.keys(event).length) || (props.match.path.includes('/si/new'))  ?             
                <Dialog 
                    open={true} 
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}
                    maxWidth="lg"
                >
                    <DialogTitle id="form-dialog-title" >                       
                        <div className={classes.dialogTitle} >
                            { event.eventStatus ? `${event.eventType} - ${event.eventId || ' New '} - ${event.eventStatus}` : 'Loading Data...'} 
                        
                            <Link to='/dashboard'>
                                <Icon color="secondary" fontSize="large">
                                    cancel_circle
                                </Icon>
                            </Link>
                        </div>
                    </DialogTitle>
                    <DialogContent className={classes.content}>
                    { dataIsLoading() ?                              
                                
                            <Typography variant='h6'>
                                    Background Data Still Loading...
                            </Typography>	
                            :
                            <div className={classes.form} >                        
                                <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                                    {steps.map((label, index) => {
                                        const stepProps = {};
                                        const buttonProps = {};
                                        return (
                                            <Step key={label} {...stepProps}>
                                            <StepButton
                                                onClick={handleStep(index)}
                                                completed={isStepComplete(index)}
                                                disabled={dataIsLoading()}
                                                {...buttonProps}
                                            >
                                                {label}
                                            </StepButton>
                                            </Step>
                                        );
                                    })}
                                </Stepper>

                                <Fragment>
                                    {allStepsCompleted() ? (
                                    <div>
                                        <Typography className={classes.instructions}>
                                        All steps completed - you&apos;re finished
                                        </Typography>
                                        {/* <Button onClick={handleReset}>Reset</Button> */}
                                        {/* <Button >Save Draft</Button> */}
                                        <Button color="primary" type="submit">Submit</Button>
                                    </div>
                                    ) : (
                                        <div className={classes.sectionBody}>
                                            <div>
                                                <Typography className={classes.instructions}>
                                                    { 
                                                        getStepContent(activeStep)
                                                    }
                                                </Typography>
                                            </div>
                                            <div>
                                                <Button 
                                                    disabled={activeStep === 0 || dataIsLoading()} 
                                                    onClick={handleBack} 
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                                {event.eventStatus === S_I_STATUS.DRAFT
                                                    ?
                                                        activeStep < steps.length-1
                                                        ?
                                                            activeStep > 1 
                                                                ?                                                             
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        onClick={handleSaveDraft}
                                                                        className={classes.button}
                                                                    >
                                                                        {event.eventId ? 'Save & Continue' : 'Submit Draft' }
                                                                    </Button>
                                                                :
                                                                    activeStep !== steps.length &&
                                                                        (completed.has(activeStep) ? (
                                                                        <Typography variant="caption" className={classes.completed}>
                                                                            Step {activeStep + 1} already completed
                                                                        </Typography>
                                                                        ) : (
                                                                        <Button 
                                                                            variant="contained" 
                                                                            color="primary"
                                                                            onClick={handleComplete}
                                                                            disabled={dataIsLoading()}
                                                                        >
                                                                            {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                                                                        </Button>
                                                                    ))
                                                        : null
                                                    :
                                                    <Fragment>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleNext}
                                                            className={classes.button}
                                                            disabled={dataIsLoading()}
                                                        >
                                                            Next
                                                        </Button>        
                                                        {event.eventStatus === S_I_STATUS.OPEN
                                                            ?                                   
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={handleSaveOpen}
                                                                    className={classes.button}
                                                                >
                                                                    {'Save Changes'}
                                                                </Button>
                                                            : null 
                                                        }       
                                                    </Fragment>
                                                }
                                                        
                                            </div>
                                        </div>
                                    )}
                                </Fragment>
                            </div>	
                        }			
                    </DialogContent>
                    <DialogActions>
                        {/* <Button onClick={close} color="primary">
                            Search!
                        </Button> */}
                    </DialogActions>
                </Dialog>
            
            : null}
		</div>
	);
}

function mapStateToProps(state) {
	return {
			lookupData: state.lookupData,
            currentUser: state.currentUser,
            event: state.event, 
	};
}

// INFO on how this works - https://react-redux.js.org/using-react-redux/connect-mapdispatch
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchEmployees,
        fetchLogicalHierarchyTree, 
        fetchPhysicalHierarchyTree, 
        fetchGlobalHierarchyAttributes,
        fetchLogicalHierarchyAttributes, 
        fetchPhysicalHierarchyAttributes,
        fetchSafetyIncidents,
        postNewSafetyIncident,
        updateSafetyIncident,
        fetchEvent,
        fetchActionsByEventId,
        fetchPeopleByEventId,
        fetchCausesByEventId, 
        fetchFilesByEventId,
        addNotification
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SafetyEventForm); 