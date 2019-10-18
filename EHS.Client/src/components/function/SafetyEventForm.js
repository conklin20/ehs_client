import React, { useState, useReducer, useEffect, Fragment } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom'; 
import { makeStyles } from '@material-ui/core/styles';
import { 
	fetchLogicalHierarchyTree, 
	fetchPhysicalHierarchyTree, 
	fetchLogicalHierarchyAttributes, 
    fetchPhysicalHierarchyAttributes } from '../../store/actions/lookupData'; 
import { postNewSafetyIncident } from '../../store/actions/safetyIncidents'; 
import { addError } from '../../store/actions/errors';
import ReportingInformation from './formSections/ReportingInformation'; 
import EventLocation from './formSections/EventLocation'; 
import SIEventDetails from './formSections/SIEventDetails'; 
import Actions from './formSections/Actions'; 
import Causes from './formSections/Causes'; 
import PeopleInvolved from './formSections/PeopleInvolved'; 
import Notification from '../function/Notification';
import Media from './formSections/Media'; 
import { 
	Button, 
	Dialog,
	DialogActions, 
	DialogContent, 
	DialogContentText, 
	DialogTitle, 
    Step,
    Stepper, 
    StepButton,
	Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	root: {
        flexGrow: 1,
	},
	container: {
        display: 'flex',
        flexWrap: 'wrap',
	},
	// textField: {
    //     marginLeft: theme.spacing(1),
    //     marginRight: theme.spacing(1),
    // },
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
        'Media'
    ]
}

// All of the State related to an event needs to live here
const SafetyEventForm = props => {
	const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState(new Set());
    const steps = getSteps();

    const { showSafetyEventForm, handleShowSafetyEventForm, existingEventDetail, currentUser, lookupData, isNew, newEventType, errors, removeError  } = props

    //for this parsing to work, the event type must come in as string-string (safety-incident, safety-observation etc)
    const parsedEventType = newEventType 
                            ? newEventType
                                .split('-')
                                .map(word => word[0].toUpperCase() + word.substring(1))
                                .join(' ')
                            : existingEventDetail.eventType

    const [timestampUtc, setTimestampUtc] = useState( new Date().toISOString() )

    //Event State by section 
    const [eventId, setEventId] = useState( !isNew ? { eventId: existingEventDetail.eventId } : null )
    const [reportingInformation, setReportingInformation] = useState({
                                                              //currentUser from redux (mapStateToProps)
        reportedBy: !isNew ? lookupData.employees.filter(e => e.employeeId === existingEventDetail.reportedBy)[0].fullName 
                           : lookupData.employees.filter(e => e.employeeId === currentUser.user.userId)[0].fullName,
        reportedOn: !isNew ? existingEventDetail.reportedOn : timestampUtc,
        createdBy: isNew ? currentUser.user.userId : null,
        modifiedBy: currentUser.user.userId,
        eventStatus: !isNew ? existingEventDetail.eventStatus : 'Draft'
    });
    const [hierarchySelections, setHierarchySelections] = useState({
        departmentId: !isNew ? existingEventDetail.departmentId : currentUser.user.logicalHierarchyId,
        localeId:     !isNew ? existingEventDetail.localeId : currentUser.user.physicalHierarchyId,
    });
    const [eventDetails, setEventDetails] = useState({
        eventType:              !isNew ? existingEventDetail.eventType : parsedEventType,
        eventDate:              !isNew ? existingEventDetail.eventDate : timestampUtc,
        hoursWorkedPrior:       !isNew ? existingEventDetail.hoursWorkedPrior : .5,
        ...existingEventDetail,  
    });

    const [actions, setActions] = useState(existingEventDetail ? existingEventDetail.actions : null);

    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        //if we're not dealing with a new form/event, refresh the lookup data based on what the current values are.
        //the lookup data coming into the form is inlcusive of everything within the hierarchy from the parent form
        if(!isNew) {
            handleRefreshData(); 
        }

		return () => {
			console.log('Cleanup function (ComponentDidUnmount)')
		}
	}, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 
    
    // Handle field change 
    const handleChange = (section, input) => e => {
        switch (section) {
            case 'eventLocation':
                break; 
            case 'eventDetails':
                //if its a bool/checkbox, we need to use the checked property as opposed to value property
                return setEventDetails({ ...eventDetails, [input]: e.target.checked ? e.target.checked : e.target.value });
            case 'actions':
                //if its a bool/checkbox, we need to use the checked property as opposed to value property 
                // return setNewAction({ ...newAction, [input]: e.target.checked ? new Date().toISOString() : e.target.value });
            default:
                addError('Invalid section');
        }
    }
    //for the react-select (single) component
    // const handleAutoCompleteChange = (data, action) => e => {
    const handleAutoCompleteChange = (state, action)  => {
        switch (action.name){
            case 'departmentId':
            case 'localeId':
                return setHierarchySelections({ ...hierarchySelections, [action.name]: state.value });
            case 'employeeId':
            case 'supervisorId':
            case 'shift':
            case 'jobTitle':
            case 'natureOfInjury':
            case 'bodyPart':
            case 'firstAidType':
            case 'offPlantMedicalFacility':
            case 'materialInvolved':
            case 'equipmentInvolved':
            case 'workEnvironment':
            case 'initialCategory':
            case 'resultingCategory':
                return setEventDetails({ ...eventDetails, [action.name]: state.value });
            case 'assignedTo':
            case 'actionType':
            case 'dueDate':
            case 'completed':
            case 'approved':
            case 'actionToTake':
                // console.log([action.name], state.value)
                // return setNewAction({ ...newAction, [action.name]: state.value });
            default:
                console.log('Invalid Action: ' + action.name)
                addError("Invalid Action:", action.name)
                return
        }
    }

    //for the react-select (multi) component
    const handleAutoCompleteMultiChange = (data, action) => e => {
        console.log(data, Actions, e) ; 
        // handleAutoCompleteChange={(data, action) => dispatch({ type: action.name, value: data })}
    }

    const handleSliderChange = (e, value) => {
        // console.log(e, value)
        return setEventDetails({ ...eventDetails, ['hoursWorkedPrior']: value })
    }

    const handleRefreshData = () => {
        props.fetchLogicalHierarchyAttributes(hierarchySelections.departmentId, 'singlepath', '?enabled=true');
        props.fetchPhysicalHierarchyAttributes(hierarchySelections.localeId, 'singlepath', '?enabled=true&excludeglobal=true');
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

    const handleReset = () => {
        setActiveStep(0);
        setCompleted(new Set());
        // setSkipped(new Set());
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
                            values={reportingInformation}
                        />
            case 1: 
                return <EventLocation 
                            useStyles={useStyles} 
                            lookupData={lookupData} 
                            values={hierarchySelections}
                            handleAutoCompleteChange={handleAutoCompleteChange}
                            handleRefreshData={handleRefreshData}
                        />        
            case 2: 
                return <SIEventDetails 
                            useStyles={useStyles} 
                            lookupData={lookupData} 
                            values={eventDetails}
                            currentUser={currentUser}
                            handleChange={handleChange}
                            handleAutoCompleteChange={handleAutoCompleteChange}
                            handleSliderChange={handleSliderChange}
                            handleSave={reportingInformation.eventStatus === "Draft" ? handleSaveDraft : handleSubmit}
                        />             
            case 3: 
                return <Actions  
                            useStyles={useStyles} 
                            lookupData={lookupData}
                            // values={actions}
                            currentUser={currentUser}
                            // handleChange={handleChange}
                            // handleAutoCompleteChange={handleAutoCompleteChange}
                            // eventId={eventId}
                            // handleNewActionAssignment={handleNewActionAssignment}
                            // handleCompleteAction={handleCompleteAction}
                            // handleApproveAction={handleApproveAction}
                            // eventType={parsedEventType}
                            event={Object.assign(eventId, reportingInformation, hierarchySelections ,eventDetails)}
                        />        
            case 4: 
                return <PeopleInvolved 
                            useStyles={useStyles} 
                            lookupData={lookupData} 
                            currentUser={currentUser}
                            people={existingEventDetail ? existingEventDetail.peopleInvolved : null}
                            event={Object.assign(eventId, reportingInformation, hierarchySelections ,eventDetails)}
                        />     
            case 5: 
                return <Causes  
                            useStyles={useStyles} 
                            lookupData={lookupData} 
                        />     
            case 6: 
                return <Media  
                            useStyles={useStyles} 
                            lookupData={lookupData} 
                        />     
            default:
                addError('Unkown Step'); 
                return 'Unknown Step';
        }
    }
    
    const handleSaveDraft = e => {
        e.preventDefault();

        const draft = Object.assign(reportingInformation, hierarchySelections ,eventDetails);
                    
        if(!eventId) {
            props.postNewSafetyIncident(draft)
                .then(res => {
                    setEventId({eventId: res.eventId});
                    // setReportingInformation(res);
                    // setHierarchySelections(res); 
                    // setEventDetails(res);
                    // setImmediateAction(res);
                    handleComplete();
                });                        
            
        } else {

        }

    }

    const handleSubmit = e => {
        e.preventDefault();
    }
	return (
		<div className={classes.root}>
            {errors && errors.message && (							
				<Notification
				open={true} 
				variant="error"
				className={classes.margin}
				message={errors.message}	
				removeError={removeError}							
				/>		
            )}
			<Dialog 
				open={showSafetyEventForm} 
				onClose={handleShowSafetyEventForm} 
				aria-labelledby="form-dialog-title"
				fullWidth={true}
				maxWidth="lg"
			>
                <DialogTitle id="form-dialog-title">
                    { eventId ? `${eventDetails.eventType} - ${eventId.eventId} - ${reportingInformation.eventStatus}` : `Event Form - New ${parsedEventType}` } 
                </DialogTitle>
				<DialogContent>		
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
                                        <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                            Back
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            className={classes.button}
                                        >
                                            Next
                                        </Button>

                                        {activeStep !== steps.length &&
                                            (completed.has(activeStep) ? (
                                            <Typography variant="caption" className={classes.completed}>
                                                Step {activeStep + 1} already completed
                                            </Typography>
                                            ) : (
                                            <Button variant="contained" color="primary" onClick={handleComplete}>
                                                {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                                            </Button>
                                            ))}
                                        
                                        {activeStep > 1 && 
                                            reportingInformation.eventStatus === 'Draft' ? (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSaveDraft}
                                                    className={classes.button}
                                                >
                                                    Save Draft
                                                </Button>
                                            )
                                            : null
                                        }
                                    </div>
                                </div>
                            )}
                        </Fragment>
					</form>				
				</DialogContent>
				<DialogActions>
					{/* <Button onClick={close} color="primary">
						Search!
					</Button> */}
				</DialogActions>
			</Dialog>
		</div>
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
    fetchLogicalHierarchyTree, 
    fetchPhysicalHierarchyTree, 
    fetchLogicalHierarchyAttributes, 
    fetchPhysicalHierarchyAttributes,
    postNewSafetyIncident,
})(SafetyEventForm); 