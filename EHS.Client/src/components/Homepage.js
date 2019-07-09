import React from 'react'; 
import { Link } from 'react-router-dom';

const Homepage = ({ currentUser }) => {
    //if user is not logged in, route them to the main landing page 
    if(!currentUser.isAuthenticated){
        return (
            <div className='homepage'>
                <h1>Welcome to the newly designed Incident Ivestigation System</h1>
                <h4>New to Dinkin' Flicka?</h4>
                <Link to='/login' className='btn btn-primary'>Log In Here</Link>
            </div>
        );
    }
    //if user is logged in, route them to their dashboard
    return (
        <div>
            <h1>You made it in!</h1>
        </div>
    )
};

export default Homepage; 