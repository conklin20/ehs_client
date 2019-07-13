import React from 'react'; 
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Homepage from './Homepage.js'
import AuthForm from '../components/User/AuthForm';
import { authUser } from '../store/actions/auth';
import { removeError } from '../store/actions/errors'; 
// import withAuth from '../hocs/withAuth'; 

const Main = props => {
    const { authUser, errors, removeError, currentUser } = props;
    return(
        <div className='container'>
            <Switch>
                <Route 
                    exact 
                    path='/z' 
                    render={props => <Homepage currentUser={currentUser} {...props} /> } />
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
                                buttonText='Log In!'
                                heading='Log In Here'
                                domain='VSTO\'
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