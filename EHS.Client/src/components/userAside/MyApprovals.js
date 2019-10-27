import React, { useState, Fragment } from 'react'; 
import { makeStyles } from '@material-ui/core/styles';
import { Hidden, Divider, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Badge } from '@material-ui/core';
import { Link } from 'react-router-dom';

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

    // console.log(props); 
    const pendingApprovals = props.pendingApprovals.map(a => {
        // console.log(a.action)
        return (
            <Fragment>   
                <ListItem>
                    <Link to={`/events/si/${a.action.eventId}/step/4`} className={classes.link} >
                        <ListItemText
                            primary={`${a.action.eventId} - ${a.action.completionDate}`}
                            secondary={a.action.actionToTake}
                            />
                    </Link>
                </ListItem>        
                <Divider component="li" />
            </Fragment>
        )
    })

    return (     
        <Hidden smDown>
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
        </Hidden>
    )
    
}

export default MyApprovals
