import React, { useEffect, Fragment } from 'react';
import { Typography, Grid, TextField } from '@material-ui/core'; 
import AutoComplete from '../inputs/AutoComplete'; 
// import { fetchFullTree } from '../../../store/actions/hierarchyData'; 

const EventLocation = (props) => {
    const classes = props.useStyles();

    const { hierarchyData, values, handleAutoCompleteChange } = props; 
    
    //generate the list of options for the logical/dept dropwdown list 
    const logicalOptions = hierarchyData.logicalHierarchyData.map(hierarchy => ({
        value: hierarchy.hierarchyId, 
        label: hierarchy.hierarchyName, 
        selected: hierarchy.hierarchyId === values.departmentId ? true : false  
    }));
    const physicalOptions = hierarchyData.physicalHierarchyData.map(hierarchy => ({
        value: hierarchy.hierarchyId, 
        label: hierarchy.hierarchyName,
        selected: hierarchy.hierarchyId === values.localeId ? true : false  
    }));
    
    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Event Location
            </Typography>
            <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                Instructions: Select which department the event took place in, as well as the physical location where the event took place. 
                These fields will dictate functionality in the coming sections. 
            </Typography>       				
            <Grid container spacing={2}>  
                <Grid item xs={12} md={6}>							
                    <AutoComplete
                        name="departmentId"
                        options={logicalOptions}
                        label="Logical Hierarchy"                        
                        placeholder="Select Hierarchy"
                        handleChange={handleAutoCompleteChange}
                        value={logicalOptions.filter(o => o.selected === true)}
                        className={classes.select}
                    >
                    </AutoComplete> 
                </Grid>
                <Grid item xs={12} md={6}>							
                    <AutoComplete
                        name="localeId"
                        options={physicalOptions}
                        label="Physical Hierarchy"
                        placeholder="Select Hierarchy"
                        handleChange={handleAutoCompleteChange}
                        value={physicalOptions.filter(o => o.selected === true)}
                    >
                    </AutoComplete> 
                </Grid>
            </Grid>
        </Fragment>
    );
}	

export default EventLocation; 