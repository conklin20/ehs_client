	import React, { useState } from 'react';
	import { Button } from '@material-ui/core';
	import { makeStyles } from '@material-ui/core/styles';
	import TextField from '@material-ui/core/TextField';
	import Notification from '../shared/Notification';
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
	}));

	const AuthForm = (props) => {
		const classes = useStyles();
		const [values, setValues] = useState({
			username: '',
			password: '',
		});	

		const handleChange = name => e => {
			setValues({ ...values, [name]: e.target.value });
		};
			
		const handleSubmit = e => {
			e.preventDefault(); 
			const authType = props.signUp ? "signup" : "signin";
			props.onAuth(authType, values)
				.then( () => {
					//use react-router to redirect use to dashboard 
					props.history.push("/dashboard");
				})
				.catch((err) => {
					console.log(err);
					return; 
				})
		}

		const { heading, buttonText , domain, errors, history, removeError } = props; 

		// this is react-router, listening for any changes in the route. If there is a change in the route, call removeError() to remove any errors from the page
		history.listen(() => {
			removeError(); 
		});

		return (
			<div className="row justify-content-md-center">
				<div className="col-md-6">
					<h2>{heading}</h2>
					{/* How we show an alert with an error message returned from the API */}
					{errors.message && (							
						<Notification
							open={true} 
							variant="error"
							className={classes.margin}
							message={errors.message}	
							removeError={removeError}							
						/>		
					)}
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
						<Button variant="primary" type="submit">
								{buttonText}
						</Button>
					</form>
				</div>
			</div>
		);
	}	

	function mapStateToProps(state){
		return {
		}
	}
	
	export default withRouter(
		connect(mapStateToProps, 
			{ 
				authUser
			})(AuthForm)
	); 