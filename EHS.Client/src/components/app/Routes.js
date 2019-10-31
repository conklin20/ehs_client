import React, { useEffect, Fragment } from 'react'; 
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { logout } from '../../store/actions/auth';
import { removeError } from '../../store/actions/errors'; 
//components
import AppBar from '../containers/AppBar';
import Homepage from '../function/Homepage';
import Dashboard from '../containers/Dashboard'; 
import SafetyEventForm from '../function/SafetyEventForm'; 
import UserAside from '../userAside/UserAside';
import ReportAside from '../reportAside/ReportAside';
import UserProfile from '../user/UserProfile';
import UserManagement from '../admin/userManagement/UserManagement'; 
import Logout from '../user/Logout'; 


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
                    <Route path='/logout' component={Logout} ></Route>
                    <Route path='/dashboard' render={(props) => <div className={classes.main}><Dashboard /> </div> } ></Route>
                    <Route path='/events/si/new' exact component={SafetyEventForm} ></Route>
                    <Route path='/events/si/:eventId' exact component={SafetyEventForm} ></Route>
                    <Route path='/events/si/:eventId/step/:stepNo' component={SafetyEventForm} ></Route>
                    <Route path='/user/profile' render={(props) => <div className={classes.main}><UserProfile /> </div> }  ></Route>
                    <Route path='/manage/users' exact render={(props) => <div className={classes.main}><UserManagement /> </div> }  ></Route>
                    <Route path='/manage/users/:userId' exact render={(props) => <div className={classes.main}><UserManagement /> </div> }  ></Route>
                    {/* /manage/users */}
                    {/* /manage/hierarchies */}
                    {/* /manage/attributes */}
                    {/* /reports */}
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