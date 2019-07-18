import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import errors from '../../store/reducers/errors';

export default class AuthForm extends Component {
    constructor(props) {
        super(props); 

        //set default state 
        this.state  = {
            email: "", 
            username: "", 
            password: ""
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    
handleSubmit = e => {
    e.preventDefault(); 
    const authType = this.props.signUp ? "signup" : "signin";
    this.props.onAuth(authType, this.state)
        .then( () => {
            //use react-router to redirect use to dashboard 
            this.props.history.push("/dashboard");
        })
        .catch(() => {
            return; 
        })
}

    render() {
        const { username, password } = this.state; 
        const { heading, buttonText , domain, errors, history, removeError } = this.props; 

        // this is react-router, listening for any changes in the route. If there is a change in the route, call removeError() to remove any errors from the page
        history.listen(() => {
            removeError(); 
        });

        return (
            <div>
                <div className="row justify-content-md-center">
                    <div className="col-md-6">
                        <Form onSubmit={this.handleSubmit}>
                            <h2>{heading}</h2>
                            {/* How we show an alert with an error message returned from the API */}
                            {errors.message && (
                                <Alert variant='danger'>{errors.message}</Alert> 
                            )}
                            <Form.Group controlId="username">
                                <Form.Label>User Id</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter your user Id" 
                                    name="username"
                                    onChange={this.handleChange}
                                    value={username}
                                />
                                <Form.Text className="text-muted">
                                    Log in with your {domain} Active Directory account 
                                </Form.Text>
                            </Form.Group>                            
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password"
                                    name="password"
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                {buttonText}
                            </Button>
                            {/* 
                                Skipping the Sign up/request account part for now, as I am not sure how that flow should work yet
                            */}
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}