import React from 'react'; 
import { Link } from 'react-router-dom';
import Main from '../containers/Main';
import AuthForm from './AuthForm';
import SafetyIncidentList from '../Event/Safety/Incidents'; 
import coverImage from '../../images/mfg-plant.jpg';

const homepageCss = {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: '0',
    left: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '-1'
}  
const homepageLeftCss = {
    width: '70%',
    height: '100vh',
    backgroundImage: `url(${coverImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
}  
const homepageRightCss = {
    color: '#',
    width: '30%',
    height: '100vh',
    textShadow: '0 0 8px #66757f',
    textAlign: 'center',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
}


const Homepage = (props) => {
    //if user is not logged in, route them to the main landing page 
    const { authUser, errors, removeError, currentUser } = props;
    if(!currentUser.isAuthenticated){
        return (
            <div style={homepageCss}>
                <div style={homepageLeftCss}>
                    {/* background image rendered */}
                </div>
                <div style={homepageRightCss}>
                    <h1>Welcome to the newly designed Incident Investigation System!</h1>
                    <AuthForm 
                        errors={errors}
                        removeError={removeError}
                        onAuth={authUser}
                        buttonText='Log In!'
                        heading='Welcome Back'
                        domain='VSTO\'
                        {...props } 
                    />
                    <div>
                        <span>
                            &copy 2019 All Rights Reserved
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    //if user is logged in, route them to their dashboard
    return (
        <div>
            {/* {<SafetyIncidentList />} */}
        </div>
    )
};

export default Homepage; 