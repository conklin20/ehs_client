import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import Filter from '@material-ui/icons/FilterList';
import SearchFilters from './SearchFilters'; 

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		margin: theme.spacing(2),
		width: '60%',
	},
	dense: {
		marginTop: theme.spacing(2),
	},
	menu: {
		width: 200,
	},
  icon: {
    margin: theme.spacing(2),
	fontSize: 32,
	cursor: 'pointer',
  },
}));

const SearchBar = props => {
	const classes = useStyles();
	
	return (
		<div>		
			<TextField
				id="event-search-bar"
				className={classes.textField}
				onChange={props.onSearchTextChange}
				label="Dynamic Search"
				placeholder="Ex. First Aid 4304 John Doe"
				helperText="Search for events using multiple keywords, just put a space in-between each keyword"
				margin="dense"
				variant="outlined"
				InputLabelProps={{
					shrink: true,
				}}
			/>			
			<Filter 
				className={classes.icon} 
				onClick={props.onShowSearchFilters}
			/>
			<SearchFilters
				showSearchFilters={props.showSearchFilters}
				onShowSearchFilters={props.onShowSearchFilters}
				onSearch={props.onSearch}
			/>			
			<FormControlLabel
				control={
					<Switch 
						checked={props.dense} 
						onChange={props.onDensePadding} 
					/>
				}
				label="Dense padding"
			/>
		</div>
	)
}

export default SearchBar; 