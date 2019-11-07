import React, { Fragment } from 'react'; 
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Typography, List, ListItem, ListItemText, Badge } from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment'; 

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    //   maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      maxHeight: '25vh',
      overflowY: 'scroll',
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.primary.dark
    },
    margin: {
      marginTop: theme.spacing(2),
    },
    padding: {
      padding: theme.spacing(0, 2),
    },
  }));

const MyApprovals = props => {
    const classes = useStyles();

    // console.log(props.pendingApprovals); 
    const pendingApprovals = props.pendingApprovals.map(a => {
        // console.log(a.action)
        return (
            <Fragment>   
                <ListItem>
                    <Link to={`/events/si/${a.action.eventId}/step/4`} className={classes.link} >
                        <ListItemText
                            primary={`${a.action.eventId} - ${moment(a.action.completionDate)
                                                                .add(props.currentUser.user.timeZone, 'hours')
                                                                .format(props.currentUser.user.dateFormat || 'YYYY-MM-DD')}`}
                            secondary={a.action.actionToTake}
                            />
                    </Link>
                </ListItem>        
                <Divider component="li" />
            </Fragment>
        )
    })

    return (     
        <Fragment>
            <Badge color="primary" badgeContent={pendingApprovals.length} className={classes.margin}>
                <Typography variant='h6' className={classes.padding} >
                    My Pending Approvals
                </Typography>
            </Badge>
            <List className={classes.root}>
                {pendingApprovals}
            </List>
        </Fragment>
    )
    
}

export default MyApprovals
