import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, TextField, Divider, Checkbox, FormControlLabel  } from '@material-ui/core'; 
import filterLookupDataByKey from '../../../helpers/filterLookupDataByKey'; 
import filterEmployeeList from '../../../helpers/filterEmployeeList'; 
import AutoCompleteMulti from '../inputs/AutoCompleteMulti'; 

const useStyles = makeStyles(theme => ({

}));

const PeopleInvolved = (props) => {
    const classes = props.useStyles();    
    
    const { lookupData, currentUser, event, people } = props; 
    
    //building each lookup data object
    const employees = filterEmployeeList(lookupData['employees'], null, 4001, true, false)
    const involvement = lookupData['logicalHierarchyAttributes'].filter(attr => attr.key === 'Employee Involvement');
    
    const [peopleInvolved, setPeopleInvolved] = useState([
        {
            hierarchyAttributeId: involvement.filter(attr => attr.value === 'Supervisor')[0].hierarchyAttributeId, 
            eventId: event.eventId, 
            employeeId: event.supervisorId,
            comments: 'Supervisor automatically added from step 3',
        }
    ])

    
    //for the react-select (multi) component
    const handleAutoCompleteMultiChange = (data, action) => e => {
        console.log(data);
        // handleAutoCompleteChange={(data, action) => dispatch({ type: action.name, value: data })}
    }


    const sections = involvement.map(section => {
        // if(section.value === "Supervisor"){
        //     console.log(peopleInvolved.filter(pi => pi.hierarchyAttributeId === section.hierarchyAttributeId))
        //     console.log(
        //         employees.filter(e => {
        //             e.value === peopleInvolved.filter(pi => pi.hierarchyAttributeId === section.hierarchyAttributeId)
        //         })
        //     )
        // }

        return (
            <Fragment>
                <Typography variant='h5' gutterBottom>
                    {section.value}
                </Typography>
                <Grid item xs={12}>											
                    <AutoCompleteMulti
                        name={section.value}
                        options={employees}
                        // label="Event Status"
                        // placeholder="Select statuses"
                        handleChange={handleAutoCompleteMultiChange}
                        value={peopleInvolved.filter(pi => pi.hierarchyAttributeId === section.hierarchyAttributeId)}
                        className={classes.formControl}
                        >
                    </AutoCompleteMulti> 
                </Grid>
                <Grid item xs={12}>		
                    <TextField
                        name={`${section.value} Comments`}
                        placeholder={`${section.value} Comments...`}
                        variant='outlined'
                        className={classes.formControl}
                        fullWidth
                    >
                    </TextField>
                    <Divider className={classes.divider} />
                </Grid>
            </Fragment>
        )
    })

    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                People Involved
            </Typography>
            {sections}
        </Fragment>
    );
}	

export default PeopleInvolved; 