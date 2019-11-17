import React, { Fragment } from 'react';
import { Typography, Grid, Button, Divider, Paper  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'; 
import ActionItem from './ActionItem';

const useStyles = makeStyles(theme => ({
    pendActions: {
        border: 'solid yellow 4px',
    }, 
    button: {
        margin: theme.spacing(2), 
        width: '20%'
    },
})); 

const ActionList = (props) => {
    const classes = useStyles(); 
    
    const { 
        employees, 
        currentUser, 
        handleCompleteAction,
        handleApproveAction, 
        handleDelete,
        event, 
        actions, 
        pendActions, 
        handleSavePendingActions, 
    } = props; 
    
    const assignedActions = actions
        .map(a => {
        return (
            <ActionItem
                key={a.actionId}
                action={a}
                employees={employees}
                currentUser={currentUser}
                handleCompleteAction={handleCompleteAction}
                handleApproveAction={handleApproveAction}
                handleDelete={handleDelete}
                event={event}
            />
        )
    })

    const pendingActions = pendActions
        .map(a => {
        return (
            <ActionItem 
                key={a.actionId}
                action={a}
                employees={employees}
                currentUser={currentUser}
                handleDelete={handleDelete}
                handleCompleteAction={handleCompleteAction} // not used for pending actions, but need to include the prop
                handleApproveAction={handleApproveAction}   // not used for pending actions, but need to include the prop
                event={event}
            />
        )
    })
    
    return (
        <Fragment> 
            {/* IF There are no pending actions, dont display the pending actions section  */}
            { pendingActions.length ? 
                <Paper>
                    <div className={classes.pendActions}>
                        <Typography variant='h4' gutterBottom>
                            Pending Actions (Need Saved)
                        </Typography>
                        {pendingActions}         
                        <Typography gutterBottom> 
                            <Button 
                                name='assignNewAction'
                                variant='contained' 
                                color="secondary" 
                                className={classes.button}
                                onClick={handleSavePendingActions}
                            >
                                Save Pending Actions
                            </Button> 
                        </Typography> 
                    </div>
                </Paper>
                : null 
            }

            {assignedActions}
        </Fragment>
    )
}

export default ActionList; 