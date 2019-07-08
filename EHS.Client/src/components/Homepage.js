import React from "react"; 
import { Link } from "react-router-dom";

const Homepage = () => (
    <div className="homepage">
        <h1>Welcome to the newly designed Incident Ivestigation System</h1>
        <h4>New to Dinkin' Flicka?</h4>
        <Link to="/login" className="btn btn-primary">Log In Here</Link>
    </div>
)

export default Homepage; 