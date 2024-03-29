import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import HelpIcon from '@material-ui/icons/Help';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Link, useLocation } from 'react-router-dom';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import { logout } from '../api/auth';
import useMe from '../api/data/use-me';
import { Collapse, ListSubheader } from '@material-ui/core';
import { cache } from 'swr';
import logo from '../assets/logo.svg';
import useAssociatedCourses from '../api/data/use-associated-courses';
import BookIcon from '@material-ui/icons/Book';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      // backgroundColor: 'yellow',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      backgroundColor: '#fff',
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerToolbar: {
      ...theme.mixins.toolbar,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: theme.spacing(2),
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
      maxWidth: '100%',
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    coursesContainer: {},
    calendarContainer: {},
    nested: {
      paddingLeft: theme.spacing(4),
    },
    logo: {
      height: 35,
    },
    logoName: {
      fontWeight: 700,
      marginLeft: theme.spacing(2),
    },
  })
);

interface Props {
  window?: () => Window;
  children?: any;
}

export default function Nav(props: Props) {
  const { window, children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [adminOpen, setAdminOpen] = React.useState(false);
  const [coursesOpen, setCoursesOpen] = React.useState(false);

  const { me } = useMe();
  const isAdmin = me?.roles?.includes('admin');

  const { studentCourses, modCourses, profCourses } = useAssociatedCourses();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { pathname } = useLocation();

  const pathStartsWith = React.useCallback(
    (str: string) => pathname.substr(0, str.length) === str,
    [pathname]
  );

  React.useEffect(() => {
    if (pathStartsWith('/admin')) {
      setAdminOpen(true);
    }
    if (pathStartsWith('/courses')) {
      setCoursesOpen(true);
    }
  }, [pathStartsWith]);

  // const pathIs = (str: string) =>
  //   pathname === str || pathname === str + '/' || pathname + '/' === str;

  const drawer = (
    <div>
      <div className={classes.drawerToolbar}>
        <Link to="/">
          <img src={logo} alt="" className={classes.logo} />
        </Link>
        <Typography
          variant="h6"
          color="primary"
          noWrap
          className={classes.logoName}
        >
          UAssign
        </Typography>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          component={Link}
          to="/courses"
          key="courses"
          onClick={() => {
            setCoursesOpen((prev) => !prev);
          }}
        >
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary={'Courses'} />
          {coursesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={coursesOpen} timeout="auto">
          <List component="div" disablePadding>
            {profCourses && profCourses.length > 0 && (
              <ListSubheader className={classes.nested}>
                Courses I'm Teaching
              </ListSubheader>
            )}
            {profCourses?.map((course) => (
              <ListItem
                button
                key={course._id}
                className={classes.nested}
                component={Link}
                selected={pathStartsWith(`/courses/${course._id}`)}
                to={`/courses/${course._id}`}
                onClick={() => {
                  setMobileOpen(false);
                }}
              >
                <ListItemText primary={course.name} />
              </ListItem>
            ))}
            {modCourses && modCourses.length > 0 && (
              <ListSubheader className={classes.nested}>
                My TA Courses
              </ListSubheader>
            )}
            {modCourses?.map((course) => (
              <ListItem
                button
                key={course._id}
                className={classes.nested}
                component={Link}
                selected={pathStartsWith(`/courses/${course._id}`)}
                to={`/courses/${course._id}`}
                onClick={() => {
                  setMobileOpen(false);
                }}
              >
                <ListItemText primary={course.name} />
              </ListItem>
            ))}
            {studentCourses && studentCourses.length > 0 && (
              <ListSubheader className={classes.nested}>
                My Courses
              </ListSubheader>
            )}
            {studentCourses?.map((course) => (
              <ListItem
                button
                key={course._id}
                className={classes.nested}
                component={Link}
                selected={pathStartsWith(`/courses/${course._id}`)}
                to={`/courses/${course._id}`}
                onClick={() => {
                  setMobileOpen(false);
                }}
              >
                <ListItemText primary={course.name} />
              </ListItem>
            ))}
          </List>
        </Collapse>
        <ListItem
          button
          key="profile"
          component={Link}
          to="/profile"
          selected={pathStartsWith('/profile')}
          onClick={() => {
            setMobileOpen(false);
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={'Profile'} />
        </ListItem>

        {isAdmin && (
          <>
            <ListItem
              button
              key="admin"
              onClick={() => {
                setAdminOpen((prev) => !prev);
              }}
            >
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText primary={'Admin'} />
              {adminOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={adminOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  selected={pathStartsWith('/admin/users')}
                  to="/admin/users"
                  onClick={() => {
                    setMobileOpen(false);
                  }}
                >
                  <ListItemText primary="Users" />
                </ListItem>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/admin/courses"
                  selected={pathStartsWith('/admin/courses')}
                  onClick={() => {
                    setMobileOpen(false);
                  }}
                >
                  <ListItemText primary="Courses" />
                </ListItem>
              </List>
            </Collapse>
          </>
        )}
        <ListItem
          button
          key="help"
          component={Link}
          to="/help"
          selected={pathStartsWith('/help')}
          onClick={() => {
            setMobileOpen(false);
          }}
        >
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary={'Help'} />
        </ListItem>
        <ListItem
          button
          key="logout"
          onClick={() => {
            cache.clear();
            logout();
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={'Logout'} />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <Hidden smUp>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <img src={logo} alt="" className={classes.logo} />

            <Typography
              variant="h6"
              color="primary"
              noWrap
              className={classes.logoName}
            >
              UAssign
            </Typography>
          </Toolbar>
        </AppBar>
      </Hidden>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <Hidden smUp>
          <div className={classes.toolbar} />
        </Hidden>
        {children}
      </main>
    </div>
  );
}
