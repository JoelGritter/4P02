import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    textDecoration: "none",
  },
});

export default function CourseCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Link to="/courses" style={{ textDecoration: "none" }}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="140"
            image="https://picsum.photos/200"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              color="primary"
              component="h5"
            >
              Course name
            </Typography>
            <Typography variant="h6" color="textSecondary" component="h6">
              Instructor
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
