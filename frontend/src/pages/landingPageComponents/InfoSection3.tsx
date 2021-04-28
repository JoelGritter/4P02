import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import testImage from './pageAssets/undraw_check_boxes_m3d0.svg';

const useStyles = makeStyles((theme: Theme) => ({
  infoContainer: {
    color: '#000',
  },
  infoWrapper: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: 'grid',
    zIndex: 1,
    minHeight: '630px',
    width: '100%',
    maxWidth: '1100px',
    marginLeft: 'auto',
    marginRight: 'auto',
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
    padding: theme.spacing(2),
  },
  topLine: {
    color: theme.palette.primary.main,
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '5px',
  },
  heading: {
    lineHeight: '1.1',
    marginBottom: theme.spacing(2),
    fontSize: '48px',
    fontWeight: 700,
  },
  subHeading: {
    color: theme.palette.text.secondary,
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
    width: '80%',
    marign: '0 0 10px 0',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    borderRadius: 30,
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
                <img src={testImage} alt="" className={classes.img} />
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.textWrapper}>
              <div className={classes.topLine}>Testing</div>
              <div className={classes.heading}>
                Automated testing for assignment submissions
              </div>
              <div className={classes.subHeading}>
                Save time by defining test cases that are automatically run for
                every submission
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.imgBelow}>
              <div className={classes.imgWrap}>
                <img
                  src={testImage}
                  width={'80%'}
                  alt=""
                  className={classes.img}
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
