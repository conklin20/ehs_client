import React, { useState, useEffect, Fragment } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom'; 
import { makeStyles } from '@material-ui/core/styles';
import { 
	fetchLogicalHierarchyTree, 
	fetchPhysicalHierarchyTree, 
	fetchLogicalHierarchyAttributes, 
    fetchPhysicalHierarchyAttributes, 
    fetchEmployees, 
 } from '../../../../store/actions/lookupData'; 
import { 
    postNewSafetyIncident, 
    updateSafetyIncident,
    fetchEvent
} from '../../../../store/actions/safetyIncidents'; 
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
	// DialogContentText, 
	DialogTitle, 
    Step,
    Stepper, 
    StepButton,
	Typography,
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

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

    const { currentUser, lookupData, errors, removeError  } = props
    
    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {

        fetchData(); 
    
		return () => {
			console.log('Cleanup function (ComponentDidUnmount)')
		}
	}, [lookupData.employees]); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 
    
    
    const [event, setEvent] = useState({})

	const fetchData = async () => {
        //if existing event, get event detail from api
        // console.log(props.match.params)
        if(props.match.params.eventId) setEvent(await props.fetchEvent(props.match.params.eventId)) 
                        
        const timestamp = new Date().toISOString(); 
        //if this is a new event form, and the lookup data has been loaded, set the initial values for the evnt 
        if(props.match.path.includes('/events/si/new') && lookupData.employees){
            setEvent({
                eventType: 'Safety Incident', 
                reportedBy: currentUser.user.userId,
                reportedOn: timestamp, 
                createdBy:  currentUser.user.userId, 
                eventStatus: 'Draft',   
                departmentId: currentUser.user.logicalHierarchyId, 
                localeId: currentUser.user.physicalHierarchyId,
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
		if(!lookupData.logicalHierarchyAttributes) props.fetchLogicalHierarchyAttributes(event.departmentId || props.currentUser.user.logicalHierarchyId, 'singlepath', '?enabled=true');
        if(!lookupData.physicalHierarchyAttributes) props.fetchPhysicalHierarchyAttributes(event.localeId || props.currentUser.user.physicalHierarchyId, 'singlepath', '?enabled=true&excludeglobal=true');
            
    }
    
    //function to check if all data has been loaded/returned from the API. only then can the user navigate around the form 
    const dataIsLoading = () =>  {
        return Object.keys(lookupData).length < 5 ? true : false
    }

    // const [actions, setActions] = useState(event ? event.actions : null);

    // Handle field change 
    const handleChange = (section, input) => e => {
        // console.log(event)
        // console.log(e.target.type)
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
        props.fetchLogicalHierarchyAttributes(event.departmentId, 'singlepath', '?enabled=true');
        props.fetchPhysicalHierarchyAttributes(event.localeId, 'singlepath', '?enabled=true&excludeglobal=true');

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
        const newCompleted = new Set(completed);
        newCompleted.add(activeStep);
        setCompleted(newCompleted);
        
        if (completed.size !== totalSteps() ) {
            handleNext();
        }
    }

    // const handleReset = () => {
    //     setActiveStep(0);
    //     setCompleted(new Set());
    //     // setSkipped(new Set());
    // }    
    
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
                            // handleSave={event.eventStatus === "Draft" ? handleSaveDraft : handleSubmit}
                        />             
            case 3: 
                return <Actions  
                            useStyles={useStyles} 
                            event={event}
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
                addNotification('Unkown Step', 'warning'); 
                return 'Unknown Step';
        }
    }

    const refreshPeopleInvolved = () => {
        props.fetchPeopleByEventId(event.eventId)
            .then(people => {
                //update the peopleInvolved property since its changed 
                console.log(people)
                setEvent({ ...event, peopleInvolved: people});
            })
            .catch(err => {
                console.log(err)
            });
    };

    const refreshCauses = () => {
        props.fetchCausesByEventId(event.eventId)
            .then(causes => {
                //update the cause list since its changed 
                console.log(causes)
                setEvent({ ...event, causes: causes});
            })
            .catch(err => {
                console.log(err); 
            });
    };

    const refreshEventFiles = () => {
        console.log(event.eventId); 
        props.fetchFilesByEventId(event.eventId)
            .then(files => {
                //update the file list since its changed 
                console.log(files)
                setEvent({ ...event, files: files});
            })
            .catch(err => {
                console.log(err); 
            });
    };
    
    const handleSaveDraft = e => {
        // e.preventDefault();
        //if this event doesnt have an Id, it means its new and we need to post a new event 
        if(!event.hasOwnProperty('eventId')) {
            props.postNewSafetyIncident(event)
                .then(res => {
                    // console.log(res)
                    //201, Created
                    if(res.status === 201){
                        setEvent( { ...event, ...res.data} ) 
                        handleComplete();
                    } else {
                        console.log(res); 
                        console.log(`Failed to save draft: ${res.status}`)
                    }
                });        
        } else {
            //update event 
            props.updateSafetyIncident(event, currentUser.user.userId)
                .then(res => {
                    if(res.status === 202) {
                        console.log(res); 
                        setEvent( { ...event, ...res.data } )
                        handleComplete();
                    } else {
                        console.log(res); 
                        console.log(`Failed to update draft: ${res.status}`)
                    }
                })
        }
    }
    
    const handleSubmit = e => {
        e.preventDefault();

        //shouldnt be able to Submit anything but a draft anyways, but this is a safeguard against that 
        if(event.eventStatus === 'Draft' && event.actions.length && event.peopleInvolved.length && event.causes.length) {
            // change status to Open
            event.eventStatus = 'Open';
            props.updateSafetyIncident(event, currentUser.user.userId)
            .then(res => {
                console.log(res)
                setEvent(props.fetchEvent(event.eventId))
                    .then(res => {
                        setEvent({ ...event, ...res})
                    }) 
            })
        }
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
                            <form className={classes.form} onSubmit={handleSubmit}>                        
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
                                                {event.eventStatus === 'Draft'
                                                    ?
                                                        activeStep > 1 
                                                            ?                                                             
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={handleSaveDraft}
                                                                    className={classes.button}
                                                                >
                                                                {event.eventId ? 'Save Changes' : 'Save Draft' }
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
                                                    :
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleNext}
                                                            className={classes.button}
                                                            disabled={dataIsLoading()}
                                                        >
                                                            Next
                                                        </Button>
                                                }
                                                        
                                            </div>
                                        </div>
                                    )}
                                </Fragment>
                            </form>	
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

export default connect(mapStateToProps, { 
    fetchEmployees,
    fetchLogicalHierarchyTree, 
    fetchPhysicalHierarchyTree, 
    fetchLogicalHierarchyAttributes, 
    fetchPhysicalHierarchyAttributes,
    postNewSafetyIncident,
    updateSafetyIncident,
    fetchEvent,
    fetchPeopleByEventId,
    fetchCausesByEventId, 
    fetchFilesByEventId
})(SafetyEventForm); 