import React, { useState, useEffect, useReducer } from 'react'; 
import { connect } from "react-redux";
import { fetchSafteyIncidents } from '../../store/actions/safetyIncidents';
import { fetchLookupData } from '../../store/actions/lookupData'; 
import { fetchFullTree } from '../../store/actions/lookupData'; 
import { fetchSinglePath } from '../../store/actions/lookupData'; 
import { fetchLogicalHierarchyTree } from '../../store/actions/hierarchyData'; 
import { fetchPhysicalHierarchyTree } from '../../store/actions/hierarchyData'; 
import { addError } from '../../store/actions/errors';
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
	for (var filter in filters){
		// check if the filter is an object from one of our autoComplete components (all have a value/label property)
		
		if(filters[filter] && typeof(filters[filter]) === 'object' && filters[filter].length) {
			parsedFilters += filter + '='
			
			for (var listItem in filters[filter]){
				parsedFilters += filters[filter][listItem].value + ',';
			}

			//removing last , char
			parsedFilters = parsedFilters.slice(0, -1) + '&';

			//check if the filter is regular string, if so, make sure it has value 
		} else if (typeof(filters[filter]) === 'string' && filters[filter]) {
			parsedFilters += `${filter}=${filters[filter]}&`;
		}
	}
	// console.log(parsedFilters.slice(0,-1))
	return parsedFilters.slice(0, -1); //removing  the last & char 
}

//defaulting the initial search to only return Events that are 'Open'
const initialSearchFilterState = { eventStatuses: [ { value: "Open", label: "Open"} ] };

const searchFilterReducer = (state, action) => {
	switch (action.type) {
		case 'eventId':
			return { ...state, eventId: action.value }
		case 'eventDate':
			return { ...state, eventDate: action.value }
		case 'eventTime':
			return { ...state, eventTime: action.value }
		case 'eventStatuses':
			return { ...state, eventStatuses: action.value }
		default: 
			addError("Invalid Action");
			return state;
	}
}

const Dashboard = props => {    
	const classes = useStyles();
	const [searchFilters, dispatch] = useReducer(searchFilterReducer, initialSearchFilterState); 
	// console.log('re-rendered. searchfilters: ', searchFilters)

	const [searchText, setSearchText] = useState(''); 
	const [showSearchFilters, setShowSearchFilters] = useState(false); 
	const [dense, setDense] = useState(true);
	
  // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
		// console.log('fetchSafteyIncidents called')
		props.fetchSafteyIncidents(parseSearchFilters(searchFilters)); 	 	

		//fetch lookup data, defaulting to everything (1000), will get narrowed down by the users selctions in various  pages 
		// props.fetchLookupData('?enabled=true');
		// props.fetchSinglePath(props.currentUser.user.logicalHierarchyId, '?enabled=true');
		props.fetchFullTree(1000, '?enabled=true');

		//fetch logical and physical hierarchy trees (based on users setup) 
		props.fetchLogicalHierarchyTree();
		props.fetchPhysicalHierarchyTree();

		return () => {
			console.log('Cleanup function (ComponentDidUnmount)')
		}
	}, [props.searchFilters]); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

	//handler for the search textbox
	const handleSearchTextChange = e => {
		console.log(e.target.value)
		setSearchText(e.target.value)
		//filter incident list 
	}
	
	//handler for the show search filters button
	const handleShowSearchFilters = () => {
		setShowSearchFilters(!showSearchFilters)
	}

	//handler for the dense padding
	const handleDensePadding = () => {
		setDense(!dense); 
		// console.log(dense)
	}

	//handler for the search button
	const handleSearch = e => {
		// e.preventDefault(); 
		props.fetchSafteyIncidents(parseSearchFilters(searchFilters));
		console.log(parseSearchFilters(searchFilters));
		setShowSearchFilters(false); 
		console.log('handleSearch called!')
	}


	//filter the list on what the dynamic search input has, split out key words and search on each
	const filterSafetyIncidents = () => {
		const searchTextSplit = searchText.toLowerCase().split(' ');

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
							handleSearchTextChange={handleSearchTextChange}
							handleShowSearchFilters={handleShowSearchFilters}
							handleSearchFiltersChange={(e) => dispatch( { type: e.target.name, value: e.target.value })}
							handleAutoCompleteChange={(data, action) => dispatch({ type: action.name, value: data })}
							handleDensePadding={handleDensePadding}
							handleSearch={handleSearch}
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
			hierarchyData: state.hierarchyData,
			currentUser: state.currentUser,
			// isLoading: state.isLoading,
	};
}

export default connect(mapStateToProps, { fetchSafteyIncidents, fetchLookupData, fetchFullTree, fetchSinglePath, fetchLogicalHierarchyTree, fetchPhysicalHierarchyTree })(Dashboard); 