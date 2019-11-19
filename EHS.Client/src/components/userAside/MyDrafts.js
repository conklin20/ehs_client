import React, { useState, Fragment } from 'react'; 
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton
, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Badge } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
}));

const MyDrafts = props => {
    const componentClasses = useStyles(); 
    const classes = Object.assign(componentClasses, props.useStyles()); // combining the styles from the parent component with this components styles

    const [openDialog, setOpenDialog] = useState(false); 
    
    const handleClickOpen = () => {
        setOpenDialog(true); 
    }; 

    const handleClose = (eventId) => e => {
        if(e.currentTarget.id === 'deleteDraft' && eventId){   
            props.handleDelete(eventId)
        }
        setOpenDialog(false);
    }
    // console.log(props); 
    const drafts = props.drafts.map(d => {
        return (
            <Fragment>   
                <Dialog 
                    open={openDialog}
                    onClose={handleClose}
                    aria-labelledby='confirm-dialog-title'
                    aria-describedby='confirm-dialog-description'
                >
                    <DialogTitle id='confirm-dialog-title'>{"Are you sure you want to delete this draft?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id='confirm-dialog-description'>
                            {`Are you sure you want to delete draft ${d.eventId}? You will not be able to undo this action.`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button id='deleteDraft' onClick={handleClose(d.eventId)} color='primary' autofocus>Yes</Button>
                        <Button onClick={handleClose(null)} color='primary'>No</Button>
                    </DialogActions>
                </Dialog>
                <ListItem>
                    <Link to={`/events/si/${d.eventId}`} className={classes.link} >
                        <ListItemText
                            primary={`${d.eventId} - 
                                ${props.employees.find(e => e.employeeId === d.employeeId) ?
                                    props.employees.find(e => e.employeeId === d.employeeId).fullName : d.employeeId}`}
                            secondary={`${d.jobTitle} - ${d.initialCategory}`}
                            />
                    </Link>
                    <ListItemSecondaryAction>
                        <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={handleClickOpen}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>        
                <Divider component="li" />
            </Fragment>
        )
    })

    return (     
        <Fragment>
            <Typography variant='h6' className={classes.sectionTitle}>
                My Drafts
                <Badge color="primary" badgeContent={drafts.length} className={classes.badge}></Badge>
            </Typography>
            <List className={classes.sectionBody}>
                {drafts}
            </List>
        </Fragment>
    )
    
}

export default MyDrafts
