import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, TextField, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from '@material-ui/core'; 
import filterLookupDataByKey from '../../../helpers/filterLookupDataByKey'; 
import filterEmployeeList from '../../../helpers/filterEmployeeList'; 
import AutoCompleteMulti from '../inputs/AutoCompleteMulti'; 
import { savePeopleInvolved } from '../../../store/actions/peopleInvolved';
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
    paper: {
      padding: theme.spacing(3, 2),
      margin: theme.spacing(2), 
    },
}));

const PeopleInvolved = (props) => {
    const classes = useStyles();    
    
    const { event, refreshPeopleInvolved } = props; 
    
    //building each lookup data object
    const employees = filterEmployeeList(props.lookupData['employees'], null, 4001, true, false)
    const supervisors = filterEmployeeList(props.lookupData['employees'], event['supervisorId'], 4001, true, true)
    const involvement = props.lookupData['logicalHierarchyAttributes'].filter(attr => attr.key === 'Employee Involvement');

    
    const currentPeople = event.peopleInvolved.map(pe => {
        return {
            roleId: pe.roleId, 
            eventId: pe.eventId, 
            employeeId: pe.employeeId, 
            comments: pe.comments
        }
    });
    
    const [peopleInvolved, setPeopleInvolved] = useState(currentPeople);
    const [openDialog, setOpenDialog] = useState(false); 
    
    const handleClickOpen = () => {
        setOpenDialog(true); 
    }; 

    const handleClose = (e) => {
        setOpenDialog(false);
    }
    
    const handleSubmit = () => {
        //save PeopleInvolved to db 
        if(peopleInvolved.length){       
            props.savePeopleInvolved(peopleInvolved, props.currentUser.user.userId)
                .then(res => {
                    refreshPeopleInvolved(); 
                    return res === 'PeopleInvolved' ?  handleClickOpen() : null
                })
                .catch(err => {
                    console.log(err); 
                })                               
        };
    }

    const sections = involvement.map(section => {
        
        const handleAutoCompleteMultiChange = (state, action)  => {
            switch (action.action){
                case 'remove-value':                    
                    return setPeopleInvolved(peopleInvolved.filter(pi => pi.RoleId !== action.name && pi.employeeId !== action.removedValue.value)) 
                case 'clear':                    
                    return setPeopleInvolved(peopleInvolved.filter(pi => pi.roleId !== action.name)) 
                case 'select-option':                    
                    const newPerson = {
                        roleId: action.name, 
                        eventId: event.eventId, 
                        employeeId: action.option.value,                
                    }
                    return setPeopleInvolved( [ ...peopleInvolved, { ...newPerson } ] );                    
                default:
                    console.log(`Invalid action: ${action.action}`)
            }
        }

        // Handle field change 
        const handleChange = e => {
            peopleInvolved
                .filter(pi => pi.roleId == e.target.name)
                .map(p => {
                    p.comments = e.target.value
                })            
            setPeopleInvolved([ ...peopleInvolved ])
        }

        const values = peopleInvolved                                               //currently saved peopleInvolved records
                        .filter(pi => pi.roleId === section.hierarchyAttributeId)   // filter on roleId (HierarchyId)
                        .map(person => employees                                    // map over each person in the arry 
                            .find(emp => emp.value === person.employeeId))          // extract out the value from the employees array 
        
        // values.map(v => v.selected = true); 
        console.log(section)
        return (
            <Paper className={classes.paper}>
                <Typography variant='h5' gutterBottom>
                    {section.value}
                </Typography>
                <Grid item xs={12}>											
                    <AutoCompleteMulti
                        key={section.hierarchyAttributeId}
                        name={section.hierarchyAttributeId}
                        options={section.value.includes('Supervisor') ? supervisors : employees}
                        // label="Event Status"
                        placeholder="Type or select names..."
                        handleChange={handleAutoCompleteMultiChange}
                        value={values}
                        className={classes.formControl}
                        >
                    </AutoCompleteMulti>
                    <Typography variant='caption' >
                        Hint: Start typing a name, and then hit "Tab" when you've found the person, then start typing the next name (if applicable).
                    </Typography>
                </Grid>
                <Grid item xs={12}>		
                    <TextField
                        key={section.hierarchyAttributeId}
                        name={section.hierarchyAttributeId}
                        placeholder={`${section.value} Comments...`}
                        variant='outlined'
                        className={classes.formControl}
                        onChange={handleChange}
                        value={
                            peopleInvolved.filter(pi => pi.roleId === section.hierarchyAttributeId).length 
                                ? peopleInvolved.find(pi => pi.roleId === section.hierarchyAttributeId).comments 
                                : ''
                        }
                        fullWidth
                    >
                    </TextField>
                    <Divider className={classes.divider} />
                </Grid>
            </Paper>
        )
    })

    return (
        <Fragment>            
            <Dialog 
                open={openDialog}
                onClose={handleClose}
                aria-labelledby='confirm-dialog-title'
                aria-describedby='confirm-dialog-description'
            >
                <DialogTitle id='confirm-dialog-title'>{"Saved Successfully!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='confirm-dialog-description'>
                        {`Employees assigned to roles have been successfully saved to the database. `}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button id='success' onClick={handleClose} color='primary' autofocus>OK</Button>
                </DialogActions>
            </Dialog>
            <form onSubmit={handleSubmit}>  
                <Typography variant='h4' gutterBottom>
                    People Involved
                </Typography>

                {sections}
                
                <Button 
                    type="submit"
                    name='savePeople'
                    variant='contained' 
                    color="secondary" 
                    className={classes.button}
                    fullWidth
                >
                    Save
                </Button>
            </form>        
            <Divider />
        </Fragment>
    );
}	

function mapStateToProps(state) {
	// console.log(state)
	return {
			lookupData: state.lookupData,
			currentUser: state.currentUser,
	};
}

export default connect(mapStateToProps, { 
    savePeopleInvolved
})(PeopleInvolved); 