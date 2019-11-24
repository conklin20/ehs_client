import React, { Fragment } from 'react';
import { Typography, Grid, TextField, Divider, Checkbox, FormControlLabel  } from '@material-ui/core'; 
import WarningIcon from '@material-ui/icons/Warning';
import AutoComplete from '../../../shared/AutoComplete'; 
import CustomSlider from '../../../shared/Slider'; 
import filterLookupDataByKey from '../../../../helpers/filterLookupDataByKey'; 
import filterEmployeeList from '../../../../helpers/filterEmployeeList'; 
import formatDate from '../../../../helpers/formatDate'; 
import { ATTR_CATS } from '../../../../helpers/attributeCategoryEnum';

//Safety Incident Event Details
const SIEventDetails = (props) => {
    const classes = props.useStyles();

    const { event, lookupData, handleChange, handleAutoCompleteChange, handleSliderChange, currentUser } = props; 
    console.log(event)
    //building each lookup data object
    //Employee Lists
    const employees = filterEmployeeList(lookupData['employees'], event['employeeId'], 4001, true, false)
    const supervisors = filterEmployeeList(lookupData['employees'], event['supervisorId'], 4001, true, true)

    //Global Attributes
    const initialCategories = filterLookupDataByKey(lookupData, ATTR_CATS.INITIAL_CATEGORY.lookupDataKey, ATTR_CATS.INITIAL_CATEGORY.key, event[ATTR_CATS.INITIAL_CATEGORY.dbField]);
    const resultingCategories = filterLookupDataByKey(lookupData, ATTR_CATS.RESULTING_CATEGORY.lookupDataKey, ATTR_CATS.RESULTING_CATEGORY.key, event[ATTR_CATS.RESULTING_CATEGORY.dbField]);
    const bodyParts = filterLookupDataByKey(lookupData, ATTR_CATS.BODY_PARTS.lookupDataKey, ATTR_CATS.BODY_PARTS.key, event[ATTR_CATS.BODY_PARTS.dbField]);

    //Logical Attributes
    const shifts = filterLookupDataByKey(lookupData, ATTR_CATS.SHIFTS.lookupDataKey, ATTR_CATS.SHIFTS.key, event[ATTR_CATS.SHIFTS.dbField]);
    const jobTitles = filterLookupDataByKey(lookupData, ATTR_CATS.JOB_TITLES.lookupDataKey, ATTR_CATS.JOB_TITLES.key, event[ATTR_CATS.JOB_TITLES.dbField]);
    const injuryNatures = filterLookupDataByKey(lookupData, ATTR_CATS.INJURY_NATURES.lookupDataKey, ATTR_CATS.INJURY_NATURES.key, event[ATTR_CATS.INJURY_NATURES.dbField]);
    const firstAidTypes = filterLookupDataByKey(lookupData, ATTR_CATS.FIRST_AID_TYPES.lookupDataKey, ATTR_CATS.FIRST_AID_TYPES.key, event[ATTR_CATS.FIRST_AID_TYPES.dbField]);
    const workEnvironments = filterLookupDataByKey(lookupData, ATTR_CATS.WORK_ENVIRONMENTS.lookupDataKey, ATTR_CATS.WORK_ENVIRONMENTS.key, event[ATTR_CATS.WORK_ENVIRONMENTS.dbField]);
    const materials = filterLookupDataByKey(lookupData, ATTR_CATS.MATERIALS.lookupDataKey, ATTR_CATS.MATERIALS.key, event[ATTR_CATS.MATERIALS.dbField]);
    
    //Physical Attributes 
    const offPlantMedicalFacilities = filterLookupDataByKey(lookupData, ATTR_CATS.MEDICAL_FACILITIES.lookupDataKey, ATTR_CATS.MEDICAL_FACILITIES.key, event[ATTR_CATS.MEDICAL_FACILITIES.dbField]);
    const equipment = filterLookupDataByKey(lookupData, ATTR_CATS.EQUIPMENT.lookupDataKey, ATTR_CATS.EQUIPMENT.key, event[ATTR_CATS.EQUIPMENT.dbField]);

    //grabbing the HierarchyAttributeId from the lookup list to be used below to populate the Supervisor field from the PeopleInvolved table
    const supervisorHierarchyAttributeId = filterLookupDataByKey(lookupData, ATTR_CATS.EMPLOYEE_INVOLVEMENT.lookupDataKey, ATTR_CATS.EMPLOYEE_INVOLVEMENT.key, null, true).find(sup => sup.label === 'Supervisor').value;
    
    return (
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
                        value={
                            event.employeeId ? employees.find(o => o.selected === true) : null 
                        }
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
                        value={
                            event.supervisorId ? employees.filter(e => e.value === event.supervisorId) : 
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
                        helperText={`This dropdown will respond much quicker if equipment/machines are moved to their resepctive physical hierarchies`}
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
                    {currentUser.user.roleLevel == 5 //Safety Admin and Health
                        ?
                            <div className={classes.safetySection}>
                                <Divider gutterBottom/>
                                <Typography variant='h6' >
                                    Safety Only
                                </Typography>
                                <Typography variant='subtitle2' >
                                    If the result of the incident changed (Ex. a First Aid incident turned into a Recordable), you can change it here. 
                                </Typography>

                                <WarningIcon fontSize="small" color="action" style={{paddingTop: '3px', paddingRight: '3px'}} />
                                <Typography variant="overline">
                                    Caution: This will potentially cause the Approval requirements to change. If the event is closed and the Resulting 
                                    Category being applied to the event requires further approval, the event will automatically be re-opened. 
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
                            </div>
                        : null 
                    }
                </Grid>
            </Grid>
            <Divider className={classes.divider}/>    		
        </Fragment>
    );
}	

export default SIEventDetails; 