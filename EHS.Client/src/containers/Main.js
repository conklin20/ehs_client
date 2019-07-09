import React from 'react'; 
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Homepage from '../components/Homepage.js'
import AuthForm from '../components/AuthForm';
import { authUser } from '../store/actions/auth';
import { removeError } from '../store/actions/errors'; 

const Main = props => {
    const { authUser, errors, removeError, currentUser } = props;
    return(
        <div className='container'>
            <Switch>
                <Route 
                    exact 
                    path='/' 
                    render={props => <Homepage currentUser={currentUser} {...props} /> } />
                <Route 
                    exact 
                    path='/login' 
                    render={props => {
                    return (
                        <AuthForm 
                            errors={errors}
                            removeError={removeError}
                            onAuth={authUser}
                            buttonText='Log In!'
                            heading='Welcome Back'
                            domain='VSTO\'
                            {...props } 
                        />
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
                            // onAuth={authUser}
                            buttonText='Sign Up!'
                            heading='Create an account'
                            domain=''
                            {...props } 
                        />
                    )
                }} />
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

export default withRouter(connect(mapStateToProps, { authUser, removeError })(Main)); 