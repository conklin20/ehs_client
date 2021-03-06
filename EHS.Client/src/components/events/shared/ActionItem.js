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
import moment from 'moment'; //https://momentjs.com/
import { MIN_ADMIN_ROLE_LEVEL } from '../../admin/adminRoleLevel';
import { S_I_STATUS } from '../../../helpers/eventStatusEnum';

const useStyles = makeStyles(theme => ({
    card: {
        display: 'inline-grid',
        width: '31%',
        margin: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        backgroundColor: theme.palette.grey['400'], //'#e2f1f8', //theme.palette.primary.light, 
        textAlign: 'left',
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
    actionToTake: {
        marginBottom: '0.035em', 
        whiteSpace: 'pre-line',
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
        borderRadius: '20px',
    },
    listBody: {
        textAlign: 'center',
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
    
    const approvalsReceived = action.approvals
        .map(ar => {
            return (
                <ListItem>
                    <Tooltip title={`${ar.approvedBy === 'N/A' 
                        ? 'N/A' 
                        : employees.find(e => e.employeeId === ar.approvedBy).fullName} 
                            - ${moment(ar.approvedOn)
                                // .subtract(new Date(ar.approvedOn).getTimezoneOffset(), 'minutes')
                                .format('lll')}` } >
                        <Chip label={ar.approvalLevel.approvalLevelName.replace('Approval', '')} />
                    </Tooltip>
                </ListItem>
            )
    }); 

    const approvalsNeeded = action.approvalsNeeded
        .map(an => {
            return (
                <ListItem key={an.approvalRoutingId}>
                    <Chip label={an.approvalLevelName.replace('Approval', '')} />
                </ListItem>
            )
    }); 

    
    const isAdmin = currentUser.user.roleLevel >= MIN_ADMIN_ROLE_LEVEL ? true : false

    //criteria and reasoning for the "Complete" button being disabled 
    const completeButtomCriteria = [];
    if(event.eventStatus !== S_I_STATUS.OPEN) completeButtomCriteria.push('This event is not in an "Open" status. '); 
    if(typeof(action.actionId) !== 'number') completeButtomCriteria.push('This action is still pending. '); 
    if(action.assignedTo !== currentUser.user.userId) completeButtomCriteria.push('This action is not assigned to you. '); 
    if(action.completionDate) completeButtomCriteria.push(`${assignedTo} has already completed this action. `); 

    //criteria and reasoning for the "Approve" button being disabled 
    const approveButtonCriteria = []; 
    if(event.eventStatus !== S_I_STATUS.OPEN) approveButtonCriteria.push('This event is not in an "Open" status. ');
    if(typeof(action.actionId) !== 'number') approveButtonCriteria.push('This action is still pending. ');
    if(!action.completionDate) approveButtonCriteria.push(`This action hasn't been completed by ${assignedTo} yet. `);
    if(action.approvalDate) approveButtonCriteria.push(`This action has already received final approval. `);
    if(action.assignedTo === currentUser.user.userId) approveButtonCriteria.push(`This action is assigned to you, you can't approve your own action. `);
                                                    // eslint-disable-next-line 
    if(action.approvals.find(ar => ar.approvalLevelId == currentUser.user.approvalLevel)) {
        approveButtonCriteria.push(`This action has already received
            ${action.approvals.find(ar => ar.approvalLevelId == currentUser.user.approvalLevel).approvalLevel.approvalLevelName}. `);        
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
                        <Typography variant='inherit' className={classes.cardHeader}>
                            <Typography variant="h5" gutterBottom>
                                {`${action.actionId} - ${assignedTo}`}
                            </Typography>
                            { isAdmin || typeof(action.actionId) !== 'number' ?  
                                <Typography>
                                    <DeleteIcon 
                                        onClick={handleClickOpen}
                                        size={'large'}
                                        />
                                </Typography>
                                : null
                            }
                        </Typography>
                        <Typography variant="overline" display="block" gutterBottom>
                            {
                                action.completionDate 
                                    ? `Completion Date: ${moment(action.completionDate)
                                                            // .subtract(new Date(action.completionDate).getTimezoneOffset(), 'minutes')
                                                            .format('lll')}` 
                                    : `Due Date: ${moment(action.dueDate)
                                                            // .subtract(new Date(action.dueDate).getTimezoneOffset(), 'minutes')
                                                            .format('lll')}` 
                            }
                        </Typography>
                        <Typography variant="body2" className={classes.actionToTake} >
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
                        <Typography variant='inherit' className={classes.list}>
                            <Typography variant='inherit' className={classes.approvalsSubTitle}>
                                <Typography variant="h6" >
                                    Needed
                                </Typography>
                                <Badge color="primary" badgeContent={approvalsNeeded.length} className={classes.badge} />
                            </Typography>
                            <List className={classes.listBody} dense={true}>
                                {approvalsNeeded}
                            </List>    
                        </Typography>
                        <Divider orientation="vertical" />
                        <Typography variant='inherit' className={classes.list}>
                            <Typography variant='inherit' className={classes.approvalsSubTitle}>
                                <Typography variant="h6" >
                                    Received
                                </Typography>
                                <Badge color="primary" badgeContent={approvalsReceived.length} className={classes.badge} />
                            </Typography>
                            <List className={classes.listBody} dense={true}>
                                {approvalsReceived}
                            </List>   
                        </Typography>
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
                            <Typography variant='inherit' className={classes.spanButton}>
                                <Button 
                                    onClick={handleCompleteAction(action)}
                                    disabled={completeButtomCriteria.length > 0 ? true : false}
                                >
                                Complete Action
                                </Button>
                            </Typography>
                        </Tooltip>
                        <Tooltip title={approveButtonCriteria.length > 0 ? approveButtonCriteria.join(' ') : 'Click to approve this action'}>
                            <Typography variant='inherit' className={classes.spanButton}>
                                <Button 
                                    onClick={handleApproveAction(action)}
                                    disabled={approveButtonCriteria.length > 0 ? true : false}
                                >
                                    Approve Action
                                </Button>
                            </Typography>
                        </Tooltip>
                    </ButtonGroup>
                </CardActions>
        </Card>
    )
}
export default ActionItem; 