import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux'
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