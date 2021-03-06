import React, { Fragment } from 'react'; 
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Typography, List, ListItem, ListItemText, Badge, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment'

const useStyles = makeStyles(theme => ({

}));

const MyActions = props => {
    const componentClasses = useStyles(); 
    const classes = Object.assign(componentClasses, props.useStyles()); // combining the styles from the parent component with this components styles

    const actions = props.actions.map(a => {
        return (
            <Fragment key={a.actionId}> 
                <Tooltip title='Event # - Action # - Action Due Date' placement="top" >
                    <ListItem>
                        <Link to={`/events/si/${a.eventId}/step/4`} className={classes.link} >
                            <ListItemText
                                primary={`${a.eventId} - ${a.actionId} - ${moment(a.dueDate)
                                                            // .subtract(new Date(a.dueDate).getTimezoneOffset(), 'minutes')
                                                            .format('ll')}`}
                                secondary={a.actionToTake}
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
                My Actions
                <Badge color="primary" badgeContent={actions.length} className={classes.badge} showZero ></Badge>
            </Typography>
            {actions.length 
                ?
                    <List className={classes.sectionBody}>
                        {actions}
                    </List>
                :
                    <Typography variant="caption" >
                        You're good, you've got no pending actions!
                    </Typography>
            }
        </Fragment>
    )
    
}

export default MyActions
