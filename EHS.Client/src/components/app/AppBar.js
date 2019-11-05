import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom'; 
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from '@material-ui/core';
import { MIN_ADMIN_ROLE_LEVEL } from '../admin/adminRoleLevel';
import Logo  from '../../images/vista-outdoor-vector-logo.png';

const useStyles = makeStyles(theme => ({
  toolbar: {
	display: 'flex',
	justifyContent: 'space-between',
  },
  menuButton: {
	  color: 'white',
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    marginLeft: 10, 
    color: '#fff',
    backgroundColor: theme.palette.secondary.dark,
  },
  userAccount: {
    display: 'flex',
    alignItems: 'center',
  }, 
  brand: { 
	  height: '4em',
	//   backgroundColor: 'red',
	  margin: theme.spacing(1),
  }, 
  link: {
    textDecoration: 'inherit',
    color: 'inherit',
    cursor: 'pointer',
  }
}));

const EHSAppBar = (props) => {
	const classes = useStyles();

	const [userAnchorEl, setUserAnchorEl] = useState(null);
	const [reportEventAnchorEl, setReportEventAnchorEl] = useState(null);
	const [sysManagementAnchorEl, setSysManagementAnchorEl] = useState(null);

	const { currentUser } = props; 

	const logout = e => {
		props.onLogout();
	}

	const handleMenuClick = (event) => {
		// console.log(event.currentTarget.name); 
		switch(event.currentTarget.name){
			case 'eventMenu':
				return setReportEventAnchorEl(event.currentTarget);
				// return setAnchorReportEventEl(event.currentTarget);
			case 'userMenu':
				return setUserAnchorEl(event.currentTarget);
				// return setAnchorUserEl(event.currentTarget);
			case 'systemManagementMenu':
				return setSysManagementAnchorEl(event.currentTarget)
			default:
				return 'Invalid target'	
		}
	}

	return (
		<Fragment>
			{currentUser.isAuthenticated ? (
				<Fragment>
					<AppBar position="static" >
						<Toolbar variant="dense" className={classes.toolbar}>
							<div>
								<Link to="/dashboard" >
									<img className={classes.brand} src={Logo} alt="Home" />
								</Link>         
							</div>		
							<div>
								<Typography variant="h6" className={classes.title}>
									<Button 
										name='eventMenu' 
										className={classes.menuButton}
										onClick={handleMenuClick}
										size="large" 
									>
										Report Event
									</Button>
									<Menu 
										id='event-menu'
										anchorEl={reportEventAnchorEl}
										keepMounted
										open={Boolean(reportEventAnchorEl)}
										onClose={() => setReportEventAnchorEl(null)}
									>
										<MenuItem>
											<Link className={classes.link} to="/events/si/new">
												<Button 
													name='reportSafetyIncident' 
													onClick={handleMenuClick}
												>
													Report Safety Incident
												</Button> 
											</Link>	
										</MenuItem>
									</Menu>
									{ currentUser.user.roleLevel >= MIN_ADMIN_ROLE_LEVEL
										?
										<Fragment>
											<Button 
												name='systemManagementMenu' 
												className={classes.menuButton}
												onClick={handleMenuClick}
												size="large" 
											>
												System Management
											</Button>
											<Menu 
												id='system-mangement-menu'
												anchorEl={sysManagementAnchorEl}
												keepMounted
												open={Boolean(sysManagementAnchorEl)}
												onClose={() => setSysManagementAnchorEl(null)}
											>
												<MenuItem>
													<Link className={classes.link} to="/manage/users">
														<Button 
															name='manageUsers' 
															onClick={handleMenuClick}
														>
															Manage Users
														</Button> 
													</Link>	
												</MenuItem>
												<MenuItem>
													<Link className={classes.link} to="/manage/hierarchies">
														<Button 
															name='manageHierarchies' 
															onClick={handleMenuClick}
														>
															Manage Hierarchies
														</Button> 
													</Link>	
												</MenuItem>
											</Menu>
										</Fragment>
										: null 
									}
								</Typography> 
							</div>		
							<div>
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
										anchorEl={userAnchorEl}
										anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
										}}
											keepMounted
											transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(userAnchorEl)}
										onClose={() => setUserAnchorEl(null)}
									>
										<MenuItem onClick={() => setUserAnchorEl(null)}>
											<Link className={classes.link} to="/user/profile">Account Settings</Link>										
										</MenuItem>
										<MenuItem onClick={logout}>
											<Link className={classes.link} to="/logout">Log Out</Link>
										</MenuItem>
									</Menu>
								</div>
							</div>							
						</Toolbar>
					</AppBar>				
				</Fragment>
			) : null}
		</Fragment>
	);
}

export default EHSAppBar; 