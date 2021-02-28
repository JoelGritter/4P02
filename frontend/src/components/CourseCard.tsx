import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {},
});

interface CourseCardProps {
  name: string;
  instructor: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ name, instructor }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Link to="/courses" style={{ textDecoration: "none" }}>
        <CardActionArea>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              color="primary"
              component="h5"
            >
              {name}
            </Typography>
            <Typography variant="h6" color="textSecondary" component="h6">
              {instructor}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default CourseCard;
