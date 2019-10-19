import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, TextField, Divider, Checkbox, FormControlLabel  } from '@material-ui/core'; 
// import AutoCompleteMulti from '../inputs/AutoCompleteMulti'; 
// import { saveCauses } from '../../../store/actions/causes';


const useStyles = makeStyles(theme => ({
    paper: {
      padding: theme.spacing(3, 2),
      margin: theme.spacing(2), 
    },
}));

const Causes = (props) => {
    const classes = useStyles();
        
    const { event } = props; 
    
    //building each lookup data object
    const involvement = props.lookupData['logicalHierarchyAttributes'].filter(attr => attr.key === 'Employee Involvement');


    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Event Causes
            </Typography>
        </Fragment>
    );
}	

// function mapStateToProps(state) {
// 	// console.log(state)
// 	return {
// 			lookupData: state.lookupData,
// 			currentUser: state.currentUser,
// 	};
// }

// export default connect(mapStateToProps, { 
//     saveCauses
// })(Causes); 

export default Causes