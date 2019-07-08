import React, { Component } from 'react';
import { Link } from "react-router-dom"; 
import { Navbar, NavDropdown, Nav, NavItem, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Logo from "../images/vista-outdoor-vector-logo.png"

class EHSNavbar extends Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">
                <img
                    src={Logo} 
                    width="15%"
                    height="15%"
                    className="d-inline-block align-top"
                    alt="Vista Outdoor Logo"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Dashboard</Nav.Link>
                    <NavDropdown title="Report" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#">Safety Incident</NavDropdown.Item>
                        {/* <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
                    </NavDropdown>
                </Nav>
                <NavItem>
                    <Link to="/login">Log In</Link>
                </NavItem> 
                <NavItem>
                    <Link to="/logout">Log Out</Link>
                </NavItem> 
            </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

function mapStateToProps(state){
    return {
        currentUser: state.currentUser
    };
}

export default connect(mapStateToProps, null)(EHSNavbar); 