import { React } from 'react';
import { Grid, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
}));

const ListTemplate = props => {
    const classes = useStyles();

    
    const rows = props.drafts.map(r => {
        <ListItem>
            <ListItemText
            primary="Single-line item"
            secondary="secondary"
            />
            <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
            </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    }); 

    return (
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Avatar with text and icon
          </Typography>
          <div className={classes.demo}>
            <List dense={true}>
                {rows}
            </List>
          </div>
        </Grid>
    )
}

export default ListTemplate;