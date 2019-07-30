import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, FormControl } from '@material-ui/core';
import DatePicker from './inputs/DatePicker'; 
import TimePicker from './inputs/TimePicker';
import SingleSelect from './inputs/SingleSelect';
import MultiSelect from './inputs/MultiSelect';

const useStyles = makeStyles(theme => ({
	root: {
	  flexGrow: 1,
	},
	container: {
	  display: 'flex',
	  flexWrap: 'wrap',
	},
	textField: {
	  marginLeft: theme.spacing(1),
	  marginRight: theme.spacing(1),
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
		marginTop: theme.spacing(2),
		minWidth: 120,
	},
		formControlLabel: {
		marginTop: theme.spacing(1),
	},	
  }));

const SearchFilters = props => {
	const classes = useStyles();
	
	//filtering lookup data on key=Statueses, then mapping over it and creating an object with value and label, which react-dropdown needs
	const statuses = props.lookupData.filter(d => d.key === "Statuses").sort().map(status => ({		
		value: status.hierarchyAttributeId, 
		label: status.value,
	}));
	
	
	return (
		<div className={classes.root}>
			<Dialog 
				open={props.showSearchFilters} 
				onClose={props.onShowSearchFilters} 
				aria-labelledby="form-dialog-title"
				fullWidth={true}
				maxWidth="md"
			>
				<DialogTitle id="form-dialog-title">Search For Events</DialogTitle>
				<DialogContent>		
					<form className={classes.form} noValidate>						
						<Grid container spacing={2}>
							<Grid item xs={6} md={3}>
								<FormControl className={classes.formControl}>
									<TextField
										id="event-id"
										label="Event #"
										value={props.searchFilters.EventId}
										onChange={props.onSearchFiltersChange}
										type="number"
										className={classes.formControl}
										InputLabelProps={{
											shrink: true,
										}}
										margin="normal"
										variant="outlined"
									/>
								</FormControl>
							</Grid>
							<Grid item xs={6} md={3}>
								<FormControl className={classes.formControl}>
									<DatePicker label="Event Date"/>
								</FormControl>
							</Grid>
							<Grid item xs={6} md={3}>
								<FormControl className={classes.formControl}>
									<TimePicker label="Event Time"/>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>
									<MultiSelect  
										options={statuses}
										label="Event Status"
										placeholder="Select a status"
										>
									</MultiSelect>
								</FormControl>
							</Grid>
										
										
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>
									PlaceHolder
								</FormControl>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>
									PlaceHolder
								</FormControl>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>
									PlaceHolder
								</FormControl>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>
									PlaceHolder
								</FormControl>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>
									PlaceHolder
								</FormControl>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>
									PlaceHolder
								</FormControl>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>
									PlaceHolder
								</FormControl>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl className={classes.formControl}>
									PlaceHolder
								</FormControl>
							</Grid>
						</Grid>
					</form>				
				</DialogContent>
				<DialogActions>
					<Button onClick={props.onSearch} color="primary">
						Search!
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default SearchFilters; 