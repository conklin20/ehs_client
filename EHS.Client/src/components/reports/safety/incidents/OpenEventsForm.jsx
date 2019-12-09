import React, { Fragment } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/styles';
import moment from 'moment'
import MomentUtils from '@date-io/moment';

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
    }
}));


const OpenEventsForm = props => {
    const classes = useStyles(); 

    const { config, lookupData, selectedDates, handleDateChange, handleSubmit, queryStringParams } = props
    
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
            default: 
                return (<div>Invalid Form Input Type</div>)
        }
    })  

    return (
        <form className={classes.form} onSubmit={handleSubmit(config)}>
            <Typography className={classes.header} variant="h4" gutterbottom>
                <em>Open Events</em>
            </Typography>
            
            {formFields}

            <Button type='submit' variant='contained' color='primary' className={classes.submit}>
                Generate Report
            </Button>
        </form> 
    )
}

export default OpenEventsForm;