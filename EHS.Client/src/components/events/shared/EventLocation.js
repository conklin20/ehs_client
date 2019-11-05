import React, { useEffect, Fragment } from 'react';
import { Typography, Grid, Divider } from '@material-ui/core'; 
import AutoComplete from '../../shared/AutoComplete'; 
// import { fetchFullTree } from '../../../store/actions/hierarchyData'; 

const EventLocation = (props) => {
    const classes = props.useStyles();

    const { lookupData, event, /*currentUser,*/ handleAutoCompleteChange, handleRefreshData } = props; 
    
    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        // this.nameInput.focus()
		return () => {
            //when component unmounts, go retrieve the new lookup data given the selctions made 
            //idea here is that we dont need to query the db everytime the selection changes, only when the user advances to the next screen
            handleRefreshData();
		}
	}, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

    //generate the list of options for the logical/dept dropwdown list
    //filtering on the highest level of hierarchies (Department and PlantArea)
    const logicalOptions = lookupData.logicalHierarchies.filter(h => h.hierarchyLevel.hierarchyLevelNumber === 5).map(hierarchy => ({
        value: hierarchy.hierarchyId, 
        label: hierarchy.hierarchyName, 
    }));
    const physicalOptions = lookupData.physicalHierarchies.filter(h => h.hierarchyLevel.hierarchyLevelNumber === 5).map(hierarchy => ({
        value: hierarchy.hierarchyId, 
        label: hierarchy.hierarchyName,
    }));
    console.log(event.departmentId, logicalOptions)
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
                        value={logicalOptions.find(o => o.value === event.departmentId)}
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
                        value={physicalOptions.find(o => o.value === event.localeId)}
                        className={classes.formControl}
                    >
                    </AutoComplete> 
                </Grid>
            </Grid>
        </Fragment>
    );
}	

export default EventLocation; 