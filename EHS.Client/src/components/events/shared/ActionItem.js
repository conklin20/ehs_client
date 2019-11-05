import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { Typography
        , Card
        , CardContent
        , CardActions
        , Button
        , ButtonGroup
        , Grid
        , List
        , ListItem
        // , ListItemText
        // , ListSubheader
        , Badge
        , Divider
        , Chip
        , Tooltip
        , Dialog
        , DialogActions
        , DialogContent
        , DialogContentText
        , DialogTitle
    } from '@material-ui/core';
// import MomentDate from '../../shared/MomentDate';

const useStyles = makeStyles(theme => ({
    card: {
        minWidth: '15vw',
        maxWidth: '30%',
        margin: 10,
        backgroundColor: '#e2f1f8', //theme.palette.primary.light, 
        paddingBottom: 20,
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    cardActions: {
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: theme.spacing(1),
    }, 
    spanButton: {
        backgroundColor: theme.palette.secondary.light,
    },
    title: {
        display: 'flex', 
        justifyContent: 'space-between',
    },
    approvalsTitle: {
        display: 'flex', 
        justifyContent: 'center', 
    },
    approvalsSubTitle: {
        display: 'flex',
        alignItems: 'center',
    },
    approvalsBody: {
        display: 'flex', 
        justifyContent: 'space-around',
      },
    list: {
        width: '45%', 
        backgroundColor: theme.palette.background.paper, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
    },
    badge: {
        left: theme.spacing(2),
    },
})); 

const ActionItem = (props) => {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false); 

    const { 
        action, 
        employees, 
        currentUser, 
        handleDelete, 
        handleCompleteAction, 
        handleApproveAction,
        event, 
    } = props

    const handleClickOpen = () => {
        setOpenDialog(true); 
    }; 

    const handleClose = (e) => {
        if(e.currentTarget.id === 'deleteAction'){   
            handleDelete(typeof(action.actionId) !== 'number' ? 'pending' : 'assigned', action.actionId)();
        }
        setOpenDialog(false);
    }
    
    const assignedTo = action.assignedTo === 'N/A' ? 'N/A' : employees.find(e => e.employeeId === action.assignedTo).fullName;

    // const dateFormat = currentUser.user.dateFormat || 'MM/DD/YYYY'; 
    // const utcOffset = currentUser.user.timeZone; 
    
    const approvalsReceived = action.approvals
        .map(ar => {
            return (
                <ListItem>
                    <Tooltip title={`${ar.approvedBy === 'N/A' ? 'N/A' : employees.find(e => e.employeeId === ar.approvedBy).fullName} - ${ar.approvedOn}`} >
                        <Chip label={ar.approvalLevel.approvalLevelName.replace('Approval', '')} />
                    </Tooltip>
                </ListItem>
            )
    }); 
    
    const approvalsNeeded = action.approvalsNeeded
        .map(an => {
            return (
                <ListItem>
                    <Chip label={an.approvalLevelName.replace('Approval', '')} />
                </ListItem>
            )
    }); 

    /*
    User Role Id's that have permission to delete actions 
    UserRoleId	RoleName
    1	        SysAdmin
    2	        TenantAdmin
    3	        SafetyAdmin  */
    const adminRoles = ['1','2','3']; //using strings for now because I plan to bring in the RoleName eventually 
    const isAdmin = adminRoles.includes(currentUser.user.roleId)

    //criteria and reasoning for the "Complete" button being disabled 
    const completeButtomCriteria = [];
    if(event.eventStatus !== 'Open') completeButtomCriteria.push('This event is not in an "Open" status. '); 
    if(typeof(action.actionId) !== 'number') completeButtomCriteria.push('This action is still pending. '); 
    if(action.assignedTo !== currentUser.user.userId) completeButtomCriteria.push('This action is not assigned to you. '); 
    if(action.completionDate) completeButtomCriteria.push(`${assignedTo} has already completed this action. `); 

    //criteria and reasoning for the "Approve" button being disabled 
    const approveButtonCriteria = []; 
    if(event.eventStatus !== 'Open') approveButtonCriteria.push('This event is not in an "Open" status. ');
    if(typeof(action.actionId) !== 'number') approveButtonCriteria.push('This action is still pending. ');
    if(!action.completionDate) approveButtonCriteria.push(`This action hasn't been completed by ${assignedTo} yet. `);
    if(action.approvalDate) approveButtonCriteria.push(`This action has already been approved. `);
    if(action.assignedTo === currentUser.user.userId) approveButtonCriteria.push(`This action is assigned to you, you can't approve your own action. `);
    if(action.approvals.filter(ar => ar.approvalLevelId === currentUser.user.approvalLevel).length) {
        approveButtonCriteria.push(`This action has already received
            ${action.approvals.find(ar => ar.approvalLevelId === currentUser.user.approvalLevel).approvalLevel.approvalLevelName}. `);        
    }    
    
    return (
        <Card className={classes.card} >
            {/* Dialog Box */}
            <Dialog 
                open={openDialog}
                onClose={handleClose}
                aria-labelledby='confirm-dialog-title'
                aria-describedby='confirm-dialog-description'
            >
                <DialogTitle id='confirm-dialog-title'>{"Are you sure you want to delete this action?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='confirm-dialog-description'>
                        {`Are you sure you want to delete action ${action.actionId}? You will not be able to undo this action.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button id='deleteAction' onClick={handleClose} color='primary' autofocus>Yes</Button>
                    <Button onClick={handleClose} color='primary'>No</Button>
                </DialogActions>
            </Dialog>
            <CardContent >
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <div className={classes.cardHeader}>
                            <Typography variant="h5" gutterBottom>
                                {`${action.actionId} - ${assignedTo}`}
                            </Typography>
                            { isAdmin || typeof(action.actionId) !== 'number' ?  
                                <span>
                                    <DeleteIcon 
                                        onClick={handleClickOpen}
                                        size={'large'}
                                        />
                                </span>
                                : null
                            }
                        </div>
                        <Typography variant="overline" display="block" gutterBottom>
                            {
                                action.completionDate 
                                    ? `Completion Date: ${action.completionDate}` 
                                    : `Due Date: ${action.dueDate}`
                            }
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {action.actionToTake}
                        </Typography>
                        <Divider />                        
                    </Grid>
                    <Grid item xs={12}>	
                        <Typography variant="h5" className={classes.approvalsTitle} gutterBottom >
                            Approvals
                        </Typography>
                    </Grid>
                    <Grid container className={classes.approvalsBody}>
                        <div className={classes.list}>
                            <div className={classes.approvalsSubTitle}>
                                <Typography variant="h6" >
                                    Needed
                                </Typography>
                                <Badge color="primary" badgeContent={approvalsNeeded.length} className={classes.badge} />
                            </div>
                            <List dense={true}>
                                {approvalsNeeded}
                            </List>    
                        </div>
                        <Divider orientation="vertical" />
                        <div className={classes.list}>
                            <div className={classes.approvalsSubTitle}>
                                <Typography variant="h6" >
                                    Received
                                </Typography>
                                <Badge color="primary" badgeContent={approvalsReceived.length} className={classes.badge} />
                            </div>
                            <List dense={true}>
                                {approvalsReceived}
                            </List>   
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />              
            <CardActions className={classes.cardActions}>
                    <ButtonGroup 
                        size='small' 
                        aria-label='actions'
                        variant='contained' 
                        color="secondary" 
                    >
                        <Tooltip title={completeButtomCriteria.length > 0 ? completeButtomCriteria.join(' ') : 'Click to mark this action as complete'}>
                            <span className={classes.spanButton}>
                                <Button 
                                    onClick={handleCompleteAction(action)}
                                    disabled={completeButtomCriteria.length > 0 ? true : false}
                                >
                                Complete Action
                                </Button>
                            </span>
                        </Tooltip>
                        <Tooltip title={approveButtonCriteria.length > 0 ? approveButtonCriteria.join(' ') : 'Click to approve this action'}>
                            <span className={classes.spanButton}>
                                <Button 
                                    onClick={handleApproveAction(action)}
                                    disabled={approveButtonCriteria.length > 0 ? true : false}
                                >
                                    Approve Action
                                </Button>
                            </span>
                        </Tooltip>
                    </ButtonGroup>
                </CardActions>
        </Card>
    )
}
export default ActionItem; 