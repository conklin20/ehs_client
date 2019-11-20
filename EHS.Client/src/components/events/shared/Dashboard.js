import React, { useState, useEffect, useReducer, Fragment } from 'react'; 
import { connect } from "react-redux";
import { fetchSafetyIncidents } from '../../../store/actions/safetyIncidents';
import { 
	fetchLogicalHierarchyTree, 
	fetchPhysicalHierarchyTree, 
	fetchGlobalHierarchyAttributes, 
	fetchLogicalHierarchyAttributes, 
	fetchPhysicalHierarchyAttributes, 
	fetchEmployees } from '../../../store/actions/lookupData'; 
import { addNotification } from '../../../store/actions/notifications';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import EventList from './EventList';
import EventSearch from './EventSearch';
import { S_I_STATUS } from '../../../helpers/eventStatusEnum';

const useStyles = makeStyles(theme => ({
	root: {
        flex: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
		minHeight: '90%',
	},
	icon: {
		margin: theme.spacing(0),
		fontSize: 20,
	},
	loading: {
		marginTop: theme.spacing(20), 
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
		case 'site':
			return { ...state, site: action.value }
		case 'area':
			return { ...state, area: action.value }
		case 'department':
			return { ...state, department: action.value }
		case 'departmentId':
			return { ...state, departmentId: action.value }
		default: 
			addNotification("Invalid Action", 'warning');
			return state;
	}
}

const Dashboard = props => {    
	const classes = useStyles();

	const { currentUser, lookupData } = props;

	//defaulting the initial search to only return Events that are Open
	const initialSearchFilterState = { 
		eventStatuses: [ { value: S_I_STATUS.OPEN, label: S_I_STATUS.OPEN} ],
	};

	const [searchFilters, dispatch] = useReducer(searchFilterReducer, initialSearchFilterState); 
	// console.log(searchFilters)

	const [searchText, setSearchText] = useState(''); 
	const [showSearchFilters, setShowSearchFilters] = useState(false); 
	
 	// Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {

		fetchData(); 

		return () => {
			console.log('Dashboard Component Unmounting')
		}

	}, [props.searchFilters]); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

	const fetchData = async () => {
		// refreshing the events every time as they may have changed, and the UserAside listens for changes 
		await props.fetchSafetyIncidents(parseSearchFilters(searchFilters)) ; 
		
		// console.log(currentUser.user.logicalHierarchyPath.split('|')[currentUser.user.logicalHierarchyPath.split('|').length-1])
		if(!lookupData.employees) await props.fetchEmployees();
		if(!lookupData.logicalHierarchies ) await props.fetchLogicalHierarchyTree(currentUser.user.logicalHierarchyPath.split('|')[currentUser.user.logicalHierarchyPath.split('|').length-1]);
		if(!lookupData.physicalHierarchies) await props.fetchPhysicalHierarchyTree(currentUser.user.physicalHierarchyPath.split('|')[currentUser.user.physicalHierarchyPath.split('|').length-1]);
		if(!lookupData.globalHierarchyAttributes) await props.fetchGlobalHierarchyAttributes(1000, 'fulltree', '?attributetype=global&enabled=true'); //will be the root hierarchy 
		if(!lookupData.logicalHierarchyAttributes) await props.fetchLogicalHierarchyAttributes(1000, 'fulltree', '?attributetype=logical&enabled=true'); 
		if(!lookupData.physicalHierarchyAttributes) await  props.fetchPhysicalHierarchyAttributes(1000, 'fulltree', '?attributetype=physical&enabled=true'); 
		
	
		//WOULD LIKE TO USE THIS TO RETURN ONLY THE USERS PERTINENT EVENTS (Their Site, Area's or Depts...) 
		//Not working though as the component mounts before having this data 
		if(lookupData.logicalHierarchies && currentUser.user){
			dispatch( { 				
				// eslint-disable-next-line
				type: lookupData.logicalHierarchies.find(h => h.hierarchyId == currentUser.user.logicalHierarchyId).hierarchyLevel.hierarchyLevelName, 
				// eslint-disable-next-line
				value: lookupData.logicalHierarchies.find(h => h.hierarchyId == currentUser.user.logicalHierarchyId).hierarchyName
			})
		}
	}

	//handler for the search textbox
	const handleSearchTextChange = e => {
		setSearchText(e.target.value)
		//filter incident list 
	}
	
	//handler for the show search filters button
	const handleShowSearchFilters = () => {
		setShowSearchFilters(!showSearchFilters)
	}

	//handler for the search button
	const handleSearch = e => {
		// e.preventDefault(); 
		props.fetchSafetyIncidents(parseSearchFilters(searchFilters));
		// console.log(parseSearchFilters(searchFilters));
		setShowSearchFilters(false); 
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
	// console.log(props)
	return (
		<Fragment>
			<Paper className={[classes.paper]}
					square={true}
					>                 
				<EventSearch 
					handleSearchTextChange={handleSearchTextChange}
					handleShowSearchFilters={handleShowSearchFilters}
					handleSearchFiltersChange={(e) => dispatch( { type: e.target.name, value: e.target.value })}
					handleAutoCompleteChange={(data, action) => dispatch({ type: action.name, value: data })}
					handleSearch={handleSearch}
					showSearchFilters={showSearchFilters}
					searchFilters={searchFilters}
					lookupData={props.lookupData}
					/>

				{ props.safetyIncidents.length && props.lookupData.employees			
					? 	<EventList 
							currentUser={props.currentUser} 
							safetyIncidents={filterSafetyIncidents()}
							employees={props.lookupData.employees}
						/>
					: 	<div className={classes.loading}>
							<Typography variant='h2' >
								Loading Events...
							</Typography>
						</div>
				}
			</Paper>
		</Fragment>
	)     
}

function mapStateToProps(state) {
	// console.log(state)
	return {
		safetyIncidents: state.safetyIncidents, 
		lookupData: state.lookupData,
		currentUser: state.currentUser,
	};
}

export default connect(mapStateToProps, { 
	fetchSafetyIncidents,
	fetchGlobalHierarchyAttributes, 
	fetchLogicalHierarchyAttributes, 
	fetchPhysicalHierarchyAttributes, 
	fetchLogicalHierarchyTree, 
	fetchPhysicalHierarchyTree, 
	fetchEmployees, 
})(Dashboard); 