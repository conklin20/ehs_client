import React, { useState, Fragment } from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	container: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'baseline', 
	},
	textField: {
		margin: theme.spacing(2),
		width: '60%',
	},
	menu: {
		width: 200,
	},
 	icon: {
		margin: theme.spacing(2),
		fontSize: 32,
		cursor: 'pointer',
  },
}));

const UserSearch = props => {
	const classes = useStyles();

    return (
        <Fragment>   
            <div className={classes.container}>
                <TextField
                    id="user-search-bar"
                    className={classes.textField}
                    onChange={props.handleSearchTextChange}
                    label="Quick Search"
                    placeholder="Ex. John"
                    helperText="Search for users using their name, employee number etc."
                    margin="dense"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />		
                <Button
                    onClick={props.handleShowUserForm}
                    color="primary"
                    variant="contained"
                    className={classes.button}
                >
                    New User
                </Button>
            </div>         
        </Fragment>
    )
}

export default UserSearch;