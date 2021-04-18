import { Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  nav: {
    backgroundColor: theme.palette.primary.main,
    height: '80px',
    marginTop: '-80pm',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  navbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '80px',
    zIndex: 1,
    width: '100%',
    padding: '0 24px',
    maxWidth: '1100px',
  },
  navbarLogo: {
    fontFamily: 'Lexend',
    fontWeight: 700,
    color: '#fff',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '24px',
    textDecoration: 'none',
  },
  loginButton: {
    fontFamily: 'Lexend',
    fontWeight: 500,
    color: theme.palette.primary.main,
    backgroundColor: '#fff',
    height: '50%',
    width: 100,
    borderRadius: 50,
    margin: 'auto 0',
    '&:hover': {
      backgroundColor: '#fcc',
      transition: '0.5s',
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.nav}>
        <div className={classes.navbarContainer}>
          <div className={classes.navbarLogo}>UAssign</div>
          <Button component={Link} to="/login" className={classes.loginButton}>
            Login
          </Button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
