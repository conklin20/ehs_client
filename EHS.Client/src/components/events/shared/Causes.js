import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, TextField, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from '@material-ui/core'; 
import filterLookupDataByKey from '../../../helpers/filterLookupDataByKey'; 
import AutoCompleteMulti from '../../shared/AutoCompleteMulti'; 
import { saveCauses } from '../../../store/actions/causes';
import { connect } from "react-redux";
import { ATTR_CATS } from '../../../helpers/attributeCategoryEnum';

const useStyles = makeStyles(theme => ({
    paper: {
      padding: theme.spacing(3, 2),
      margin: theme.spacing(2), 
    },
}));

// function removeDups(value, index, self) { 
//     return self.indexOf(value) === index;
// }

const Causes = (props) => {
    const classes = useStyles();
        
    const { event, refreshCauses } = props; 
    
    //building each lookup data object
    const immediateCauseList = filterLookupDataByKey(props.lookupData, ATTR_CATS.IMMEDIATE_CAUSES.lookupDataKey, ATTR_CATS.IMMEDIATE_CAUSES.key, null, true)
    const rootCauseList = filterLookupDataByKey(props.lookupData, ATTR_CATS.ROOT_CAUSES.lookupDataKey, ATTR_CATS.ROOT_CAUSES.key, null, true)
    const contributingFactorList = filterLookupDataByKey(props.lookupData, ATTR_CATS.CONTRIBUTING_FACTORS.lookupDataKey, ATTR_CATS.CONTRIBUTING_FACTORS.key, null, true)
        
    //find which cause type is associated to each cause
    const currentImmediateCauses = event.causes
                                    .filter(c => immediateCauseList.some(icl => icl.value === c.causeId))
                                    .map(c => {
                                    return {
                                        eventId: c.eventId, 
                                        causeId: c.causeId, 
                                        comments: c.comments
                                    }
                                });
    
    //find which cause type is associated to each cause
    const currentRootCauses = event.causes
                                    .filter(c => rootCauseList.some(rcl => rcl.value === c.causeId))
                                    .map(c => {
                                    return {
                                        eventId: c.eventId, 
                                        causeId: c.causeId, 
                                        comments: c.comments
                                    }
                                });
    
    //find which cause type is associated to each cause
    const currentContributingFactors = event.causes
                                    .filter(c => contributingFactorList.some(cfl => cfl.value === c.causeId))
                                    .map(c => {
                                    return {
                                        eventId: c.eventId, 
                                        causeId: c.causeId, 
                                        comments: c.comments
                                    }
                                });
    
    const [immediateCauses, setImmediateCauses] = useState(currentImmediateCauses);
    const [rootCauses, setRootCauses] = useState(currentRootCauses);
    const [contributingFactors, setContributingFactors] = useState(currentContributingFactors);
    const [openDialog, setOpenDialog] = useState(false); 
    
    const handleClickOpen = () => {
        setOpenDialog(true); 
    }; 

    const handleClose = (e) => {
        setOpenDialog(false);
    }
    
    const handleSubmitCauses = e => {
        e.preventDefault(); 

        const allCauses = [ ...immediateCauses, ...rootCauses, ...contributingFactors]; 
        
        //save causes to db
        console.log(allCauses.length)
        if(allCauses.length){
            props.saveCauses(allCauses, props.currentUser.user.userId)
                .then(res => {
                    refreshCauses()
                    return res === 'Causes' ? handleClickOpen() : null
                })
                .catch(err => {
                    console.log(err); 
                })
        }
    }   

    const causeTypes = ['Immediate Causes','Root Causes','Contributing Factors'].map((type, index) => {
        
        const handleAutoCompleteMultiChange = (state, action)  => {
            switch(action.name){
                case 'Immediate Causes':
                    if (action.action === 'remove-value'){
                        return setImmediateCauses(immediateCauses.filter(ic =>  ic.causeId !== action.removedValue.value));
                    } else 
                    if (action.action === 'clear'){
                        return setImmediateCauses([]);
                    } else 
                    if (action.action === 'select-option'){
                        const newCause = {
                            eventId: event.eventId, 
                            causeId: action.option.value,     
                        }
                        return setImmediateCauses( [ ...immediateCauses, { ...newCause } ] );  
                    }                    
                    return 
                case 'Root Causes':
                        if (action.action === 'remove-value'){
                            return setRootCauses(rootCauses.filter(rc =>  rc.causeId !== action.removedValue.value));
                        } else 
                        if (action.action === 'clear'){
                            return setRootCauses([]);
                        } else 
                        if (action.action === 'select-option'){
                            const newCause = {
                                eventId: event.eventId, 
                                causeId: action.option.value,     
                            }
                            return setRootCauses( [ ...rootCauses, { ...newCause } ] );  
                        }                    
                        return 
                case 'Contributing Factors':
                        if (action.action === 'remove-value'){
                            return setContributingFactors(contributingFactors.filter(cf =>  cf.causeId !== action.removedValue.value));
                        } else 
                        if (action.action === 'clear'){
                            return setContributingFactors([]);
                        } else 
                        if (action.action === 'select-option'){
                            const newCause = {
                                eventId: event.eventId, 
                                causeId: action.option.value,     
                            }
                            return setContributingFactors( [ ...contributingFactors, { ...newCause } ] );  
                        }                    
                        return 
                default: 
                    console.log(`Invalid Action: ${action.name}`)
            }      
        }

        // Handle field change 
        const handleChange = e => {  

            switch(type){
                case 'Immediate Causes':
                    immediateCauses.map(ic => {
                        return ic.comments = e.target.value
                    })
                    setImmediateCauses([ ...immediateCauses ])
                    return 
                case 'Root Causes':
                    rootCauses.map(rc => {
                        return rc.comments = e.target.value
                    })
                    setRootCauses([ ...rootCauses ])
                    return 
                case 'Contributing Factors':
                    contributingFactors.map(cf => {
                        return cf.comments = e.target.value
                    })
                    setContributingFactors([ ...contributingFactors ])
                    return
                default: 
                    console.log('Invalid Type')
                    return
            }      
        }

        const values = () => {            
            switch(type){
                case 'Immediate Causes':
                    return immediateCauses.map(ic => immediateCauseList.find(icl => icl.value === ic.causeId));
                case 'Root Causes':
                    return rootCauses.map(rc => rootCauseList.find(rcl => rcl.value === rc.causeId));
                case 'Contributing Factors':
                    return contributingFactors.map(cf => contributingFactorList.find(cfl => cfl.value === cf.causeId));
                default: 
                    console.log('Invalid Type')
            }
        }; 
        

        const options = () => {            
            switch(type){
                case 'Immediate Causes':
                    return immediateCauseList
                case 'Root Causes':
                    return rootCauseList
                case 'Contributing Factors':
                    return contributingFactorList
                default: 
                    console.log('Invalid Type')
            }
        }; 
                            
        return (
            <Paper className={classes.paper}>
                <Typography variant='h5' gutterBottom>
                    {type}
                </Typography>
                <Grid item xs={12}>											
                    <AutoCompleteMulti
                        key={index}
                        name={type}
                        options={options()}
                        placeholder="Type or select an option..."
                        handleChange={handleAutoCompleteMultiChange}
                        value={values()}
                        className={classes.formControl}
                        >
                    </AutoCompleteMulti>
                    <Typography variant='caption' >
                        Hint: Start typing, and then hit "Tab" when you've found the value you're looking for, then start typing the next (if applicable).
                    </Typography>
                </Grid>
                <Grid item xs={12}>		
                    <TextField
                        key={index}
                        name={type}
                        placeholder={`${type} Comments...`}
                        variant='outlined'
                        className={classes.formControl}
                        onChange={handleChange}
                        value={
                            type === 'Immediate Causes' ? immediateCauses.length ? immediateCauses[0].comments : ''
                                : type === 'Root Causes' ? rootCauses.length ? rootCauses[0].comments : ''
                                : type === 'Contributing Factors' ? contributingFactors.length ? contributingFactors[0].comments : ''
                                : ''
                        }
                        fullWidth
                    >
                    </TextField>
                    <Divider className={classes.divider} />
                </Grid>
            </Paper>
        )
    })

    return (
        <Fragment>            
            <Dialog 
                open={openDialog}
                onClose={handleClose}
                aria-labelledby='confirm-dialog-title'
                aria-describedby='confirm-dialog-description'
            >
                <DialogTitle id='confirm-dialog-title'>{"Saved Successfully!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='confirm-dialog-description'>
                        {`Causes have been successfully saved to the database. `}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button id='success' onClick={handleClose} color='primary' autofocus>OK</Button>
                </DialogActions>
            </Dialog>
            <form onSubmit={handleSubmitCauses}>  
                <Typography variant='h4' gutterBottom>
                    Event Causes
                </Typography>

                {causeTypes}
                
                <Button 
                    type="submit"
                    name='savePeople'
                    variant='contained' 
                    color="secondary" 
                    className={classes.button}
                    fullWidth
                >
                    Save
                </Button>
            </form>        
            <Divider />
        </Fragment>
    );
}	

function mapStateToProps(state) {
	// console.log(state)
	return {
			lookupData: state.lookupData,
			currentUser: state.currentUser,
	};
}

export default connect(mapStateToProps, { 
    saveCauses
})(Causes); 
