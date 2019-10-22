import React, { useState, useEffect } from 'react'; 
import { connect } from "react-redux";
import { Hidden, Typography } from '@material-ui/core';
import MyDrafts from './MyDrafts';
import { fetchDrafts } from '../../store/actions/safetyIncidents';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    userAside: {
        flex: 1, 
        // backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing(2),
    }
})); 

const UserAside = props => {
    const classes = useStyles(); 
    
    const [myDrafts, setMyDrafts] = useState([]);

    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        props.fetchDrafts('?eventStatuses=Draft')
            .then(res => {
                setMyDrafts(res); 
            })
        
        
		return () => {
			console.log('Cleanup function (ComponentDidUnmount)')
		}
	}, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

    return (     
        <Hidden mdDown>
            <div className={classes.userAside}>
                <Typography variant="h4" gutterBottom>User Aside</Typography>  
                <Typography>
                    List of...
                        <MyDrafts 
                            drafts={myDrafts}
                            // employees={props.lookupData['employees']}
                        />
                </Typography>
            </div>
        </Hidden>
    )
    
}


function mapStateToProps(state) {
    // console.log(state)
    return {
        currentUser: state.currentUser,
        lookupData: state.lookupData
    };
}

export default connect(mapStateToProps, { 
    fetchDrafts
})(UserAside); 

