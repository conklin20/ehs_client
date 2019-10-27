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
    reportAside: {
        flex: 1, 
        // backgroundColor: 'blue',
        padding: theme.spacing(2),
    },     
    main: {
        flex: 4,
        // backgroundColor: 'green',
    },
    userAside: {
        flex: 1, 
        // backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing(2),
    }
})); 

const Routes = props => {
    const classes = useStyles(); 

    return (
        <Fragment>
            { props.currentUser.isAuthenticated ? <AppBar currentUser={props.currentUser} onLogout={props.logout} /> : null }
            <div id='body' className={classes.body}>
                { props.currentUser.isAuthenticated ? <div className={classes.reportAside}><ReportAside /> </div> : null }
                <Switch>
                    <Route path='/' exact component={Homepage} ></Route>
                    <Route path='/dashboard' render={(props) => <div className={classes.main}><Dashboard /> </div> } ></Route>
                    <Route path='/events/si/new' exact component={SafetyEventForm} ></Route>
                    <Route path='/events/si/:eventId' exact component={SafetyEventForm} ></Route>
                    <Route path='/events/si/:eventId/step/:stepNo' component={SafetyEventForm} ></Route>
                    {/* /account */}
                    {/* /manage/users */}
                    {/* /manage/hierarchies */}
                    {/* /manage/attributes */}
                </Switch>
                { props.currentUser.isAuthenticated ? <div className={classes.userAside}><UserAside /> </div> : null }
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