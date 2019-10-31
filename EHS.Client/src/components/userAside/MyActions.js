import React, { Fragment } from 'react'; 
import { makeStyles } from '@material-ui/core/styles';
import { Hidden, Divider, Typography, List, ListItem, ListItemText, Badge } from '@material-ui/core';
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

const MyActions = props => {
    const classes = useStyles();

    // console.log(props); 
    const actions = props.actions.map(a => {
        return (
            <Fragment>   
                <ListItem>
                    <Link to={`/events/si/${a.eventId}/step/4`} className={classes.link} >
                        <ListItemText
                            primary={`${a.eventId} - ${a.dueDate}`}
                            secondary={a.actionToTake}
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
                <Badge color="primary" badgeContent={actions.length} className={classes.margin}>
                    <Typography variant='h6' className={classes.padding} >
                        My Actions
                    </Typography>
                </Badge>
                <List className={classes.root}>
                    {actions}
                </List>
            </Fragment>
        </Hidden>
    )
    
}

export default MyActions
