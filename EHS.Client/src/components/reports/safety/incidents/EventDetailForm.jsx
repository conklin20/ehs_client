import React, { Fragment } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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
}));


const EventDetailForm = props => {
    const classes = useStyles(); 

    const { config, lookupData, handleChange, handleSubmit, queryStringParams } = props
    
    const formFields =  config.parameters.map(p => {
        switch(p.muiControl){
            case TextField: 
                return (
                    <TextField
                        key={p.name}
                        id={p.name}
                        name={p.name}
                        type={p.type}
                        variant='outlined'
                        placeholder={p.name}
                        label={p.alias || p.name}
                        margin='dense'
                        defaultValue={queryStringParams[p.name]}
                        onChange={handleChange()}                     
                    />
                )                
            default: 
                return (<div>Invalid Form Input Type</div>)
        }
    })  

    return (
        <form className={classes.form} onSubmit={handleSubmit(config)}>
            <Typography className={classes.header} variant="h4">
                <em>Safety Incident Report</em>
            </Typography>
            
            {formFields}

            <Button type='submit' variant='contained' color='primary' className={classes.submit}>
                Generate Report
            </Button>
        </form> 
    )
}

export default EventDetailForm;