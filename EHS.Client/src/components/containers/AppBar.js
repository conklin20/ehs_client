import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom'; 
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { deepOrange, blueGrey } from '@material-ui/core/colors';
import SafetyEventForm from '../function/SafetyEventForm';

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
	// const [anchorUserEl, setAnchorUserEl] = useState(null);
	// const [anchorReportEventEl, setAnchorReportEventEl] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [showSafetyEventForm, setShowSafetyEventForm] = useState(false); 

	const { currentUser } = props; 

	const logout = e => {
		props.onLogout();
	}

	const handleMenuClick = (event) => {
		switch(event.currentTarget.name){
			case 'eventMenu':
				return setAnchorEl(event.currentTarget);
				// return setAnchorReportEventEl(event.currentTarget);
			case 'userMenu':
				return setAnchorEl(event.currentTarget);
				// return setAnchorUserEl(event.currentTarget);
			default:
				return 'Invalid target'				
		}
	}

	const handleClose = (event) => {
		console.log(event.currentTarget.name)
		setAnchorEl(null);
	}

	return (
		<div className={classes.root}>
		{currentUser.isAuthenticated ? (
			<Fragment>
				<AppBar position="static" >
				<Toolbar variant="dense">
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
					<MenuIcon />
					</IconButton>            
					<Typography variant="h6" className={classes.title}>
						<Button aria-controls="event-menu" aria-haspopup='true' name='eventMenu' onClick={handleMenuClick}>
							Report Event
						</Button>
						<Menu 
							id='event-menu'
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem name='reportSafetyIncident' onClick={handleClose}>Report Safety Incident</MenuItem>
						</Menu>
					</Typography> 
					
					<div className={classes.userAccount}>
						<Typography variant="h6">
							{`Welcome, ${currentUser.user.firstName}!`}
						</Typography>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							name="userMenu"
							onClick={handleMenuClick}
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
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>
								Account Settings
							</MenuItem>
							<MenuItem onClick={logout}>
								<Link to="/">Log Out</Link>
							</MenuItem>
						</Menu>
					</div>
				</Toolbar>
				</AppBar>
				
			</Fragment>
		) : null}
		</div>
	);
}

export default EHSAppBar; 