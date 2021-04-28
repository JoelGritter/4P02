import { Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ReactComponent as Logo } from '../../assets/logo-circle.svg';
import { useRecoilValue } from 'recoil';
import loginState from '../../sharedState/selectors/loginState.selector';

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
    fontWeight: 700,
    color: '#fff',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  loginButton: {
    fontWeight: 500,
    color: theme.palette.primary.main,
    backgroundColor: '#fff',
    height: '50%',
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    borderRadius: 50,
    margin: 'auto 0',
    '&:hover': {
      backgroundColor: '#99bbff',
      transition: '0.5s',
    },
  },
  logo: {
    height: 55,
    width: 55,
    marginRight: theme.spacing(2),
  },
}));

const Navbar = () => {
  const classes = useStyles();

  const loggedIn = useRecoilValue(loginState);

  return (
    <>
      <div className={classes.nav}>
        <div className={classes.navbarContainer}>
          <div className={classes.navbarLogo}>
            <Logo className={classes.logo} /> UAssign
          </div>
          {!loggedIn && (
            <Button
              component={Link}
              to="/login"
              className={classes.loginButton}
            >
              Login
            </Button>
          )}
          {loggedIn && (
            <Button
              component={Link}
              to="/courses"
              className={classes.loginButton}
            >
              Courses
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
