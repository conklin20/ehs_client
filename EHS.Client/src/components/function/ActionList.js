import React, { useState, Fragment } from 'react';
import { Typography, Grid, Button, Divider, Paper  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'; 
import ActionItem from './ActionItem';

const useStyles = makeStyles(theme => ({
    cardContainer: {
        display: 'flex', 

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
                    <Typography variant='h4' gutterBottom>
                        Pending Actions (Need Saved)
                    </Typography>
                    <Grid container spacing={2}>
                        {pendingActions}
                    </Grid>                         
                    <Button 
                        name='assignNewAction'
                        variant='contained' 
                        color="secondary" 
                        className={classes.button}
                        onClick={handleSavePendingActions}
                    >
                        Save Pending Actions
                    </Button>
                    <Divider className={classes.divider} />
                </Paper>
                : null 
            }

            {/* IF There are no assigned actions, dont display the assigned actions section  */}
            { assignedActions.length ? 
                <Paper>
                    <Typography variant='h4' gutterBottom>
                        Actions Currently Assigned
                    </Typography>
                    <Grid container spacing={2}>
                        {assignedActions}  
                    </Grid>
                </Paper>
                : null 
            }
        </Fragment>
    )
}

export default ActionList; 