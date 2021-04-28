import { Box, Button, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import logo from '../../assets/logo.svg';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    zIndex: 1,
    minHeight: '500px',
  },
  content: {
    width: '100%',
  },
  mainText: {
    color: '#000',
    fontWeight: 700,
    textAlign: 'center',
    marginLeft: theme.spacing(2),
  },
  subText: {
    fontSize: '24px',
    fontWeight: 500,
    textAlign: 'center',
  },
  loginButton: {
    fontWeight: 700,
    fontSize: '18px',
    color: '#fff',
    marginTop: '15px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 50,
    padding: '8px 30px',
    '&:hover': {
      backgroundColor: '#6699ff',
      transition: '0.5s',
    },
    textAlign: 'center',
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  gridItemInner: {
    maxWidth: '600px',
    textAlign: 'center',
  },
  logo: {
    height: '50px',
  },
}));

const CallToAction = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <div className={classes.content}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginBottom={7}
          >
            <img src={logo} alt="" className={classes.logo} />
            <Typography className={classes.mainText} variant="h3">
              UAssign
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <div className={classes.gridItem}>
                <div className={classes.subText}>
                  Already in a UAssign enabled course?
                </div>
                <Button
                  component={Link}
                  to="/login"
                  className={classes.loginButton}
                >
                  Login or create an account
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <div className={classes.gridItemInner}>
                <div className={classes.subText}>
                  Are you an instructor/institution looking to use UAssign for
                  your courses?
                </div>
                <Button
                  component="a"
                  href="mailto:sales@uassign.app"
                  className={classes.loginButton}
                >
                  Contact sales@uassign.app
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default CallToAction;
