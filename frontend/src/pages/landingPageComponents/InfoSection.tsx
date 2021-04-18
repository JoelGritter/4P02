import { Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import testImage from './pageAssets/undraw_split_testing_l1uw.png';

const useStyles = makeStyles((theme: Theme) => ({
  infoContainer: {
    color: '#000',
    backgroundColor: '#fdd',
  },
  infoWrapper: {
    display: 'grid',
    zIndex: 1,
    height: '630px',
    width: '100%',
    maxWidth: '1100px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0 24px',
    justifyContent: ' center',
  },
  infoRow: {
    maxWidth: '1100px',
    overflow: 'hidden',
  },
  columnOne: {
    marginBottom: '15px',
    padding: '0 15px',
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imgWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLine: {
    color: theme.palette.primary.main,
    fontSize: '16px',
    fontFamily: 'Lexend',
    fontWeight: 700,
    marginBottom: '5px',
  },
  heading: {
    lineHeight: '1.1',
    marginBottom: '10px',
    fontSize: '48px',
    fontFamily: 'Lexend',
    fontWeight: 700,
  },
  subHeading: {
    color: '#999',
    maxWidth: '440px',
    fontSize: '18px',
    fontFamily: 'Lexend',
    fontWeight: 500,
  },
  loginButton: {
    width: '200px',
    fontFamily: 'Lexend',
    fontWeight: 500,
    color: '#fff',
    marginTop: '15px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 50,
    padding: '8px 20px',
    '&:hover': {
      backgroundColor: '#fcc',
      transition: '0.5s',
    },
  },
  imgWrap: {
    display: 'flex',
    maxWidth: '555px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    marign: '0 0 10px 0',
  },
}));

const InfoSection = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.infoContainer}>
        <div className={classes.infoWrapper}>
          <Grid container component="main" className={classes.infoRow}>
            <Grid item xs={12} md={6} className={classes.textWrapper}>
              <div className={classes.topLine}>Mission</div>
              <div className={classes.heading}>
                Taking the next step in innovation
              </div>
              <div className={classes.subHeading}>
                A platform that enables institutions with the ability of
                automated testing
              </div>
              <Button
                component={Link}
                to="/login"
                className={classes.loginButton}
              >
                Create an account
              </Button>
            </Grid>
            <Grid item xs={12} md={6} className={classes.imgWrapper}>
              <div className={classes.imgWrap}>
                <img
                  src={testImage}
                  width={'80%'}
                  alt=""
                  style={{ borderRadius: 30 }}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default InfoSection;
