import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const EHSAppBar = (props) => {
  const classes = useStyles();
  const { currentUser } = props; 

  const logout = e => {
    props.onLogout(); 
  }

  return (
    <div className={classes.root}>
      {props.currentUser.isAuthenticated ? (
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
               News
            </Typography>
            <Button onClick={logout}>
              <Link to="/">Log Out</Link>
            </Button>
          </Toolbar>
        </AppBar>
      ) : null}
    </div>
  );
}

export default EHSAppBar; 