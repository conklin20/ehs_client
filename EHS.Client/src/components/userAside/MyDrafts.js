import React, { useState, Fragment } from 'react'; 
import { makeStyles } from '@material-ui/core/styles';
import { Hidden, Divider, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      height: '30vh',
      overflowY: 'scroll'
    },

  }));

const MyDrafts = props => {
    const classes = useStyles();

    const drafts = props.drafts.map(d => {
        return (
            <Fragment>
                <ListItem>
                    <ListItemText
                        primary={`${d.employeeId} - ${d.eventDate}`}
                        secondary={d.whatHappened}
                        />
                    <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>        
                <Divider component="li" />
            </Fragment>
        )
    })

    return (     
        <Hidden smDown>
            <Fragment>
                <List className={classes.root}>
                    {drafts}
                </List>
            </Fragment>
        </Hidden>
    )
    
}

export default MyDrafts
