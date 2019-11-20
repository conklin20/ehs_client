import React, { Fragment } from 'react'; 
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Typography, List, ListItem, ListItemText, Badge, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment'; 

const useStyles = makeStyles(theme => ({
}));

const MyApprovals = props => {
    const componentClasses = useStyles(); 
    const classes = Object.assign(componentClasses, props.useStyles()); // combining the styles from the parent component with this components styles

    // console.log(props.pendingApprovals); 
    const pendingApprovals = props.pendingApprovals.map(a => {
        // console.log(a.action)
        return (
            <Fragment>   
                <Tooltip title='Event # - Action # - Action Completion Date' placement="top" >
                    <ListItem>
                        <Link to={`/events/si/${a.action.eventId}/step/4`} className={classes.link} >
                            <ListItemText
                                primary={`${a.action.eventId} - ${a.action.actionId} - ${moment(a.action.completionDate)
                                                                    // .subtract(new Date(a.action.completionDate).getTimezoneOffset(), 'minutes')
                                                                    .format('ll')}`}
                                secondary={a.action.actionToTake}
                                />
                        </Link>
                    </ListItem>        
                </Tooltip>
                <Divider component="li" />
            </Fragment>
        )
    })

    return (     
        <Fragment>
            <Typography variant='h6' className={classes.sectionTitle}>
                My Pending Approvals
                <Badge color="primary" badgeContent={pendingApprovals.length} className={classes.badge} showZero ></Badge>
            </Typography>
            {pendingApprovals.length 
                ?
                    <List className={classes.sectionBody}>
                        {pendingApprovals}
                    </List>
                :                
                    <Typography variant="caption" >
                        You're good, no actions awaiting your approval!
                    </Typography>
            }
        </Fragment>
    )
    
}

export default MyApprovals
