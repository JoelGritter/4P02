import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) => ({
  infoContainer: {
    backgroundColor: '#000',
    color: '#fff',
  },
  infoWrapper: {
    zIndex: 1,
    width: '100%',
    maxWidth: '1100px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0 24px',
    justifyContent: ' center',
  },
  infoRow: {
    paddingTop: '70px',
    paddingBottom: '70px',
    maxWidth: '1100px',
    overflow: 'hidden',
  },
  columnOne: {
    marginBottom: '15px',
    padding: '0 15px',
  },
  textWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imgWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLine: {
    color: theme.palette.primary.main,
    fontSize: '16px',
    fontWeight: 700,
  },
  heading: {
    lineHeight: '1.1',
    marginBottom: '10px',
    fontSize: '30px',
    fontWeight: 700,
  },
  subHeading: {
    maxWidth: '440px',
    fontSize: '14px',
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

const Footer = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.infoContainer}>
        <div className={classes.infoWrapper}>
          <Grid container component="main" className={classes.infoRow}>
            <Grid item xs={12} md={6} className={classes.textWrapper}>
              <div className={classes.heading}>Footer</div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.textWrapper}>
              <div className={classes.heading}>Developers</div>
              <div className={classes.subHeading}>Full Name</div>
              <div className={classes.subHeading}>Full Name</div>
              <div className={classes.subHeading}>Full Name</div>
              <div className={classes.subHeading}>Full Name</div>
              <div className={classes.subHeading}>Full Name</div>
              <div className={classes.subHeading}>Full Name</div>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default Footer;
