import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
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
            <Typography gutterBottom variant="h5" component="h2">
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
