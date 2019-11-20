import React, { useState, useEffect, Fragment } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core'; 
import UserSearch from './UserSearch'; 
import UserList from './UserList';
import UserForm from './UserForm';
import { fetchUsers } from '../../../store/actions/users'; 
import { 
	fetchLogicalHierarchyTree, 
    fetchPhysicalHierarchyTree, 
    fetchUserRoles, 
} from '../../../store/actions/lookupData'; 
import { MIN_ADMIN_ROLE_LEVEL } from '../adminRoleLevel';

const useStyles = makeStyles(theme => ({
	root: {
        flex: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
        minHeight: '94vh',		
	},
	icon: {
		margin: theme.spacing(0),
		fontSize: 20,
	},
	loading: {
		marginTop: theme.spacing(20), 
    },
    noAccessImg: {
        height: '50vh',
        width: '50vw',
        marginTop: theme.spacing(5),
        backgroundSize: 'cover',
        borderRadius: '2%',
        overflow: 'hidden',
    },
}));

const UserManagement = props => {
    const classes = useStyles();

    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]); 
    const [showUserForm, setShowUserForm] = useState(false); 
    
    const { lookupData, currentUser, match } = props;

 	// Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {

        fetchData(); 
        
        //if route is /manage/users/:userId , show user form for the selected user 
        if(match.params.userId) setShowUserForm(true); 

		return () => {
			console.log('UserManagement Component Unmounting')
		}

	}, [match]); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

	const fetchData = async () => {
        if(!users.length) refreshUsers();
        
        // console.log(currentUser.user.logicalHierarchyPath.split('|'))
        // console.log(currentUser.user.physicalHierarchyPath.split('|'))
		if(!lookupData.logicalHierarchies ) await props.fetchLogicalHierarchyTree(currentUser.user.logicalHierarchyPath.split('|')[currentUser.user.logicalHierarchyPath.split('|').length-1]);
        if(!lookupData.physicalHierarchies) await props.fetchPhysicalHierarchyTree(currentUser.user.physicalHierarchyPath.split('|')[currentUser.user.physicalHierarchyPath.split('|').length-1]);
        if(!lookupData.userRoles) await props.fetchUserRoles();         
    }
    
    const refreshUsers = () => {
        props.fetchUsers()
            .then(res => {
                if(res.status === 200){
                    setUsers(res.data); 
                } else {

                }
            }); 
    };

    const handleShowUserForm = () => {
        // console.log(showUserForm)
        if(match.params.userId) props.history.push('/manage/users')
        setShowUserForm(!showUserForm); 
    }
    
	//handler for the search textbox
	const handleSearchTextChange = e => {
        console.log(e.target.value)
		setSearchText(e.target.value)
		//filter incident list 
    }
    
	//filter the list on what the dynamic search input has, split out key words and search on each
	const filterUsers = () => {
		const searchTextSplit = searchText.toLowerCase().split(' ');
        // console.log(searchTextSplit)
		const filteredUsers = searchTextSplit[0] !== ''
			? users
                .filter(u => 
                    searchTextSplit.every(cond => 
                        JSON.stringify(u)
                            .toLowerCase()
                            .includes(cond)
                    )
                )
			: users
		
		return filteredUsers; 
	}

    return (
        <Paper className={classes.paper} square={true} >  
            <Typography variant='h4' >
                Manage System Users 
            </Typography>
            { currentUser.user.roleLevel >= MIN_ADMIN_ROLE_LEVEL 
                ?
                <Fragment>
                    {showUserForm && Object.keys(lookupData).length >= 3 ?
                        <UserForm 
                            showUserForm={showUserForm}
                            handleShowUserForm={handleShowUserForm}
                            userIdToEdit={match.params.userId}
                            lookupData={lookupData}
                            currentUser={currentUser}
                            refreshUsers={refreshUsers}
                            users={users} //to check if the user they're trying to create already exists 
                        />
                        : null
                    }
                    <UserSearch 
                        handleShowUserForm={handleShowUserForm}
                        handleSearchTextChange={handleSearchTextChange}
                    />
                    {Object.keys(lookupData).length >= 4 && users.length?
                        <UserList 
                            // users={users}
                            users={filterUsers()}
                            lookupData={lookupData}
                            currentUser={currentUser}
                        />
                        : 
                        <div className={classes.loading}>
                                <Typography variant='h2' >
                                    Loading Users...
                                </Typography>
                        </div>
                    }
                </Fragment>
                : 
                <Fragment>
                    <Typography variant='h4' gutterBottom>
                        Your role does not permit you to manage system data 
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom>
                        If you think you're not assigned to the correct role, please contact your System Admin or your Environmental, Health and Safety Department 
                    </Typography>
                    <img className={classes.noAccessImg} src={`https://images.unsplash.com/photo-1543933441-40fbd6b34481?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1537&q=80`}
                    />
                </Fragment>
            }
        </Paper>
    )
}

function mapStateToProps(state) {
	// console.log(state)
	return {
        currentUser: state.currentUser,
        lookupData: state.lookupData, 
	};
}

//wrapping withRouter HOC so we can access the history object 
export default withRouter(
    connect(mapStateToProps, {
        fetchUsers,
        fetchLogicalHierarchyTree, 
        fetchPhysicalHierarchyTree,
        fetchUserRoles,
})(UserManagement)); 