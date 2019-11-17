import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Typography, 
    Grid, 
    TextField, 
    Divider, 
    Button, 
    Paper 
} from '@material-ui/core'; 
import filterEmployeeList from '../../../helpers/filterEmployeeList'; 
import AutoCompleteMulti from '../../shared/AutoCompleteMulti'; 
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
    
    const handleSubmitPeople = e => {
        e.preventDefault();
        //save PeopleInvolved to db 
        if(peopleInvolved.length){       
            props.savePeopleInvolved(peopleInvolved, props.currentUser.user.userId)
                .then(res => {
                    refreshPeopleInvolved();
                    // eslint-disable-next-line
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
                // eslint-disable-next-line
                .filter(pi => pi.roleId == e.target.name) //cant use === due to type difference. Need coercion  
                .map(p => {
                   return  p.comments = e.target.value
                })            
            setPeopleInvolved([ ...peopleInvolved ])
        }

        const values = peopleInvolved                                   // currently saved peopleInvolved records
            .filter(pi => pi.roleId === section.hierarchyAttributeId)   // filter on roleId (HierarchyId)
            .map(person => employees                                    // map over each person in the array 
                .find(emp => emp.value === person.employeeId))          // extract out the value from the employees array 
        
        //append the currentPeople that are not in the Employee list (they may be inactive or have a different hierarchyId now) https://dev.azure.com/dinkin-flicka-engineering/Incident-Investigation/_workitems/edit/41

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
            <form onSubmit={handleSubmitPeople}>  
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