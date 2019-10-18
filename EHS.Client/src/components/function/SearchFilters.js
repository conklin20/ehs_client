import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AutoComplete from './inputs/AutoComplete';
import AutoCompleteMulti from './inputs/AutoCompleteMulti';
import filterLookupDataByKey from '../../helpers/filterLookupDataByKey';
import { 
	Button, 
	Checkbox,
	Dialog,
	DialogActions, 
	DialogContent, 
	DialogContentText, 
	DialogTitle, 
	Divider, 
	FormControl, 
	FormControlLabel, 
	Grid,
	Paper, 
	Select,
	TextField, 
	Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	root: {
	  flexGrow: 1,
	},
	container: {
	  display: 'flex',
	  flexWrap: 'wrap',
	},
	textField: {
	//   marginLeft: theme.spacing(1),
	//   marginRight: theme.spacing(1),
	},
	dense: {
	  marginTop: theme.spacing(2),
	},  
	form: {
		// display: 'flex',
		// flexDirection: 'column',
        // justifyContent: 'space-around',
		margin: 'auto',
		// width: 'fit-content',
	  },
	formControl: {
		marginTop: theme.spacing(0),
		minWidth: 120,
		marginRight: theme.spacing(1),
	},
		formControlLabel: {
		// marginTop: theme.spacing(1),
	},	
	sectionHeading: {
		fontStyle: 'italic'
	}, 
	autoComplete: {
		marginTop: theme.spacing(2),
	}
  }));

const SearchFilters = props => {
	const classes = useStyles();
	
	const { showSearchFilters, handleShowSearchFilters, handleSearchFiltersChange, handleAutoCompleteChange, handleSearch, searchFilters, lookupData } = props
	console.log(searchFilters)
	//filtering lookup data on key=Statueses, then mapping over it and creating an object with value and label, which react-dropdown needs
	const statuses = lookupData.logicalHierarchyAttributes
		.filter(d => d.key === 'Statuses')
		.sort()
		.filter(s => s.value !== 'Draft') //filter our Drafts, you dont want to be able to look up other peoples drafts
		.map(status => ({		
			// value: status.hierarchyAttributeId, 
			value: status.value, 
			label: status.value,
	}));
	
    //building each lookup data object 
    // const shifts = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Shifts'); 
    // const jobTitles = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Job Titles', values['jobTitle']); 
    // const injuryNatures = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Nature of Injury', values['natureOfInjury']); 
    // const bodyParts = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Body Parts', values['bodyPart']); 
    // const firstAidTypes = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'First Aid Types', values['firstAidType']);
    // const offPlantMedicalFacilities = filterLookupDataByKey(lookupData, 'physicalHierarchyAttributes', 'Off Plant Medical Facility', values['offPlantMedicalFacility']);
    // const workEnvironments = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Work Environment', values['workEnvironment']);
    // const materials = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Materials', values['materialInvolved']);
    // const equipment = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Equipment', values['equipmentInvolved']);
    const initialCategories = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Initial Category', searchFilters['initialCategory']);
    const resultingCategories = filterLookupDataByKey(lookupData, 'logicalHierarchyAttributes', 'Resulting Category', searchFilters['resultingCategory']);
	
	return (
		<div className={classes.root}>
			<Dialog 
				open={showSearchFilters} 
				onClose={handleShowSearchFilters} 
				aria-labelledby="form-dialog-title"
				fullWidth={true}
				maxWidth="md"
			>
				<DialogTitle id="form-dialog-title">Search For Events</DialogTitle>
				<DialogContent>		
					<form className={classes.form} noValidate>						
						<Grid container spacing={2}>
							<Grid item xs={6} md={12}>
								<Typography className={classes.sectionHeading}>Specific Event # or Status</Typography>
							</Grid>		
							<Grid item xs={12} md={3}>			
								<TextField
									id="event-id"
									name="eventId"
									label="Event #"
									value={searchFilters.eventId}
									onChange={handleSearchFiltersChange}
									type="number"
									className={classes.formControl}
									InputLabelProps={{
										shrink: true,
									}}
									margin="normal"
									variant="outlined"
								/>
							</Grid>
							<Grid item xs={12} md={3}>											
								<AutoCompleteMulti
									name="eventStatuses"
									options={statuses}
									label="Event Status"
									placeholder="Select statuses"
									handleChange={handleAutoCompleteChange}
									value={searchFilters.eventStatuses}
									className={classes.formControl}
								>
								</AutoCompleteMulti> 
							</Grid>
							<Grid item xs={12} md={12}>
								<Typography className={classes.sectionHeading}>Who</Typography>
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
									name="reportedBy"
									// options={null}
									label="Reported By"                        
									placeholder="Select Employee"
									// handleChange={handleAutoCompleteChange}
									// value={null}
									className={classes.formControl}
								>
								</AutoComplete> 
							</Grid>
							<Grid item xs={12} md={12}>
								<Typography className={classes.sectionHeading}>What</Typography>
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
							<Grid item xs={12} md={12}>
								<Typography className={classes.sectionHeading}>When</Typography>
							</Grid>
							<Grid item xs={12} md={3}>				
								<TextField
									id="event-date"
									name="eventDate"
									label='Event Date'
									onChange={handleSearchFiltersChange}
									type="date"
									className={classes.formControl}
									InputLabelProps={{
										shrink: true,
									}}
									margin="normal"
									value={searchFilters.eventDate}
									variant="outlined"
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<Typography className={classes.sectionHeading}>Where</Typography>
							</Grid>
							<Grid item xs={12} md={12}>
								<Typography className={classes.sectionHeading}>Why</Typography>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>									
									<FormControlLabel
										control={
											<Checkbox
												checked={true}
												onChange={() => console.log("checked!")}
												value="checkedB"
												color="primary"
											/>
										}
										label="Primary"
									/>
								</FormControl>
							</Grid>
						</Grid>
					</form>				
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSearch} color="primary">
						Search!
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default SearchFilters; 