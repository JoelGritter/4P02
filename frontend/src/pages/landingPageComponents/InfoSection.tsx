import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import testImage from './pageAssets/undraw_split_testing_l1uw.svg';

const useStyles = makeStyles((theme: Theme) => ({
  infoContainer: {
    color: theme.palette.getContrastText('#111'),
    // backgroundColor: theme.palette.secondary.main,
    backgroundColor: '#111',
  },
  infoWrapper: {
    display: 'grid',
    zIndex: 1,
    minHeight: '630px',
    width: '100%',
    maxWidth: '1100px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
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
    padding: theme.spacing(2),
  },
  topLine: {
    color: theme.palette.secondary.main,
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
    color: theme.palette.getContrastText('#111'),
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
      backgroundColor: '#6699ff',
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
                Simplifying Programming Assignments
              </div>
              <div className={classes.subHeading}>
                We're a complete platform for programming assignments,
                streamlining submissions and marking with automated testing
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.imgWrapper}>
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

export default InfoSection;
