import React, { useState, useReducer, useEffect, Fragment } from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { fetchLookupData } from '../../store/actions/lookupData'; 
import AutoComplete from './inputs/AutoComplete';
import AutoCompleteMulti from './inputs/AutoCompleteMulti';
import { addError } from '../../store/actions/errors';
import ReportingInformation from './formSections/ReportingInformation'; 
import EventLocation from './formSections/EventLocation'; 
import SIEventDetails from './formSections/SIEventDetails'; 
import Actions from './formSections/Actions'; 
import Causes from './formSections/Causes'; 
import PeopleInvolved from './formSections/PeopleInvolved'; 
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
	textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
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
		minWidth: 120,
		marginRight: theme.spacing(1),
	},
		formControlLabel: {
		// marginTop: theme.spacing(1),
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
	autoComplete: {
		marginTop: theme.spacing(2),
	},
    button: {
      marginRight: theme.spacing(1),
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

    const { showSafetyEventForm, handleShowSafetyEventForm, existingEventDetail, currentUser, lookupData, hierarchyData, isNew } = props
    
    //Event State by section 
    const [reportingInformation, setReportingInformation] = useState({
        //currentUser from redux (mapStateToProps)
        reportedBy: !isNew ? existingEventDetail.reportedBy : currentUser.user.userId,
        reportedOn: !isNew ? existingEventDetail.reportedOn : Date.now(), //  <<--- NEED TO GET UTC DATE 
        createdBy: isNew ? currentUser.user.userId : null,
        modifiedBy: currentUser.user.userId,        
    });
    const [hierarchySelections, setHierarchySelections] = useState({
        departmentId: !isNew ? existingEventDetail.departmentId : currentUser.user.logicalHierarchyId,
        localeId:     !isNew ? existingEventDetail.localeId : currentUser.user.physicalHierarchyId,
    });
    const [eventDetails, setEventDetails] = useState({
        eventType:              'Safety Incident', // <<-- DONT HARD CODE THIS 
        eventDate:              !isNew ? existingEventDetail.eventDate : Date.now(), //  <<--- NEED TO GET UTC DATE 
        employeeId:             !isNew ? existingEventDetail.employeeId : 0 ,
        jobTitle:               !isNew ? existingEventDetail.jobTitle : 0,
        shift:                  !isNew ? existingEventDetail.shift : 0,
        whatHappened:           !isNew ? existingEventDetail.whatHappened : '',
        isInjury:               !isNew ? existingEventDetail.isInjury : false,
        isIllness:              !isNew ? existingEventDetail.isIllness : false,
        hoursWorkedPrior:       !isNew ? existingEventDetail.hoursWorkedPrior : 0,
        initialCategory:        !isNew ? existingEventDetail.initialCategory : 0,
        resultingCategory:      !isNew ? existingEventDetail.resultingCategory : 0,
        workEnvironment:        !isNew ? existingEventDetail.workEnvironment : 0,
        natureOfInjury:         !isNew ? existingEventDetail.natureOfInjury : 0,
        bodyPart:               !isNew ? existingEventDetail.bodyPart : 0,
        firstAid:               !isNew ? existingEventDetail.firstAid : false,
        firstAidType:           !isNew ? existingEventDetail.firstAidType : 0,
        transported:            !isNew ? existingEventDetail.transported : false,
        offPlantMedicalFacility:!isNew ? existingEventDetail.offPlantMedicalFacility : 0, 
        er:                     !isNew ? existingEventDetail.er : false,
        materialInvolved:       !isNew ? existingEventDetail.materialInvolved : 0,
        equipmentInvolved:      !isNew ? existingEventDetail.equipmentInvolved : 0,
        lostTime:               !isNew ? existingEventDetail.lostTime : 0,        
    });
    
    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
		//fetch lookup data, which will be used in various places 
		// props.fetchLookupData('?enabled=true'); 

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
                setEventDetails({ ...eventDetails, [input]: e.target.value });
                break;
            default:
                addError('Invalid section')
        }
    }

    //for the react-select (single) component
    // const handleAutoCompleteChange = (data, action) => e => {
    const handleAutoCompleteChange = (state, action)  => {
        console.log(action.name, state.value)
        setHierarchySelections({ ...hierarchySelections, [action.name]: state.value })

        //get new lookupData values now
    }

    //for the react-select (multi) component
    const handleAutoCompleteMultiChange = (data, action) => e => {
        console.log(data, Actions, e) ; 
        // handleAutoCompleteChange={(data, action) => dispatch({ type: action.name, value: data })}
    }
    
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
                            hierarchyData={hierarchyData}
                            values={hierarchySelections}
                            handleAutoCompleteChange={handleAutoCompleteChange}
                        />        
            case 2: 
                return <SIEventDetails 
                            useStyles={useStyles} 
                            lookupData={lookupData} 
                            values={eventDetails}
                            handleChange={handleChange}
                            handleAutoCompleteChange={handleAutoCompleteChange}
                        />             
            case 3: 
                return <Actions  
                            useStyles={useStyles} 
                            lookupData={lookupData} 
                        />        
            case 4: 
                return <PeopleInvolved 
                            useStyles={useStyles} 
                            lookupData={lookupData} 
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
    }

    const handleSubmit = e => {
        e.preventDefault();
    }
	
	return (
		<div className={classes.root}>
			<Dialog 
				open={showSafetyEventForm} 
				onClose={handleShowSafetyEventForm} 
				aria-labelledby="form-dialog-title"
				fullWidth={true}
				maxWidth="lg"
			>
				<DialogTitle id="form-dialog-title">{!isNew ? `${existingEventDetail.eventType} - ${existingEventDetail.eventId}` : "Event Form - New Event"}</DialogTitle>
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
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveDraft}
                                            className={classes.button}
                                        >
                                            Save Draft
                                        </Button>
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
			hierarchyData: state.hierarchyData,
	};
}

export default connect(mapStateToProps, { fetchLookupData })(SafetyEventForm); 