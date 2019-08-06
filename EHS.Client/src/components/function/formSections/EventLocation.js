import React, { useEffect, Fragment } from 'react';
import { Typography, Grid, TextField } from '@material-ui/core'; 

import AutoComplete from '../inputs/AutoComplete'; 
// import { fetchFullTree } from '../../../store/actions/hierarchyData'; 

const EventLocation = (props) => {
    const classes = props.useStyles();

    const { hierarchyData, values, handleAutoCompleteChange } = props; 
    
    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
		//fetch lookup data, which will be used in various places 
        // const logicalLocations = fetchFullTree(4001, 600); 
        // console.log(logicalLocations); 
        // const physicalLocations = fetchFullTree(4000, 600); 
        // console.log(physicalLocations); 

		return () => {
			console.log('Cleanup function (ComponentDidUnmount)')
		}
	}, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 


    const logical = hierarchyData.logicalHierarchyData.map(hierarchy => ({
        value: hierarchy.hierarchyId, 
        label: hierarchy.hierarchyName
    }));
    const physical = hierarchyData.physicalHierarchyData.map(hierarchy => ({
        value: hierarchy.hierarchyId, 
        label: hierarchy.hierarchyName
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
                        name="logicalHierarchies"
                        options={logical}
                        label="Logical Hierarchy"                        
                        placeholder="Select Hierarchy"
                        handleChange={handleAutoCompleteChange}
                        value={values.departmentId}
                    >
                    </AutoComplete> 
                </Grid>
                <Grid item xs={12} md={6}>							
                    <AutoComplete
                        name="physicalHierarchyies"
                        options={physical}
                        label="Physical Hierarchy"
                        placeholder="Select Hierarchy"
                        handleChange={handleAutoCompleteChange}
                        value={values.localeId}
                    >
                    </AutoComplete> 
                </Grid>
            </Grid>
        </Fragment>
    );
}	

export default EventLocation; 