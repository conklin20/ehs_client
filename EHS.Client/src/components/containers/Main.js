import React from 'react'; 
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from './AppBar';
import Homepage from '../function/Homepage';
import AuthForm from '../function/AuthForm';
import Dashboard from '../containers/Dashboard'; 
import { authUser, logout } from '../../store/actions/auth';
import { removeError } from '../../store/actions/errors'; 
import withAuth from '../../hocs/withAuth'; 

const Main = props => {
    const { authUser, logout, errors, removeError, currentUser } = props;
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
                    exact 
                    path='/dashboard' 
                    render={props => {
                        return (
                            <div>
                                <AppBar 
                                currentUser={currentUser} 
                                onLogout={logout}
                                />
                                <div className='dashboard-parent'>
                                    <Dashboard 
                                        currentUser={currentUser} 
                                    />
                                </div>
                            </div>
                        )
                         }} />
                <Route />
            </Switch>
        </div>
    )
}

function mapStateToProps(state){
    return {
        currentUser: state.currentUser,
        errors: state.errors
    }
}

export default withRouter(
    connect(mapStateToProps, { authUser, logout, removeError })(Main)
); 