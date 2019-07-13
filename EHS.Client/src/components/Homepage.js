import React from 'react'; 
import { Link } from 'react-router-dom';
import Main from './Main';
import AuthForm from './User/AuthForm';
import SafetyIncidentList from './Event/Safety/Incidents'; 

const Homepage = (props) => {
    //if user is not logged in, route them to the main landing page 
    const { authUser, errors, removeError, currentUser } = props;
    if(!currentUser.isAuthenticated){
        return (
            <div className='homepage'>
                <div className='homepage-left'>
                    {/* background image rendered */}
                </div>
                <div className='homepage-right'>
                    <h1>Welcome to the newly designed Incident Investigation System!</h1>
                    {/* <Link to='/login' className='btn btn-primary'>Log In Here</Link> */}
                    <AuthForm 
                        errors={errors}
                        removeError={removeError}
                        onAuth={authUser}
                        buttonText='Log In!'
                        heading='Welcome Back'
                        domain='VSTO\'
                        {...props } 
                    />
                </div>
            </div>
        );
    }
    //if user is logged in, route them to their dashboard
    return (
        <div>
            {<SafetyIncidentList />}
        </div>
    )
};

export default Homepage; 