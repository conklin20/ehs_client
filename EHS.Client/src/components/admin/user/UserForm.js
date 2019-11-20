import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux';
import { Grid, Typography, FormControl, FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, List, ListItem, ListItemText } from '@material-ui/core';
import AutoComplete from '../../shared/AutoComplete';
import { makeStyles } from '@material-ui/core/styles';
import { fetchEmployee } from '../../../store/actions/lookupData';
import { postNewUser, updateUser } from '../../../store/actions/users'; 
import { addNotification } from '../../../store/actions/notifications'; 

const useStyles = makeStyles(theme => ({
    formControl: {
		margin: theme.spacing(2),
		width: '90%',
	},
    button: {
        marginRight: theme.spacing(4), 
        marginBottom: theme.spacing(2), 
        width: '20%',
    },
}));

const UserForm = props => {
    const classes = useStyles(); 

    const { showUserForm, handleShowUserForm, userIdToEdit, lookupData, currentUser, refreshUsers, users, dispatch } = props;

    const [user, setUser] = useState({
        userId: userIdToEdit, 
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: null,
        enabled: false,
        validUserId: userIdToEdit ? true : false,
        isExisting: userIdToEdit ? true : false 
    })    

    const [validationErrors, setValidationErrors] = useState([])
    // const [serverValidationErrors, setServerValidationErrors] = useState([]); //not currently using 
    const [hasChange, setHasChange] = useState(false)
    
 	// Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        if(userIdToEdit) handleGetEmployee(); 

		return () => {
			console.log('UserForm Component Unmounting')
		}

	}, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes   
     
    //filtering on the highest level of hierarchies (Department and PlantArea)
    const logicalOptions = lookupData.logicalHierarchies
        .sort((a, b) => a.hierarchyLevel.hierarchyLevelNumber - b.hierarchyLevel.hierarchyLevelNumber)
        .map(h => ({
            value: h.hierarchyId, 
            label: `${h.hierarchyName} (${h.hierarchyLevel.hierarchyLevelAlias || h.hierarchyLevel.hierarchyLevelName})`, 
    }));

    const physicalOptions = lookupData.physicalHierarchies
        .sort((a, b) => a.hierarchyLevel.hierarchyLevelNumber - b.hierarchyLevel.hierarchyLevelNumber)
        .map(h => ({
            value: h.hierarchyId, 
            label: `${h.hierarchyName} (${h.hierarchyLevel.hierarchyLevelAlias || h.hierarchyLevel.hierarchyLevelName})`, 
    }));
    
    // console.log(currentUser.user.roleLevel)
    const roleOptions = lookupData.userRoles
        .filter(r => r.roleLevel <= currentUser.user.roleLevel) //can only create a user with a role at or below your role level
        .sort((a, b) => a.roleLevel - b.roleLevel)
        .map(r => ({
            value: r.userRoleId, 
            label: `${r.roleName} (Level ${r.roleLevel})`,
    }))
    //check if user's role level you're trying to edit is at or below your role level
    // console.log(roleOptions.find(o => o.value == user.roleId))
    const canEdit = roleOptions.find(o => o.value == user.roleId) || !userIdToEdit || userIdToEdit === currentUser.user.userId ? true : false; 
    
    // Handle field change 
    const handleChange = () => e => {
        setHasChange(true); 
        setUser({ ...user, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value === '' ? null : e.target.value})
    }
    
    //for the react-select (single) component
    const handleAutoCompleteChange = (state, action)  => {
        setHasChange(true); 
        setUser({ ...user, [action.name]: state.value });
        
        //remove error 
        setValidationErrors(validationErrors.filter(e => e.key !== action.name))
    }

    const handleGetEmployee = () => {
        //if setting up a new user, grab their info from the employee table once their userId/employeeId is entered
        if(user.userId){

            fetchEmployee(user.userId)()
                .then(res => {
                    if(!res.error){
                        //check if user already exists 
                        if(users.find(u => u.userId === user.userId)) {   
                            const existingUser = users.find(u => u.userId === user.userId) 
                            setUser({                                
                                userId: existingUser.userId,
                                firstName: existingUser.firstName,
                                lastName: existingUser.lastName, 
                                email: existingUser.email,
                                phone: existingUser.phone === '' ? null : existingUser.phone,
                                logicalHierarchyId: existingUser.logicalHierarchyId, 
                                physicalHierarchyId: existingUser.physicalHierarchyId, 
                                roleId: existingUser.roleId, 
                                enabled: existingUser.enabled,
                                validUserId: true,
                                isExisting: true,
                            });
                        } else {                                
                            setUser({
                                ...user, 
                                firstName: res.data.firstName, 
                                lastName: res.data.lastName, 
                                email: res.data.email, 
                                enabled: res.data.active,
                                validUserId: true
                            });
                            //clear validation errors 
                            setValidationErrors(validationErrors
                                .filter(e => e.key !== 'userId' 
                                        && e.key !== 'firstName'  
                                        && e.key !== 'lastName' 
                                        && e.key !== 'email'));
                        }
                    } else {
                        setUser( {
                            firstName: '', 
                            lastName: '', 
                            email: '', 
                            enabled: false,
                            validUserId: false
                        })
                        setValidationErrors([
                            ...validationErrors, 
                            { 
                                key: 'userId',
                                value: 'UserId / Employee Not Found' 
                            },
                        ])
                        console.log('Employee Not Found: ', res.error)
                    }
                })
        }
    }

    //we have inline validation on some fields. and then this function will validate the entire form on submit 
    const handleValidateForm = () => {
        let tempValidationErrors = []

        //valid e number
        if(!user.validUserId) tempValidationErrors.push({ key: 'userId', value: 'UserId / Employee Not Found' })

        //validate required fields
        if(!user.userId) tempValidationErrors.push({ key: 'userId', value: 'UserId is Required'})
        if(!user.firstName) tempValidationErrors.push({ key: 'firstName', value: 'First Name is Required'})
        if(!user.lastName) tempValidationErrors.push({ key: 'lastName', value: 'Last Name is Required'})
        if(!user.email) tempValidationErrors.push({ key: 'email', value: 'Email is Required'})
        if(!user.hasOwnProperty('logicalHierarchyId') || !user.logicalHierarchyId) tempValidationErrors.push({ key: 'logicalHierarchyId', value: 'Logical Hierarchy is Required'})
        if(!user.hasOwnProperty('physicalHierarchyId') || !user.physicalHierarchyId) tempValidationErrors.push({ key: 'physicalHierarchyId', value: 'Physical Hierarchy is Required'})
        if(!user.hasOwnProperty('roleId') || !user.roleId) tempValidationErrors.push({ key: 'roleId', value: 'Role is Required'})

        //set the validation errors 
        setValidationErrors([...validationErrors, ...tempValidationErrors])
        
        //since setValidationErrors wont necessairly complete before we check the length, 
        //send a true/false back to the handleSaveUser function indicating if the form is valid or not 
        return [...validationErrors, ...tempValidationErrors].length ? false : true 
    }    

    const handleSaveUser = () => {
        const formIsValid = handleValidateForm(); 
        // console.log(formIsValid)
        if(formIsValid && validationErrors.length === 0) {
            console.log(user); 
            user.isExisting 
            ? 
            updateUser(user, currentUser.user.userId)()
                .then(res => {
                    if(res.status === 202) {
                        refreshUsers()
                        dispatch(addNotification(`Successfully updated user ${user.userId}`, 'success')); 
                    } else {
                        console.log(res); 
                        dispatch(addNotification(`Failed to update user. Error: ${res.data.errors}`, 'error')); 
                        // setServerValidationErrors(res.data.errors)
                    }                    
                })
            :
            postNewUser(user, currentUser.user.userId)()
                .then(res => {
                    if(res.status === 201){
                        refreshUsers()
                        dispatch(addNotification(`Successfully created user ${user.userId}`, 'success')); 
                    } else {
                        console.log(res); 
                        dispatch(addNotification(`Error creating user ${user.userId}. Error: ${res.error.message}`, 'error')); 
                    }
                })
        }
    }

    return (
        <Fragment>
			<Dialog 
                open={showUserForm} 
                onClose={handleShowUserForm} 
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle id="form-dialog-title">
                    { userIdToEdit ? 'Edit User' : 'New User' }
                </DialogTitle>
                <DialogContent>		  
                    <form className={classes.form} >
                        <fieldset disabled={canEdit ? false : true }>						
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <Typography variant="h6">
                                        {canEdit ? null : 'Read-Only'}
                                    </Typography>
                                </Grid>		
                                <Grid item xs={12} md={4}>			
                                    <TextField
                                        required
                                        error={validationErrors.find(e => e.key === 'userId') ? true : false }
                                        helperText={
                                            validationErrors.find(e => e.key === 'userId') 
                                            ? validationErrors.find(e => e.key === 'userId').value 
                                            : 'Enter the users employeeId'
                                        }
                                        name="userId"
                                        label="UserId"
                                        placeholder="UserId"
                                        value={user.userId}
                                        onChange={handleChange()}
                                        onBlur={handleGetEmployee}
                                        className={classes.formControl}
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: userIdToEdit ? true : false, //can only edit this if its a new user. Must setup a new account if someone needs to change their userId
                                        }}
                                        
                                    />
                                </Grid>	
                                <Grid item xs={12} md={4}>			
                                    <TextField
                                        required
                                        error={validationErrors.find(e => e.key === 'firstName') ? true : false }
                                        helperText={
                                            validationErrors.find(e => e.key === 'firstName') 
                                            ? validationErrors.find(e => e.key === 'firstName').value 
                                            : ''
                                        }
                                        name="firstName"
                                        label="First Name"
                                        placeholder="First Name"
                                        value={user.firstName}
                                        onChange={handleChange()}
                                        className={classes.formControl}
                                        margin="normal"
                                        variant="outlined"                                
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>			
                                    <TextField
                                        required
                                        error={validationErrors.find(e => e.key === 'lastName') ? true : false }
                                        helperText={
                                            validationErrors.find(e => e.key === 'lastName') 
                                            ? validationErrors.find(e => e.key === 'lastName').value 
                                            : ''
                                        }
                                        name="lastName"
                                        label="Last Name"
                                        placeholder="Last Name"
                                        value={user.lastName}
                                        onChange={handleChange()}
                                        className={classes.formControl}
                                        margin="normal"
                                        variant="outlined"                                
                                    />
                                </Grid>
                                <Grid item xs={12} md={5}>			
                                    <TextField
                                        required
                                        error={validationErrors.find(e => e.key === 'email') ? true : false }
                                        helperText={
                                            validationErrors.find(e => e.key === 'email') 
                                            ? validationErrors.find(e => e.key === 'email').value 
                                            : 'Enter the users email address'
                                        }
                                        name="email"
                                        label="Email"
                                        placeholder="Email"
                                        type="email"
                                        value={user.email}
                                        onChange={handleChange()}
                                        onBlur={(e) => {
                                            //inline validation.
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)
                                                ? setValidationErrors(validationErrors.filter(err => err.key !== e.target.name))
                                                : setValidationErrors([...validationErrors, { key: e.target.name, value: 'Invalid email address' }])}
                                        }
                                        className={classes.formControl}
                                        margin="normal"
                                        variant="outlined"                                
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>			
                                    <TextField
                                        error={validationErrors.find(e => e.key === 'phone') ? true : false }
                                        helperText={
                                            validationErrors.find(e => e.key === 'phone') 
                                            ? validationErrors.find(e => e.key === 'phone').value 
                                            : 'Enter the users phone number'
                                        }
                                        name="phone"
                                        label="Phone"
                                        placeholder="(555) 553-1234"
                                        value={user.phone}
                                        onChange={handleChange()}
                                        onBlur={(e) => {
                                            //inline validation.
                                            return (!e.target.value || /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(e.target.value))
                                            ? setValidationErrors(validationErrors.filter(err => err.key !== 'phone'))
                                            : setValidationErrors([...validationErrors, { key: 'phone', value: 'Inavlid phone number'}])
                                        }}
                                        className={classes.formControl}
                                        margin="normal"
                                        variant="outlined"                                
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>	
                                    <Fragment/>
                                </Grid>
                                { canEdit ?
                                    <Fragment>
                                        <Grid item xs={12} md={4}>							
                                            <AutoComplete
                                                required
                                                error={validationErrors.find(e => e.key === 'logicalHierarchyId') ? true : false }
                                                helperText={
                                                    validationErrors.find(e => e.key === 'logicalHierarchyId') 
                                                    ? validationErrors.find(e => e.key === 'logicalHierarchyId').value 
                                                    : ''
                                                }
                                                name="logicalHierarchyId"
                                                options={logicalOptions}
                                                label="Logical Hierarchy"                        
                                                placeholder="Select Hierarchy"
                                                handleChange={handleAutoCompleteChange}
                                                value={user.logicalHierarchyId ? logicalOptions.find(o => o.value === user.logicalHierarchyId) : null}
                                                className={classes.formControl}
                                                margin="normal"
                                            >
                                            </AutoComplete> 
                                        </Grid>	
                                        <Grid item xs={12} md={4}>							
                                            <AutoComplete
                                                required
                                                error={validationErrors.find(e => e.key === 'physicalHierarchyId') ? true : false }
                                                helperText={
                                                    validationErrors.find(e => e.key === 'physicalHierarchyId') 
                                                    ? validationErrors.find(e => e.key === 'physicalHierarchyId').value 
                                                    : ''
                                                }
                                                name="physicalHierarchyId"
                                                options={physicalOptions}
                                                label="Physical Hierarchy"                        
                                                placeholder="Select Hierarchy"
                                                handleChange={handleAutoCompleteChange}
                                                value={user.physicalHierarchyId ? physicalOptions.find(o => o.value === user.physicalHierarchyId) : null}
                                                className={classes.formControl}
                                                margin="normal"
                                            >
                                            </AutoComplete> 
                                        </Grid>	
                                        <Grid item xs={12} md={4}>							
                                            <AutoComplete
                                                required
                                                error={validationErrors.find(e => e.key === 'roleId') ? true : false }
                                                helperText={
                                                    validationErrors.find(e => e.key === 'roleId') 
                                                    ? validationErrors.find(e => e.key === 'roleId').value 
                                                    : 'See below for role breakdown'
                                                }
                                                name="roleId"
                                                options={roleOptions}
                                                label="Role"                        
                                                placeholder="Select Role"
                                                handleChange={handleAutoCompleteChange}
                                                value={user.roleId ? roleOptions.find(o => o.value === user.roleId) : null}
                                                className={classes.formControl}
                                                margin="normal"
                                            >
                                            </AutoComplete> 
                                        </Grid>	
                                    </Fragment>
                                : null }   
                                <Grid item xs={12} md={5}>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl className={classes.formControl}>									
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name='enabled'
                                                    checked={Boolean(user.enabled)}
                                                    onChange={handleChange()}
                                                    color="primary"
                                                />
                                            }
                                            label="Account Enabled"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography variant='h6'>
                                        Role Breakdown
                                    </Typography>
                                    <Typography variant='subtitle2'>
                                        Note: Levels are somewhat arbitrary, and just give an idea of how much access one role has relative to other roles. 1 being the lowest level. 
                                    </Typography>
                                    <Typography variant='body2'>
                                        <List>
                                            {lookupData.userRoles.map(r => {
                                                return (
                                                    <ListItem>
                                                        <ListItemText primary={`${r.roleName} - Level ${r.roleLevel} - ${r.roleCapabilities}`}/>
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </fieldset>
                    </form>				
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleSaveUser} 
                        color="primary"
                        variant="contained"
                        className={classes.button}
                        disabled={!hasChange}
                    >
                        { user.isExisting ? 'Update User' : 'Save New User' }
                    </Button>
                </DialogActions>
            </Dialog>
        

        </Fragment>
    )
}

export default connect(null, null)(UserForm); 