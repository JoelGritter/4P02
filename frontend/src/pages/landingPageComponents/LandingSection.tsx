import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import onlineTest from './pageAssets/undraw_Code_thinking_re_gka2.svg';
import education from './pageAssets/undraw_Accept_request_re_d81h.svg';
import logo from './../../assets/logo.svg';

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
    color: theme.palette.text.primary,
    fontWeight: 700,
    textAlign: 'center',
    marginLeft: theme.spacing(2),
  },
  subText: {
    fontSize: '24px',
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: theme.spacing(2),
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
  onlineTest: {
    position: 'absolute',
    padding: theme.spacing(3),
    maxWidth: '100%',
    maxHeight: '300px',
    bottom: 0,
    left: 0,
    filter: 'opacity(0.25)',
  },
  education: {
    position: 'absolute',
    padding: theme.spacing(3),
    maxWidth: '100%',
    maxHeight: '300px',
    top: 0,
    right: 0,
    filter: 'opacity(0.25)',
  },
  logo: {
    height: '70px',
  },
}));

const LandingSection = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <img src={onlineTest} alt="" className={classes.onlineTest}></img>
        <img src={education} alt="" className={classes.education}></img>
        <div className={classes.backgorund}></div>
        <div className={classes.content}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
          >
            <img src={logo} alt="" className={classes.logo}></img>
            <Typography variant="h2" className={classes.mainText}>
              UAssign
            </Typography>
          </Box>
          <div className={classes.subText}>
            A modern platform for programming assignments
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
