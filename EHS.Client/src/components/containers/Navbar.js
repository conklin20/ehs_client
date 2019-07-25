import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/auth'; 
import Logo from '../../images/vista-outdoor-vector-logo.png'

const NavBar = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit">
            EHS 
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default NavBar;

// const useStyles = makeStyles(theme => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

// class EHSNavbar extends Component {
//   logout = e => {
//     e.preventDefault(); 
//     this.props.logout(); 
//   }

//   render() {
//     const classes = useStyles();
//     // console.log(this.props.currentUser)
//     return (      
//     <div className={classes.root}>
//       <AppBar position="static">
//         <Toolbar>
//           <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" className={classes.title}>
//             News
//           </Typography>
//           <Button color="inherit">Login</Button>
//         </Toolbar>
//       </AppBar>
//     </div>
//       // <div>
//       //   {this.props.currentUser.isAuthenticated ? (
//       //     <Navbar bg='light' expand='lg'>
//       //         <Navbar.Brand href='/'>
//       //             <img
//       //                 src={Logo} 
//       //                 width='15%'
//       //                 height='15%'
//       //                 className='d-inline-block align-top'
//       //                 alt='Vista Outdoor Logo'
//       //             />
//       //         </Navbar.Brand>
//       //         <Navbar.Toggle aria-controls='basic-navbar-nav' />
//       //         <Navbar.Collapse id='basic-navbar-nav'>
//       //             <Nav className='mr-auto'>   
//       //                     <Nav.Link href='#home'>Dashboard</Nav.Link>
//       //                     <NavDropdown title='Report' id='basic-nav-dropdown'>
//       //                         <NavDropdown.Item href='#'>
//       //                           <Link to='/events/safety'>Report Safety Incident</Link>
//       //                         </NavDropdown.Item>
//       //                     </NavDropdown>
//       //             </Nav>
//       //         </Navbar.Collapse>
//       //         <Navbar.Collapse className="justify-content-end flex-column">
//       //           <Navbar.Text>
//       //             { `Welcome, ${ this.props.currentUser.user.given_name || this.props.currentUser.user.firstName }!` }
//       //           </Navbar.Text>
//       //           <NavItem onClick={this.logout}>
//       //             <Link to="/">Log Out</Link>
//       //           </NavItem> 
//       //         </Navbar.Collapse>
//       //     </Navbar>
//       //     // if the user is not logged in, dont show the navbar 
//       //   ) : null}
//       // </div>
//     );
//   }
// }

// function mapStateToProps(state){
//     return {
//         currentUser: state.currentUser
//     };
// }

// export default connect(mapStateToProps, {logout})(EHSNavbar); 