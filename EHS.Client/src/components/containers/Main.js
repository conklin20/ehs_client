import React, { useEffect } from 'react'; 
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from './AppBar';
import Homepage from '../function/Homepage';
import AuthForm from '../function/AuthForm';
import Dashboard from '../containers/Dashboard'; 
import SafetyEventForm from '../function/SafetyEventForm'; 
import { authUser, logout } from '../../store/actions/auth';
import { removeError } from '../../store/actions/errors'; 
import withAuth from '../../hocs/withAuth'; 
import UserAside from '../userAside/UserAside';
import ReportAside from '../reportAside/ReportAside';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    body: {
        display: 'flex',
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '94vh',
        margin: '0', 
        padding: '0',
    }, 
    leftAside: {
        flex: 1, 
        // backgroundColor: 'blue',
    },     
    main: {
        flex: 4,
        // backgroundColor: 'green',
    },
    rightAside: {
        flex: 1, 
        // backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing(2),
    }
})); 

const Main = props => {    
    const classes = useStyles();

    const { authUser, logout, errors, removeError, currentUser, lookupData } = props;
    return(
        <div className=''>
            <Switch>
                <Route 
                    exact 
                    path='/' 
                    render={props => {
                        return (
                            <div>
                                <Homepage 
                                    currentUser={currentUser} 
                                    errors={errors}
                                    removeError={removeError}
                                    onAuth={authUser}
                                    {...props } 
                                />
                            </div>
                        )
                    }} />
                <Route 
                    exact 
                    path='/signup'
                    render={props => {
                    return (
                        <AuthForm 
                            errors={errors}
                            removeError={removeError}
                            buttonText='Sign Up!'
                            heading='Create an account'
                            domain=''
                            {...props } 
                        />
                    )
                }} />
                <Route 
                    path='/dashboard' 
                    render={props => {
                        return (
                            <div>
                                <AppBar 
                                    currentUser={currentUser} 
                                    onLogout={logout}
                                />
                                <div className={classes.body}>
                                    <ReportAside 
                                        classes={classes} 
                                    />
                                    <div className={classes.main}>
                                        <Dashboard 
                                            errors={errors}
                                            removeError={removeError}                                            
                                        />
                                    </div>
                                    <UserAside 
                                        classes={classes} 
                                    />
                                        
                                </div>
                            </div>
                        )
                }} />
                
                <Route 
                    exact
                    path='/events/:id'
                    render={({match}, props) => {
                        return (
                            <div>
                                <AppBar 
                                    currentUser={currentUser} 
                                    onLogout={logout}
                                />
                                <div className={classes.body}>
                                    <ReportAside 
                                        classes={classes} 
                                    />
                                    <div className={classes.main}>
                                        <SafetyEventForm 
                                            showSafetyEventForm={true}
                                            eventId={match.params.id}
                                            errors={errors}
                                            removeError={removeError}
                                            {... props}
                                        />
                                    </div>
                                    <UserAside 
                                        classes={classes} 
                                    />
                                        
                                </div>
                            </div>
                        )
                    }
                    }
                />

                <Route 
                    exact
                    path='/events/:type/new'
                    render={({match}, props) => {
                        return (
                            <div>
                                <AppBar 
                                    currentUser={currentUser} 
                                    onLogout={logout}
                                />
                                <div className={classes.body}>
                                    <ReportAside 
                                        classes={classes} 
                                    />
                                    <div className={classes.main}>
                                        <SafetyEventForm 
                                            showSafetyEventForm={true}
                                            eventId={null}
                                            newEventType={match.params.type}
                                            errors={errors}
                                            removeError={removeError}   
                                            {... props} 
                                        />
                                    </div>
                                    <UserAside 
                                        classes={classes} 
                                    />
                                        
                                </div>
                            </div>
                        )
                    }
                    }
                />
            </Switch>
        </div>
    )
}

function mapStateToProps(state){
    // console.log(state); 
    return {
        lookupData: state.lookupData,
        currentUser: state.currentUser,
        errors: state.errors, 
    }
}

export default withRouter(
    connect(mapStateToProps, 
        { 
            authUser,
            logout,
            removeError,
        })(Main)
); 