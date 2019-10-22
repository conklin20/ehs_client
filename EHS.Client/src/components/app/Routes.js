import React, { useEffect, Fragment } from 'react'; 
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from '../containers/AppBar';
import Homepage from '../function/Homepage';
import AuthForm from '../function/AuthForm';
import Dashboard from '../containers/Dashboard'; 
import SafetyEventForm from '../function/SafetyEventForm'; 
import { logout } from '../../store/actions/auth';
import { removeError } from '../../store/actions/errors'; 
import UserAside from '../userAside/UserAside';
import ReportAside from '../reportAside/ReportAside';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    body: {
        display: 'flex',
        // padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '94vh',
        margin: '0', 
        padding: '0',
    }, 
    main: {
        flex: 4,
        // backgroundColor: 'green',
    },
})); 

const Routes = props => {
    const classes = useStyles(); 

    return (
        <Fragment>
            { props.currentUser.isAuthenticated ? <AppBar currentUser={props.currentUser} onLogout={props.logout} /> : null }
            <div id='body' className={classes.body}>
                { props.currentUser.isAuthenticated ? <ReportAside /> : null }
                <Switch>
                    <Route path='/' exact component={Homepage} ></Route>
                    <Route path='/dashboard' component={Dashboard} ></Route>
                    <Route path='/events/si/new' exact component={SafetyEventForm} ></Route>
                    <Route path='/events/si/:eventId' exact component={SafetyEventForm} ></Route>
                    <Route path='/events/si/:eventId/step/:stepNo' component={SafetyEventForm} ></Route>
                </Switch>
                { props.currentUser.isAuthenticated ? <UserAside /> : null }
            </div>
        </Fragment>
    )
}

function mapStateToProps(state){
    return {
        // lookupData: state.lookupData,
        currentUser: state.currentUser,
        errors: state.errors, 
    }
}

export default withRouter(
    connect(mapStateToProps, 
        { 
            logout,
            removeError,
        })(Routes)
); 