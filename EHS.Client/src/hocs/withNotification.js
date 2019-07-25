import React from 'react';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core'
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

// const VALID_TYPES = ['success', 'error', 'info', 'warning']
const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
  };
  
const useStyles1 = makeStyles(theme => ({
success: {
    backgroundColor: green[600],
},
error: {
    backgroundColor: theme.palette.error.dark,
},
info: {
    backgroundColor: theme.palette.primary.main,
},
warning: {
    backgroundColor: amber[700],
},
icon: {
    fontSize: 20,
},
iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
},
message: {
    display: 'flex',
    alignItems: 'center',
},
}));

// using a Higher Order Component here that we can wrap the Snackbar content from material UI around, to easily display messages to user 
// HOCS - https://reactjs.org/docs/higher-order-components.html
// Hooks - https://reactjs.org/docs/hooks-intro.html 
// Snackbar Component -  https://material-ui.com/components/snackbars/  
const withNotification = ( wrappedComponent ) => {
    return (props) => {
        const classes = useStyles1();
        const { className, onClose, variant, ...other } = props;
        const Icon = variantIcon[variant];
        const [message, setMessage] = React.useState('');
        const [type, setType] = React.useState('');
        const [open, setOpen] = React.useState(false);

        const showNotification = (message, type = 'default') => {
            // using a hook, to access our state and setState
            setMessage(message);
            setType(type); 
            setOpen(true);
        }

        return (
            <>
                <SnackbarContent
                className={classes[variant]}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                    <Icon className={classes.icon ? classes.icon : classes.iconVariant} />
                    {message}
                    </span>
                }
                action={[
                    <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                    </IconButton>,
                ]}
                {...other}
                />
                <wrappedComponent {...this.props} />
            </>
          );
    }
}


withNotification.propTypes = {
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  };

export default withNotification; 