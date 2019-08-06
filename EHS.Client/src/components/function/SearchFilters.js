import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AutoComplete from './inputs/AutoComplete';
import AutoCompleteMulti from './inputs/AutoCompleteMulti';
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
		// marginTop: theme.spacing(2),
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

	//filtering lookup data on key=Statueses, then mapping over it and creating an object with value and label, which react-dropdown needs
	const statuses = lookupData.filter(d => d.key === "Statuses").sort().map(status => ({		
		// value: status.hierarchyAttributeId, 
		value: status.value, 
		label: status.value,
	}));
	
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
								<Typography className={classes.sectionHeading}>You know ya shit</Typography>
								<FormControl className={classes.formControl}>
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
								</FormControl>
								<FormControl className={[classes.formControl, classes.autoComplete]}>									
									<AutoCompleteMulti
										name="eventStatuses"
										options={statuses}
										label="Event Status"
										placeholder="Select statuses"
										handleChange={handleAutoCompleteChange}
										value={searchFilters.eventStatuses}
									>
									</AutoCompleteMulti> 
								</FormControl>
							</Grid>		
							<Grid item xs={12} md={12}>
								<Typography className={classes.sectionHeading}>Who</Typography>
							</Grid>
							<Grid item xs={12} md={12}>
								<Typography className={classes.sectionHeading}>What</Typography>
							</Grid>
							<Grid item xs={12} md={12}>
								<Typography className={classes.sectionHeading}>When</Typography>
								<FormControl className={classes.formControl}>									
									<TextField
										id="event-date"
										name="eventDate"
										label='Event Date'
										onChange={handleSearchFiltersChange}
										type="date"
										className={classes.textField}
										InputLabelProps={{
											shrink: true,
										}}
										margin="normal"
										value={searchFilters.eventDate}
										variant="outlined"
									/>
								</FormControl>
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