import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import { Navbar, NavDropdown, Nav, NavItem, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { logout } from '../store/actions/auth'; 
import Logo from '../images/vista-outdoor-vector-logo.png'

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

  logout = e => {
    e.preventDefault(); 
    this.props.logout(); 
  }

  render() {
    return (
      <div>
        {this.props.currentUser.isAuthenticated ? (
          <Navbar bg='light' expand='lg'>
              <Navbar.Brand href='#home'>
                  <img
                      src={Logo} 
                      width='15%'
                      height='15%'
                      className='d-inline-block align-top'
                      alt='Vista Outdoor Logo'
                  />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                  <Nav className='mr-auto'>   
                          <Nav.Link href='#home'>Dashboard</Nav.Link>
                          <NavDropdown title='Report' id='basic-nav-dropdown'>
                              <NavDropdown.Item href='#'>
                                <Link to='/events/safety'>Report Safety Incident</Link>
                              </NavDropdown.Item>
                          </NavDropdown>
                  </Nav>
              </Navbar.Collapse>
              <span>Display Username and Icon</span>
              <NavItem onClick={this.logout}>
                <Link to="/">Log Out</Link>
              </NavItem> 
          </Navbar>
          // if the user is not logged in, dont show the navbar 
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state){
    return {
        currentUser: state.currentUser
    };
}

export default connect(mapStateToProps, {logout})(EHSNavbar); 