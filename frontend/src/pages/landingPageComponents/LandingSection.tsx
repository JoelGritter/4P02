import { Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 30px',
    height: 'calc(100vh - 80px)',
    position: 'relative',
    zIndex: 1,
  },
  backgorund: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    zIndex: 3,
    maxWidth: '1100px',
    position: 'absolute',
    padding: '8px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainText: {
    color: '#000',
    fontSize: '40px',
    fontWeight: 700,
    textAlign: 'center',
  },
  subText: {
    fontSize: '24px',
    fontWeight: 500,
    textAlign: 'center',
  },
  loginButton: {
    fontWeight: 500,
    color: '#fff',
    marginTop: '15px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 50,
    padding: '8px 20px',
    '&:hover': {
      backgroundColor: '#6699ff',
      transition: '0.5s',
    },
  },
  arrowDown: {
    position: 'absolute',
    bottom: 40,
  },
  icon: { width: 80, height: 80, color: theme.palette.primary.main },
}));

const LandingSection = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <div className={classes.backgorund}></div>
        <div className={classes.content}>
          <div className={classes.mainText}>UAssign</div>
          <div className={classes.subText}>
            Helping institutions take the next step in automation
          </div>
          <Button component={Link} to="/login" className={classes.loginButton}>
            Join UAssign!
          </Button>
        </div>
        <div className={classes.arrowDown}>
          <KeyboardArrowDownIcon className={classes.icon} />
        </div>
      </div>
    </>
  );
};

export default LandingSection;
