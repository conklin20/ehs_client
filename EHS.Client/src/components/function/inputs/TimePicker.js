import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
//   textField: {
//     // marginTop: theme.spacing(2),
//     // minWidth: 120,
//   },
}));

const DatePicker = props => {
    const classes = useStyles();

    return (
        <TextField
        id="time"
        label={props.label}
        type="time"
        className={classes.textField}
        InputLabelProps={{
            shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
        margin="normal"
        variant="outlined"
        />
  );
}

export default DatePicker;