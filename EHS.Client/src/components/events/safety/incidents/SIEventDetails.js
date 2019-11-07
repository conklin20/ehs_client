import React, { Fragment } from 'react';
import { Typography, Grid, TextField, Divider, Checkbox, FormControlLabel  } from '@material-ui/core'; 
import AutoComplete from '../../../shared/AutoComplete'; 
import CustomSlider from '../../../shared/Slider'; 
import filterLookupDataByKey from '../../../../helpers/filterLookupDataByKey'; 
import filterEmployeeList from '../../../../helpers/filterEmployeeList'; 
import formatDate from '../../../../helpers/formatDate'; 

//Safety Incident Event Details
const SIEventDetails = (props) => {
    const classes = props.useStyles();

    const { event, lookupData, handleChange, handleAutoCompleteChange, handleSliderChange, currentUser } = props; 

    //building each lookup data object
    const employees = filterEmployeeList(lookupData['employees'], event['employeeId'], 4001, true, false)
    const supervisors = filterEmployeeList(lookupData['employees'], event['supervisorId'], 4001, true, true)
    const shifts = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Shifts', event['shift']); 
    const jobTitles = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Job Titles', event['jobTitle']); 
    const injuryNatures = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Nature of Injury', event['natureOfInjury']); 
    const bodyParts = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Body Parts', event['bodyPart']); 
    const firstAidTypes = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'First Aid Types', event['firstAidType']);
    const offPlantMedicalFacilities = filterLookupDataByKey(lookupData, 'physicalHierarchyAttributes', 'Off Plant Medical Facility', event['offPlantMedicalFacility']);
    const workEnvironments = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Work Environment', event['workEnvironment']);
    const materials = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Materials', event['materialInvolved']);
    const equipment = filterLookupDataByKey(lookupData, 'physicalHierarchyAttributes', 'Equipment', event['equipmentInvolved']);
    const initialCategories = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Initial Category', event['initialCategory']);
    const resultingCategories = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Resulting Category', event['resultingCategory']);

    //grabbing the HierarchyAttributeId from the lookup list to be used below to populate the Supervisor field from the PeopleInvolved table
    const supervisorHierarchyAttributeId = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Employee Involvement', null, true).find(sup => sup.label === 'Supervisor').value;
    console.log(supervisorHierarchyAttributeId)
    console.log(event)
    return (
        // <Fragment>  
        //     { employees && supervisors && shifts && jobTitles && injuryNatures && bodyParts && firstAidTypes && offPlantMedicalFacilities 
        //         && workEnvironments && materials && equipment && initialCategories && resultingCategories  ?
            <Fragment>
                <Typography variant='h4' gutterBottom>
                    Event Details
                </Typography>
                <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                    Instructions: Fill out this form, provding as much detail as you can about the event
                </Typography>   
                <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                    Tips: You can easily navigate through the form without the use of your mouse. Use the 'Tab' key to move to the next control. For all dropdowns, you can start typing 
                    in your selection, when you see it pop-up, use the arrow keys to select it, then tab off. For checkbox's when you tab onto one, you can press the 'Spacebar' to toggle
                    its selection. 
                </Typography>
                <Divider/>    				
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            required
                            type='datetime-local'
                            label='Date of event?'
                            className={classes.formControl}
                            value={`${formatDate(event.eventDate)}T12:00`}
                            onChange={handleChange('eventDetails', 'eventDate')}
                            helperText='Date and time the event occurred'
                            variant='outlined'
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>							
                        <AutoComplete
                            name="employeeId"
                            options={employees}
                            label="Employee Involved"                        
                            placeholder="Select Employee"
                            handleChange={handleAutoCompleteChange}
                            value={employees.filter(o => o.selected === true)}
                            className={classes.formControl}
                        >
                        </AutoComplete> 
                    </Grid>
                    <Grid item xs={12} md={3}>							
                        <AutoComplete
                            name="supervisorId"
                            options={supervisors}
                            label="Supervisor"                        
                            placeholder="Select Supervisor"
                            handleChange={handleAutoCompleteChange}
                            value={event.supervisorId ? employees.filter(e => e.value === event.supervisorId) : 
                                        event.peopleInvolved.length 
                                        ? employees.filter(e => e.value === event.peopleInvolved.find(s => s.roleId === supervisorHierarchyAttributeId).employeeId) 
                                        : null}
                            className={classes.formControl}
                        >
                        </AutoComplete> 
                    </Grid>
                    <Grid item xs={12} md={3}>							
                        <AutoComplete
                            name="shift"
                            options={shifts}
                            label="Shift"                        
                            placeholder="Select Shift"
                            handleChange={handleAutoCompleteChange}
                            value={shifts.filter(o => o.selected === true)}
                            className={classes.formControl}
                        >
                        </AutoComplete> 
                    </Grid>
                    <Grid item xs={12} md={3}>							
                        <AutoComplete
                            name="jobTitle" //must match the key name for the state to update correctly
                            options={jobTitles}
                            label="Job Title"                        
                            placeholder="Select Job"
                            handleChange={handleAutoCompleteChange}
                            value={jobTitles.filter(o => o.selected === true)}
                            className={classes.formControl}
                        >
                        </AutoComplete> 
                    </Grid>
                    <Grid item xs={12}>		
                        <TextField
                            required
                            className={classes.formControl}
                            label='What Happened?'
                            multiline
                            fullWidth
                            rows='4'
                            value={event.whatHappened}
                            onChange={handleChange('eventDetails', 'whatHappened')}
                            helperText='Explain in as much detail possible what happened...'
                            variant="outlined"
                        />                    
                    </Grid>     

                    <Grid item xs={12} md={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color='primary'
                                    checked={event.isInjury}
                                    onChange={handleChange('eventDetails', 'isInjury')}
                                />
                            }
                            label='Injury?'
                        />                    
                    </Grid>            
                    {
                        event.isInjury					
                        ? 
                            <Fragment>
                                <Grid item xs={12} md={4}>
                                    <AutoComplete
                                        name="natureOfInjury" //must match the key name for the state to update correctly
                                        options={injuryNatures}
                                        label="Nature of Injury"                        
                                        placeholder="Select Injury"
                                        handleChange={handleAutoCompleteChange}
                                        value={injuryNatures.filter(o => o.selected === true)}
                                        className={classes.formControl}
                                    >
                                    </AutoComplete> 
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <AutoComplete
                                        name="bodyPart" //must match the key name for the state to update correctly
                                        options={bodyParts}
                                        label="Body Part"                        
                                        placeholder="Select Body Part"
                                        handleChange={handleAutoCompleteChange}
                                        value={bodyParts.filter(o => o.selected === true)}
                                        className={classes.formControl}
                                    >
                                    </AutoComplete> 
                                </Grid>
                            </Fragment>
                        : 
                            <Grid item md={9} >
                            </Grid>
                    }       
                        
                    <Grid item xs={12} md={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color='primary'
                                    checked={event.firstAid}
                                    onChange={handleChange('eventDetails', 'firstAid')}
                                />
                            }
                            label='First Aid Given?'
                        />                    
                    </Grid>            
                    {
                        event.firstAid					
                        ? 
                            <Fragment>
                                <Grid item xs={12} md={4}>
                                    <AutoComplete
                                        name="firstAidType" //must match the key name for the state to update correctly
                                        options={firstAidTypes}
                                        label="First Aid Type"                        
                                        placeholder="Select First Aid Type"
                                        handleChange={handleAutoCompleteChange}
                                        value={firstAidTypes.filter(o => o.selected === true)}
                                        className={classes.formControl}
                                    >
                                    </AutoComplete> 
                                </Grid>
                                <Grid item md={5}>
                                    <Fragment/>
                                </Grid>
                            </Fragment>
                        : 
                            <Grid item md={9} >
                            </Grid>
                    }
                    
                    <Grid item xs={12} md={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color='primary'
                                    checked={event.transported}
                                    onChange={handleChange('eventDetails', 'transported')}
                                />
                            }
                            label='Transported?'
                        />                    
                    </Grid>            
                    {
                        event.transported					
                        ? 
                            <Fragment>
                                <Grid item xs={12} md={4}>
                                    <AutoComplete
                                        name="offPlantMedicalFacility" //must match the key name for the state to update correctly
                                        options={offPlantMedicalFacilities}
                                        label="Off Plant Medical Facility"                        
                                        placeholder="Select Facility"
                                        handleChange={handleAutoCompleteChange}
                                        value={offPlantMedicalFacilities.filter(o => o.selected === true)}
                                        className={classes.formControl}
                                    >
                                    </AutoComplete> 
                                </Grid>
                                <Grid item md={5}>
                                    <Fragment/>
                                </Grid>
                            </Fragment>
                        : 
                            <Grid item md={9} >
                            </Grid>
                    }
            
                    <Grid item xs={12} md={3}>
                        <FormControlLabel
                                control={
                                    <Checkbox
                                        color='primary'
                                        checked={event.er}
                                        onChange={handleChange('eventDetails', 'er')}
                                    />
                                }
                                label='ER?'
                            />    
                        </Grid>
                        
                    <Grid item xs={12} md={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color='primary'
                                    checked={event.isIllness}
                                    onChange={handleChange('eventDetails', 'isIllness')}
                                />
                            }
                            label='Illness?'
                        />                    
                    </Grid>  
                            
                    <Grid item xs={12} md={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color='primary'
                                    checked={event.lostTime}
                                    onChange={handleChange('eventDetails', 'lostTime')}
                                />
                            }
                            label='Lost Time?'
                        />                    
                    </Grid>  

                    <Grid item xs={12} md={3}>                        
                        <Typography id="hours-worked-slider" gutterBottom>
                            Hours Worked Prior
                        </Typography>
                        <CustomSlider
                            defaultValue={event.hoursWorkedPrior}
                            getAriaValueText={event.hoursWorkedPrior}
                            aria-labelledby="hours-worked-slider"
                            valueLabelDisplay="auto"
                            step={.5}
                            min={.5}
                            max={16}
                            className={classes.slider}
                            handleSliderChange={handleSliderChange}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>							
                        <AutoComplete
                            name="workEnvironment" //must match the key name for the state to update correctly
                            options={workEnvironments}
                            label="Work Environment"                        
                            placeholder="Select Environment"
                            handleChange={handleAutoCompleteChange}
                            value={workEnvironments.filter(o => o.selected === true)}
                            className={classes.formControl}
                        >
                        </AutoComplete> 
                    </Grid>
                    <Grid item xs={12} md={3}>							
                        <AutoComplete
                            name="materialInvolved" //must match the key name for the state to update correctly
                            options={materials}
                            label="Material Involved"                        
                            placeholder="Select Material"
                            handleChange={handleAutoCompleteChange}
                            value={materials.filter(o => o.selected === true)}
                            className={classes.formControl}
                        >
                        </AutoComplete> 
                    </Grid>
                    <Grid item xs={12} md={3}>							
                        <AutoComplete
                            name="equipmentInvolved" //must match the key name for the state to update correctly
                            options={equipment}
                            label="Equipment Involved"                        
                            placeholder="Select Equipment"
                            handleChange={handleAutoCompleteChange}
                            value={equipment.filter(o => o.selected === true)}
                            className={classes.formControl}
                        >
                        </AutoComplete> 
                    </Grid>
                    
                    <Grid item xs={12} md={3}>							
                        <AutoComplete
                            name="initialCategory" //must match the key name for the state to update correctly
                            options={initialCategories}
                            label="Initial Category"                        
                            placeholder="Select Category"
                            handleChange={handleAutoCompleteChange}
                            value={initialCategories.filter(o => o.selected === true)}
                            className={classes.formControl}
                        >
                        </AutoComplete> 
                    </Grid>
                    <Grid item xs={12}>
                        {currentUser.user.roleLevel === 5 //Safety Admin and Health
                            ?
                                <Fragment>
                                    <Divider gutterBottom/>
                                    <Typography variant='h6' >
                                        Safety Only
                                    </Typography>
                                    <Typography variant='subtitle2' >
                                        If the result of the incident changed (Ex. a First Aid incident turned into a Recordable), you can change it here. 
                                    </Typography>
                                    <Grid item xs={12} md={3}>							
                                        <AutoComplete
                                            name="resultingCategory" //must match the key name for the state to update correctly
                                            options={resultingCategories}
                                            label="Resulting Category"                        
                                            placeholder="Select Category"
                                            handleChange={handleAutoCompleteChange}
                                            value={resultingCategories.filter(o => o.selected === true)}
                                            className={classes.formControl}
                                        >
                                        </AutoComplete> 
                                    </Grid>
                                </Fragment>
                            : null 
                        }
                    </Grid>
                </Grid>
                <Divider className={classes.divider}/>    		
                {/* </Fragment>
                : 
                <h2>Loading Data...</h2> } */}
        </Fragment>
    );
}	

export default SIEventDetails; 