import React, { useState, Fragment } from 'react';
import { Typography, Grid, TextField, Divider, Checkbox, FormControlLabel  } from '@material-ui/core'; 
import AutoComplete from '../inputs/AutoComplete'; 
import CustomSlider from '../inputs/Slider'; 

//if useHAId is passed in as true, the HierarchyAttributeId will be used as the value
const filterLookupDataByKey = (data, hierarchy, key, value, useHAId = false) => {
    return data[hierarchy]
        .filter(hierAttrs => hierAttrs.key === key)
        .map(ha => ({
            value: useHAId ? ha.hierarchyAttributeId : ha.value, 
            label: ha.value, 
            selected: ha.value === value ? true : false  
        }));
}

//Safety Incident Event Details
const SIEventDetails = (props) => {
    const classes = props.useStyles();

    const { values, lookupData, handleChange, handleAutoCompleteChange } = props; 

    console.log(filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Shifts', values['shift']))

    //building each lookup data object 
    const shifts = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Shifts', values['shift']); 
    const jobTitles = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Job Titles', values['jobTitle']); 
    const injuryNatures = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Nature of Injury', values['natureOfInjury']); 
    const bodyParts = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Body Parts', values['bodyPart']); 
    const firstAidTypes = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'First Aid Types', values['firstAidType']);
    const offPlantMedicalFacilities = filterLookupDataByKey(lookupData, 'physicalHierarchyAttributes', 'Off Plant Medical Facility', values['offPlantMedicalFacility']);
    const workEnvironments = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Work Environment', values['workEnvironment']);
    const materials = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Materials', values['materialInvolved']);
    const equipment = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Equipment', values['equipmentInvolved']);
    const initialCategories = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Initial Category', values['initialCategory']);
    const resultingCategories = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Resulting Category', values['resultingCategory']);

    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Event Details
            </Typography>
            <Typography className={classes.caption} variant="caption" display="block" gutterBottom>
                Instructions: Fill out this form, provding as much detail as you can about the event
            </Typography>   
            <Divider/>    				
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <TextField
                        required
                        type='datetime-local'
                        label='Date of event?'
                        className={classes.formControl}
                        value={values.eventDate}
                        onChange={handleChange('eventDetails', 'eventDate')}
                        helperText='Date and time the event occurred'
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12} md={3}>							
                    <AutoComplete
                        name="employeeInvolved"
                        // options={null}
                        label="Employee Involved"                        
                        placeholder="Select Employee"
                        // handleChange={handleAutoCompleteChange}
                        // value={null}
                        className={classes.formControl}
                    >
                    </AutoComplete> 
                </Grid>
                <Grid item xs={12} md={3}>							
                    <AutoComplete
                        name="supervisor"
                        // options={null}
                        label="Supervisor"                        
                        placeholder="Select Supervisor"
                        // handleChange={handleAutoCompleteChange}
                        // value={null}
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
                        value={values.whatHappened}
                        onChange={handleChange('eventDetails', 'whatHappened')}
                        helperText='Explain in as much detail possible what happened...'
                        variant="outlined"
                    />                    
                </Grid>     
                <br/>
                <Grid item xs={12} md={2}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color='primary'
                                checked={values.isInjury}
                                onChange={handleChange('eventDetails', 'isInjury')}
                            />
                        }
                        label='Injury?'
                    />                    
                </Grid>            
                    {
                        values.isInjury					
                        ? 
                            <Fragment>
                                <Grid item xs={12} md={3}>
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
                                <Grid item xs={12} md={7}>
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
                        : null
                    }        
                    <br/>   
                    <Grid item xs={12} md={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color='primary'
                                    checked={values.firstAid}
                                    onChange={handleChange('eventDetails', 'firstAid')}
                                />
                            }
                            label='First Aid Given?'
                        />                    
                    </Grid>            
                        {
                            values.firstAid					
                            ? 
                                <Fragment>
                                    <Grid item xs={12} md={9}>
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
                                </Fragment>
                            : null
                        }
                        <br/>
                        <Grid item xs={12} md={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color='primary'
                                        checked={values.transported}
                                        onChange={handleChange('eventDetails', 'transported')}
                                    />
                                }
                                label='Transported?'
                            />                    
                        </Grid>            
                            {
                                values.transported					
                                ? 
                                    <Fragment>
                                        <Grid item xs={12} md={3}>
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
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    color='primary'
                                                    checked={values.er}
                                                    onChange={handleChange('eventDetails', 'er')}
                                                />
                                            }
                                            label='ER?'
                                        />    
                                    </Fragment>
                                : null
                            }
                    
                        <Grid item xs={12} md={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color='primary'
                                        checked={values.isIllness}
                                        onChange={handleChange('eventDetails', 'isIllness')}
                                    />
                                }
                                label='Illness?'
                            />                    
                        </Grid>  
                        
                        <Grid item xs={12} md={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color='primary'
                                        checked={values.lostTime}
                                        onChange={handleChange('eventDetails', 'lostTime')}
                                    />
                                }
                                label='Lost Time?'
                            />                    
                        </Grid>  

                        <Grid item xs={12} md={12}>                        
                            <Typography id="hours-worked-slider" gutterBottom>
                                Hours Worked Prior
                            </Typography>
                            <CustomSlider
                                defaultValue={0}
                                getAriaValueText={values.hoursWorkedPrior}
                                aria-labelledby="hours-worked-slider"
                                valueLabelDisplay="auto"
                                step={.5}
                                marks
                                min={1}
                                max={24}
                                className={classes.slider}
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
            </Grid>
        </Fragment>
    );
}	

export default SIEventDetails; 