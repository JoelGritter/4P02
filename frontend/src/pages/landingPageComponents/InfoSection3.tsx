import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import testImage from './pageAssets/undraw_check_boxes_m3d0.png';

const useStyles = makeStyles((theme: Theme) => ({
  infoContainer: {
    color: '#000',
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
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBelow: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    display: 'flex',
  },
  topLine: {
    color: theme.palette.primary.main,
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '5px',
  },
  heading: {
    lineHeight: '1.1',
    marginBottom: '10px',
    fontSize: '48px',
    fontWeight: 700,
  },
  subHeading: {
    color: '#999',
    maxWidth: '440px',
    fontSize: '18px',
    fontWeight: 500,
  },
  loginButton: {
    width: '200px',
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

const InfoSection3 = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.infoContainer}>
        <div className={classes.infoWrapper}>
          <Grid container component="main" className={classes.infoRow}>
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
            <Grid item xs={12} md={6} className={classes.textWrapper}>
              <div className={classes.topLine}>Testing</div>
              <div className={classes.heading}>
                Automated testing for assignment submissions
              </div>
              <div className={classes.subHeading}>
                Unique automated tests set for each assignment taking care of
                the hassle of checking student submission
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.imgBelow}>
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

export default InfoSection3;
