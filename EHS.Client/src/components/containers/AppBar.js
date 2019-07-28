import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { deepOrange, blueGrey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: '60px',
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    marginLeft: 10, 
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  userAccount: {
    display: 'flex',
    alignItems: 'center',
  }
}));

const EHSAppBar = (props) => {
  const classes = useStyles();
  const theme = useTheme(); 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { currentUser } = props; 

  const logout = e => {
    props.onLogout(); 
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div className={classes.root}>
      {currentUser.isAuthenticated ? (
        <AppBar position="static" >
          <Toolbar variant="dense">
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Dashboard
              Report
            </Typography>
            <div className={classes.userAccount}>
              <Typography variant="h6">
                {`Welcome, ${currentUser.user.firstName}!`}
              </Typography>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar className={classes.avatar}>{currentUser.user.firstName[0] + currentUser.user.lastName[0]}</Avatar>  
                {/* <AccountCircle /> */}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Account Settings</MenuItem>
                <MenuItem onClick={logout}>
                  <Link to="/">Log Out</Link>
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      ) : null}
    </div>
  );
}

export default EHSAppBar; 