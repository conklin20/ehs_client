import React, { useEffect, Fragment } from 'react';
import { Typography, Grid, Divider } from '@material-ui/core'; 
import AutoComplete from '../inputs/AutoComplete'; 
// import { fetchFullTree } from '../../../store/actions/hierarchyData'; 

const EventLocation = (props) => {
    const classes = props.useStyles();

    const { lookupData, values, handleAutoCompleteChange, handleRefreshData } = props; 
    
    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
		return () => {
            //when component unmounts, go retrieve the new lookup data given the selctions made 
            //idea here is that we dont need to query the db everytime the selection changes, only when the user advances to the next screen
            handleRefreshData(); 
		}
	}, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

    
    //generate the list of options for the logical/dept dropwdown list
    //filtering on the highest level of hierarchies (Department and PlantArea)
    const logicalOptions = lookupData.logicalHierarchies.filter(h => h.hierarchyLevel.hierarchyLevelNumber === 600).map(hierarchy => ({
        value: hierarchy.hierarchyId, 
        label: hierarchy.hierarchyName, 
        selected: hierarchy.hierarchyId === values.departmentId ? true : false  
    }));
    const physicalOptions = lookupData.physicalHierarchies.filter(h => h.hierarchyLevel.hierarchyLevelNumber === 600).map(hierarchy => ({
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
            <Divider/>    		 				
            <Grid container spacing={2}>  
                <Grid item xs={12} md={6}>							
                    <AutoComplete
                        name="departmentId"
                        options={logicalOptions}
                        label="Logical Hierarchy"                        
                        placeholder="Select Department"
                        handleChange={handleAutoCompleteChange}
                        value={logicalOptions.filter(o => o.selected === true)}
                        className={classes.formControl}
                    >
                    </AutoComplete> 
                </Grid>
                <Grid item xs={12} md={6}>							
                    <AutoComplete
                        name="localeId"
                        options={physicalOptions}
                        label="Physical Hierarchy"
                        placeholder="Select Location"
                        handleChange={handleAutoCompleteChange}
                        value={physicalOptions.filter(o => o.selected === true)}
                        className={classes.formControl}
                    >
                    </AutoComplete> 
                </Grid>
            </Grid>
        </Fragment>
    );
}	

export default EventLocation; 