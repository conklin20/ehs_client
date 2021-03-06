import React, { useState, useEffect, Fragment } from 'react';
import { Typography, Grid, TextField, Divider, Checkbox, FormControlLabel, Button, Badge  } from '@material-ui/core'; 
import AutoComplete from '../../shared/AutoComplete'; 
import filterLookupDataByKey from '../../../helpers/filterLookupDataByKey'; 
import filterEmployeeList from '../../../helpers/filterEmployeeList'; 
import formatDate from '../../../helpers/formatDate'; 
import ActionList from './ActionList';
import { addNotification } from '../../../store/actions/notifications';
import { removeAction, addAction, fetchActionsByEventId, updateAction } from '../../../store/actions/actions';
import { addApproval } from '../../../store/actions/approvals';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import { S_I_STATUS } from '../../../helpers/eventStatusEnum';
import { ATTR_CATS } from '../../../helpers/attributeCategoryEnum'


const useStyles = makeStyles(theme => ({
	actions: {
        textAlign: 'center',
    },
    badge: {
        marginLeft: theme.spacing(3), 
    }, 
    buttonContainer: {
        textAlign: 'center',
    },
    button: {
        backgroundColor: theme.palette.primary.light, 
    }
}));


const Actions = (props) => {
    const componentClasses = useStyles(); 
    const classes = Object.assign(componentClasses, props.useStyles()); // combining the styles from the parent component with this components styles

    const { lookupData, currentUser, event, refreshActions } = props; 
    
    const [assignedActions, setAssignedActions] = useState([])
    const [newAction, setNewAction] = useState({
        dueDate: formatDate(new Date().toISOString())
    });
    const [newActionList, setNewActionList] = useState([]);
    const [nextId, setNextId] = useState(1); //used to set the Id's of the pending actions

    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        //get Actions 
        props.fetchActionsByEventId(event.eventId)
            .then(res => {
                if(res.status === 200){
                    setAssignedActions(res.data)
                } else {
                    console.log(res)
                }
            })

		return () => {
			// console.log('Actions Form Unmounting')
		}
	}, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

    // Handle field change 
    const handleChange = (section, input) => e => {
        if (input === 'completed') {
            //if its a bool/checkbox, we need to use the checked property as opposed to value property
            return setNewAction(
                {  
                    ...newAction, 
                    'completionDate':  e.target.checked ? new Date().toISOString() : null, 
                    [input]: e.target.checked
                });
        } else {
            return setNewAction({ ...newAction, [input]: e.target.value });
        }
    }
    //for the react-select (single) component
    const handleAutoCompleteChange = (state, action)  => {
        switch (action.name){
            case 'assignedTo':
            case 'actionType':
            case 'dueDate':
            case 'actionToTake':
                // console.log([action.name], state.value)
                return setNewAction({ ...newAction, [action.name]: state.value });
            default:
                console.log('Invalid Action: ' + action.name)
                addNotification("Invalid Action:", action.name, 'warning')
                return
        }
    }

    const handleNewActionAssignment = e => {
        e.preventDefault(); 
        newAction.actionId = `TBD${nextId}`;
        setNextId(nextId + 1);

        newAction.eventId = event.eventId;
        newAction.createdBy = currentUser.user.userId; 
        newAction.eventType = event.eventType; 
        newAction.approvals = [];
        newAction.approvalsNeeded = [];
    
        setNewActionList([...newActionList, newAction]);
        //reset action to take field 
    }

    const handleSavePendingActions = e => {
        //save the pending actions to the database 
        //we have to delete the temporary actionId (TBD1...) we're using so the server doesnt try to parse it as an int 
        newActionList.forEach(a => {
            delete a.actionId;
        });
        
        if(newActionList.length){       
            props.addAction(newActionList)
                .then(res => {
                    props.fetchActionsByEventId(event.eventId)
                        .then(res => {
                            if(res.status === 200){
                                refreshActions();
                                setNewActionList([]);  //clear out the pending list 
                                setAssignedActions([...res.data]); //append the newly saved actions to the assigned actions state
                            } else {
                                console.log(res); 
                            }
                        })
                });                    
            
        };
    };
    
    const handleCompleteAction = (completedAction) => e => {
        if(completedAction){
            //Update the completion date 
            completedAction.completionDate = new Date().toISOString();
            //save to DB 
            props.updateAction(completedAction)
                .then(res => {
                    //update the state 
                    // the response (res) here will be the updated action, so we have to filter it out so it doesnt get duplicated 
                    setAssignedActions([ ...assignedActions.filter(a => a.actionId !== res.actionId), res ])
                });
        };
    };

    const handleApproveAction = (approvedAction)=> e => {
        if(approvedAction){
            //Build the approval 
            const approval = {
                actionId: approvedAction.actionId, 
                approvedBy: currentUser.user.userId, 
                approvedOn: new Date().toISOString(),
            }
            
            //save to DB 
            props.addApproval(approval, currentUser.user.approvalLevelName)
                .then(res => {
                    if(res.status === 201){
                        //update the state
                        //not ideal to re-grab all actions after an approval, but it works for now
                        props.fetchActionsByEventId(event.eventId)
                            .then(res => {
                                if(res.status === 200){
                                    setAssignedActions(res.data)
                                } else {
                                    console.log(res)
                                }
                            })
                    } else {
                        console.log(res)
                    }
                })
        };
    };

    const handleDelete = (type, id) => e => {
        if (type === 'pending'){
            setNewActionList(newActionList.filter(a => a.actionId !== id)) //remove the action from the array 
        } else {
            props.removeAction(id, currentUser.user.userId) 
                .then(res => {
                    console.log(res);
                    setAssignedActions(assignedActions.filter(a => a.actionId !== id)) //remove the action from the array                     
                });                        
        
        } 
    }

    //building each lookup data object 
    const employees = filterEmployeeList(lookupData['employees'], null, 4001, true, false)
    const actionTypes = filterLookupDataByKey(lookupData, ATTR_CATS.ACTION_TYPES.lookupDataKey, ATTR_CATS.ACTION_TYPES.key, null);

    return (
        <Fragment>
            <Typography variant='h4' gutterBottom>
                Actions
            </Typography>
            <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                Instructions: Assign actions to users (requires EHS account), mark actions assigned to you as complete, 
                and approve actions requiring your approval
            </Typography>  
            <Divider className={classes.divider}/>
            {event.eventStatus !== S_I_STATUS.CLOSED 
                ?
                <Fragment>
                    <form onSubmit={handleNewActionAssignment}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>							
                                <AutoComplete
                                    required
                                    name="actionType"
                                    options={actionTypes}
                                    label="Action Type"                        
                                    placeholder="Select Type"
                                    handleChange={handleAutoCompleteChange}
                                    className={classes.formControl}
                                >
                                </AutoComplete> 
                            </Grid>
                            <Grid item xs={12} md={3}>							
                                <AutoComplete
                                    required
                                    name='assignedTo'
                                    options={employees}
                                    label='Assigned To'                        
                                    placeholder='Select Employee'
                                    handleChange={handleAutoCompleteChange}
                                    className={classes.formControl}
                                >
                                </AutoComplete> 
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    required
                                    type='date'
                                    label='Due Date'
                                    className={classes.formControl}
                                    defaultValue={newAction.dueDate}
                                    onChange={handleChange('actions', 'dueDate')}
                                    variant='outlined'
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color='primary'
                                            checked={newAction.completed ? true : false}
                                            onChange={handleChange('actions', 'completed')}
                                        />
                                    }
                                    label='Completed?'
                                />                    
                            </Grid> 
                            <Grid item xs={12}>		
                                <TextField
                                    required
                                    className={classes.formControl}
                                    label='Action to Take'
                                    multiline
                                    fullWidth
                                    rows='3'
                                    // value={values.whatHappened}
                                    onChange={handleChange('actions', 'actionToTake')}
                                    // helperText='Explain in as much detail possible what actions were taken at the time of the event'
                                    variant="outlined"
                                />                    
                            </Grid>     
                            <Grid item xs={12}>	
                                <div className={classes.buttonContainer}>
                                    <Button 
                                        type="submit"
                                        name='assignNewAction'
                                        variant='contained' 
                                        className={classes.button}
                                    >
                                        Create Action
                                    </Button>	
                                </div>
                            </Grid>
                        </Grid>
                    </form>  
                    <Divider className={classes.divider}/>
                </Fragment>
                : null 
            }

            <div className={classes.actions}>
                {assignedActions.length || newActionList.length                  
                    ?
                        <Fragment>
                            <Typography variant='h4' gutterBottom>
                                Assigned Actions
                                <Badge color="primary" badgeContent={assignedActions.length} className={classes.badge} />
                            </Typography>
                            <ActionList
                                actions={assignedActions ? assignedActions : []}
                                pendActions={newActionList ? newActionList : []}
                                employees={lookupData['employees']}
                                currentUser={currentUser}
                                handleCompleteAction={handleCompleteAction}
                                handleApproveAction={handleApproveAction}
                                handleDelete={handleDelete}
                                handleSavePendingActions={handleSavePendingActions}
                                event={event}
                            />
                        </Fragment>
                    : 
                    <Typography variant='h4' gutterBottom>
                        {event.eventStatus === S_I_STATUS.DRAFT ? 'No Actions Assigned Yet' : 'Loading Actions...'}
                    </Typography>
                }
            </div>
            <Divider className={classes.divider}/>   
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
    removeAction, 
    addAction,
    fetchActionsByEventId, 
    updateAction, 
    addApproval
})(Actions); 