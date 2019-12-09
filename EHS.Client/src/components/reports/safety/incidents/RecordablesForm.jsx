import React, { } from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment';
import AutoComplete from '../../../shared/AutoComplete';

const useStyles = makeStyles(theme => ({
    header: {
        marginBottom: theme.spacing(1), 
    },
    form: {
        paddingLeft: '15%',
        width: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    submit: {
        marginTop: theme.spacing(2), 
    },
    formControl: {
        margin: theme.spacing(2),
    },
}));


const RecordablesForm = props => {
    const classes = useStyles(); 

    const { config, lookupData, selectedDates, handleAutoCompleteChange, handleDateChange, handleSubmit, queryStringParams } = props
    
    //generate the list of options for the logical/dept dropwdown list
    const logicalOptions = lookupData.logicalHierarchies
        .filter(h => h.hierarchyLevel.hierarchyLevelNumber === 3) //Site
        .map(hierarchy => ({
            value: hierarchy.hierarchyName, 
            label: hierarchy.hierarchyName, 
    }));

    const formFields =      
        config.parameters
        .filter(p => !p.hidden)
        .map(p => {
        switch(p.muiControl){
            case KeyboardDatePicker: 
                return (
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            id={p.name}
                            autoOk
                            name={p.name}
                            label={p.alias}
                            className={classes.formControl}
                            variant="inline"
                            inputVariant="outlined"
                            format="YYYY-MM-DD"
                            value={selectedDates[p.name]}
                            InputAdornmentProps={{ position: "start" }}
                            onChange={date => handleDateChange(p.name, date)}
                        />
                    </MuiPickersUtilsProvider>
                )    
            case AutoComplete: 
                return (
                    <AutoComplete
                        name="site"
                        options={logicalOptions}
                        className={classes.formControl}
                        label="Logical Hierarchy"                     
                        placeholder="Select Site"
                        handleChange={handleAutoCompleteChange}
                    />
                )        
            default: 
                return (<div>Invalid Form Input Type</div>)
        }
    })  

    return (
        <form className={classes.form} onSubmit={handleSubmit(config)}>
            <Typography className={classes.header} variant="h4" gutterbottom>
                <em>Recordables</em>
            </Typography>
            
            {formFields}

            <Button type='submit' variant='contained' color='primary' className={classes.submit}>
                Generate Report
            </Button>
        </form> 
    )
}

export default RecordablesForm;