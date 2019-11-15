	import React, { useState, Fragment } from 'react';
	import { Button, Typography } from '@material-ui/core';
	import { makeStyles } from '@material-ui/core/styles';
	import { TextField, CircularProgress } from '@material-ui/core';
	import { authUser } from '../../store/actions/auth';
	import { withRouter } from 'react-router-dom';
	import { connect } from 'react-redux';

	const useStyles = makeStyles(theme => ({
		container: {
			display: 'flex',
			flexDirection: 'column',
			alignContent: 'center',
			flexWrap: 'wrap',
		},
		textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			width: 200,
		},
		dense: {
			marginTop: 19,
		},
		menu: {
			width: 200,
		},
		loggingIn: {
			display: 'flex', 
			flexDirection: 'column',
			margin: theme.spacing(2),
			alignItems: 'center'
		}, 
		button: {
			marginTop: theme.spacing(2), 
		},
	}));

	const AuthForm = (props) => {
		const classes = useStyles();
		const [values, setValues] = useState({
			username: '',
			password: '',
		});
		const [loggingIn, setLoggingIn] = useState(false); 

		const handleChange = name => e => {
			setValues({ ...values, [name]: e.target.value });
		};
			
		const handleSubmit = e => {
			setLoggingIn(true); 
			e.preventDefault(); 

			const authType = props.signUp ? "signup" : "signin";
			props.onAuth(authType, values)
				.then( () => {
					//use react-router to redirect use to dashboard 
					props.history.push("/dashboard");
				})
				.catch(err => {
					console.log(err) 
					setLoggingIn(false); 
				}); 
		}

		const { heading, buttonText , domain, history, removeNotification } = props; 

		// this is react-router, listening for any changes in the route. If there is a change in the route, call removeError() to remove any errors from the page
		history.listen(() => {
			removeNotification(); 
		});

		return (
			<div className="row justify-content-md-center">
				<div className="col-md-6">
					<h2>{heading}</h2>
					<form className={classes.container} noValidate autoComplete="off" onSubmit={handleSubmit}>
						<TextField
							id="standard-name"
							label="Username"
							className={classes.textField}
							value={values.username}
							onChange={handleChange('username')}
							margin="dense"
						/>
						<TextField
							id="standard-password-input"
							label="Password"
							className={classes.textField}
							value={values.password}
							type="password"
							autoComplete="current-password"
							onChange={handleChange('password')}
							margin="dense"
							helperText={`Use your ${domain} credentials`}
						/>
						<Button 
							className={classes.button}
							variant="contained" 
							color="primary" 
							type="submit" 
							disabled={loggingIn}>
								{buttonText}
						</Button>
					</form>
					{loggingIn 
						?  <div className={classes.loggingIn}>
								<Typography variant="h6">
									Logging in...
								</Typography>
								<CircularProgress /> 
							</div>
						: null }
				</div>
			</div>
		);
	}	

	export default withRouter(
		connect(null, 
			{ 
				authUser
			})(AuthForm)
	); 