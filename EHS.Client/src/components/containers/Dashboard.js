import React, { useState, useEffect } from 'react'; 
import { connect } from "react-redux";
import { fetchSafteyIncidents } from '../../store/actions/safetyIncidents';
import { fetchLookupData } from '../../store/actions/lookupData'; 
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Hidden, Typography } from '@material-ui/core';
import EventList from './EventList';
import EventSearch from '../function/EventSearch';
import ReportAside from '../containers/ReportAside'; 
import UserAside from '../containers/UserAside'; 
import Notification from '../function/Notification';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
		overflowY: 'hidden'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '94vh',
    margin: '0', 
		padding: '0',
  },
  icon: {
    margin: theme.spacing(0),
    fontSize: 20,
  },
}));

const parseSearchFilters = filters => {
	let parsedFilters = '?'; 
	//loop through all object properties
	for (let prop in filters){
		// Array.isArray(filters[prop]) ? 
		parsedFilters += `${prop}=${filters[prop]}&`
	}
	
	return parsedFilters.slice(0, -1); //removing  the last & char 
}

const Dashboard = props => {    
	const classes = useStyles();
	const [searchFilters, setSearchFilters] = useState(
		{
			status: ['Open', 'Draft']
		}
	)
	const [searchText, setSearchText] = useState(''); 
	const [showSearchFilters, setShowSearchFilters] = useState(false); 
	const [dense, setDense] = useState(true);
	
  // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
		console.log('fetchSafteyIncidents called')
		props.fetchSafteyIncidents(parseSearchFilters(searchFilters)); 	 	

		//fetch lookup data, which will be used in various places 
		props.fetchLookupData('?enabled=true'); 

		return () => {
			console.log('Cleanup function (ComponentDidUnmount)')
		}
	}, [props.searchFilters]); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

	//handler for the search textbox
	const handleSearchText = e => {
		setSearchText(e.target.value)
		//filter incident list 
		// console.log(e.target.value)
	}
	
	//handler for the show search filters button
	const handleShowSearchFilters = () => {
		setShowSearchFilters(!showSearchFilters)
		// console.log(showSearchFilters)
	}

	//handler for the search filters 
	const handleSearchFilters = e => {
		setSearchFilters(e.target.value); 
		// console.log(searchFilters)
	}

	//handler for the dense padding
	const handleDensePadding = () => {
		setDense(!dense); 
		console.log(dense)
	}

	//handler for the search button
	const handleSearch = e => {
		// e.preventDafault(); 
		props.fetchSafteyIncidents(parseSearchFilters(searchFilters));
		setShowSearchFilters(false); 
		console.log('handleSearch called!')
	}


	const filterSafetyIncidents = () => {
		const searchTextSplit = searchText.toLowerCase().split(' ');

		//filter the list on what the dynamic search input has, split out key words and search on each
		const filteredSafetyIncidents = searchTextSplit[0] !== ''
			? props.safetyIncidents
					.filter(inc => 
						searchTextSplit.every(cond => 
							JSON.stringify(inc)
								.toLowerCase()
								.includes(cond)
						)
					)
			: props.safetyIncidents 
		
		// filteredSafetyIncidents.filter(si => {
		// 	return searchFilters.status.some(status => {
		// 		return si.eventStatus === status
		// 	})
		// })

		return filteredSafetyIncidents; 
	}

	const { errors, removeError } = props; 

	return (
		<div className={classes.root}>
			{/* display error if any are encountered  */}
			{errors.message && (							
				<Notification
					open={true} 
					variant="error"
					className={classes.margin}
					message={errors.message}	
					removeError={removeError}							
				/>		
			)}
			<Grid container spacing={0}>
				<Hidden smDown>
					<Grid item md={2}>
						<Paper className={[classes.paper, ]}
							square={true}
						>
						<Typography variant="h4" gutterBottom>Report Aside!</Typography>  
						<ReportAside   
						/>
						</Paper>
					</Grid>
				</Hidden>
				<Grid item xs={12} md={8}>
					<Paper className={[classes.paper]}
							square={true}
					>                 
						<EventSearch 
							onSearchTextChange={handleSearchText}
							onShowSearchFilters={handleShowSearchFilters}
							onSearchFiltersChange={handleSearchFilters}
							onDensePadding={handleDensePadding}
							onSearch={handleSearch}
							showSearchFilters={showSearchFilters}
							searchFilters={searchFilters}
							dense={dense}
							lookupData={props.lookupData}
						/>

						<EventList 
							currentUser={props.currentUser} 
							safetyIncidents={filterSafetyIncidents()}
							dense={dense}
						/>
					</Paper>
				</Grid>				
				<Hidden smDown>
					<Grid item md={2}>
						<Paper className={[classes.paper, ]}
								square={true}
						>                 
							<Typography variant="h4" gutterBottom>User Aside!</Typography>     
							<UserAside 
							/>
						</Paper>
					</Grid>
				</Hidden>
			</Grid>
		</div>
	)     
}

function mapStateToProps(state) {
	// console.log(state)
	return {
			safetyIncidents: state.safetyIncidents, 
			lookupData: state.lookupData,
	};
}

export default connect(mapStateToProps, { fetchSafteyIncidents, fetchLookupData })(Dashboard); 