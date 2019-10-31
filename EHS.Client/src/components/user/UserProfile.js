import React, { useState, useEffect, Fragment } from 'react'
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper, Grid, Button, Divider , TextField, FormControl, InputLabel } from '@material-ui/core'
import AutoComplete from '../function/inputs/AutoComplete'; 
import { 
	fetchLogicalHierarchyTree, 
	fetchPhysicalHierarchyTree, 
	// fetchLogicalHierarchyAttributes, 
	// fetchPhysicalHierarchyAttributes, 
} from '../../store/actions/lookupData'; 

const useStyles = makeStyles(theme => ({
	root: {
        flex: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'left',
		color: theme.palette.text.secondary,
        minHeight: '94vh',
		// marginTop: 0, 
		// padding: '0',
		
	},
	icon: {
		margin: theme.spacing(0),
		fontSize: 20,
	},
	loading: {
		marginTop: theme.spacing(20), 
	},
}));

const UserProfile = props => {
    const classes = useStyles();

    const { lookupData, currentUser } = props;

    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {

		fetchData(); 

		return () => {
			console.log('UserProfile Component Unmounting')
		}
	}, [props.searchFilters]); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

	const fetchData = async () => {
		
		if(!lookupData.logicalHierarchies ) await props.fetchLogicalHierarchyTree(4001);
		if(!lookupData.physicalHierarchies) await props.fetchPhysicalHierarchyTree(4000);
		// if(!props.lookupData.logicalHierarchyAttributes) await props.fetchLogicalHierarchyAttributes(1000, 'fulltree', '?enabled=true');
		// if(!props.lookupData.physicalHierarchyAttributes) await  props.fetchPhysicalHierarchyAttributes(1000, 'fulltree', '?enabled=true&excludeglobal=true');
	}
    
    const [userData, setUserData] = useState({
        ...currentUser.user
    })
    /*
    UserId	Email	                    FirstName	LastName	LogicalHierarchyId	PhysicalHierarchyId	Phone	    RoleId	TimeZone	DateFormat	Enabled
    caryc	cary.conklin.20@gmail.com	Cary	    Conklin	    6007	            6005	            2085533375	3	    -5      	YYYY-MM-DD	1
    */
   
    const userLogicalHierarchyLevel = lookupData.logicalHierarchies ? 
        lookupData.logicalHierarchies.find(h => h.hierarchyId == userData.logicalHierarchyId).hierarchyLevel.hierarchyLevelNumber
        : null 
    const logicalOptions = lookupData.logicalHierarchies ? 
        lookupData.logicalHierarchies.filter(h => h.hierarchyLevel.hierarchyLevelNumber >= userLogicalHierarchyLevel).map(hierarchy => ({
            value: hierarchy.hierarchyId, 
            label: hierarchy.hierarchyName, 
    })) : null ;
    
    const userPhsyicalHierarchyLevel = lookupData.physicalHierarchies ? 
        lookupData.physicalHierarchies.find(h => h.hierarchyId == userData.physicalHierarchyId).hierarchyLevel.hierarchyLevelNumber
        : null 
    const physicalOptions = lookupData.physicalHierarchies ? 
        lookupData.physicalHierarchies.filter(h => h.hierarchyLevel.hierarchyLevelNumber >= userPhsyicalHierarchyLevel).map(hierarchy => ({
            value: hierarchy.hierarchyId, 
            label: hierarchy.hierarchyName,
    })) : null;

    
    //for the react-select (single) component
    const handleAutoCompleteChange = (state, action)  => {
        console.log(`${action.name} = ${state.value}`)
        setUserData({ ...userData, [action.name]: state.value });
    }

    console.log(userData)
    return (
        <Paper className={classes.paper} square={true} >   
            { lookupData.logicalHierarchies && lookupData.physicalHierarchies ?
                <Fragment>
                    <Typography variant='h4' gutterBottom>
                        Your Profile
                    </Typography>
                    <Divider />
                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >	
                                <Typography variant="h6" gutterBottom>
                                    {`UserId: ${userData.userId}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} >
                                <Typography variant="h6" gutterBottom>
                                    {`Full Name: ${userData.fullName}`}
                                </Typography>                    
                            </Grid>
                            <Grid item xs={12} >
                                <Typography variant="h6" gutterBottom>
                                    {`Email: ${userData.email}`}
                                </Typography>                  
                            </Grid>
                            <Grid item xs={12} >
                                <Typography variant="h6" gutterBottom>
                                    {`Role: ${userData.roleName}`}
                                </Typography>    
                                <Typography variant="caption" gutterBottom>
                                    {`Capabilities: ${userData.roleCapabilities}`}
                                </Typography>                   
                            </Grid>
                            <Grid item xs={12} >
                                <Typography variant="h6" gutterBottom>
                                    {`Approval Level: ${userData.approvalLevel} - ${userData.approvalLevelName}`}
                                </Typography>                
                            </Grid>
                            <Grid item xs={12} >
                                <Typography variant="subtitle2" gutterBottom>
                                    The above information is pulled from another system or setup by a system administrator
                                </Typography>  
                                <Divider />                  
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl>				
                                    <AutoComplete
                                        name="logicalHierarchyId"
                                        options={logicalOptions}
                                        label="Logical Hierarchy"                        
                                        placeholder="Select Department"
                                        handleChange={handleAutoCompleteChange}
                                        value={logicalOptions.find(o => o.value == userData.logicalHierarchyId)}
                                        className={classes.formControl}
                                    >
                                    </AutoComplete> 
                                </FormControl>		
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl>    						
                                    <AutoComplete
                                        name="physicalHierarchyId"
                                        options={physicalOptions}
                                        label="Physical Hierarchy"                        
                                        placeholder="Select Location"
                                        handleChange={handleAutoCompleteChange}
                                        value={physicalOptions.find(o => o.value == userData.physicalHierarchyId)}
                                        className={classes.formControl}
                                    >
                                    </AutoComplete> 
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl>                            
                                    {/* <Typography variant="subtitle2" gutterBottom>
                                        <InputLabel htmlFor="phone">Phone: </InputLabel>
                                    </Typography>   */}
                                    <TextField
                                        id='phone'
                                        label='Phone # '
                                        className={classes.textField}
                                        value={userData.phone}
                                        onChange={(e) => setUserData({ ...userData, phone: e.target.value})}
                                        variant='outlined'
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl>
                                    <TextField
                                        id="timeZone"
                                        label="UTC Offset"
                                        type="number"
                                        value={userData.timeZone}
                                        onChange={(e) => setUserData({ ...userData, timeZone: e.target.value})}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        helperText={`It appears your timezone has an offset of ${- new Date().getTimezoneOffset() / 60 } hours`}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl>
                                    
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>                    
                </Fragment>
            : 
            <Typography variant='h5'>
                Loading User Data...
            </Typography> }
        </Paper>
    )
}


function mapStateToProps(state) {
	// console.log(state)
	return {
		lookupData: state.lookupData,
		currentUser: state.currentUser,
	};
}

export default connect(mapStateToProps, { 
    fetchLogicalHierarchyTree, 
    fetchPhysicalHierarchyTree,

})(UserProfile); 