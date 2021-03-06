import React, {  } from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
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
}));


const EventDetailForm = props => {
    const classes = useStyles(); 

    const { config, lookupData, handleChange, handleAutoCompleteChange, handleSubmit, queryStringParams } = props
    
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
                case AutoComplete: 
                    return (
                        <AutoComplete
                            key={p.name}
                            name={p.name}
                            options={logicalOptions}
                            label={p.alias}                    
                            placeholder={`Select ${p.alias}`}
                            handleChange={handleAutoCompleteChange}
                        />
                    )             
                default: 
                    return (<div>Invalid Form Input Type</div>)
            }
        
    })

    return (
        <form className={classes.form} onSubmit={handleSubmit(config)}>
            <Typography className={classes.header} variant="h4" >
                <em>Safe Days Report</em>
            </Typography>
            
            {formFields}

            <Button type='submit' variant='contained' color='primary' className={classes.submit}>
                Generate Report
            </Button>
        </form> 
    )
}

export default EventDetailForm;