import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import styledComponents from 'styled-components';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import {
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import HomeIcon from '@material-ui/icons/Home';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import { NotLogged, Loading } from '..';
import UserContext from '../../store/context/userContext/UserContext';

const drawerWidth = 250;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    ['@media (max-width:768px)']: { // eslint-disable-line no-useless-computed-key
      padding: theme.spacing(1),
    },
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

interface MyProps {
  children: JSX.Element,
  title: string,
}

const MyProfileLayout: React.FC<MyProps> = ({ children, title }: MyProps): JSX.Element => {
  const { t } = useTranslation();
  const { isLogged, loading } = useContext(UserContext);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (mediaQuery.matches) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);
  useEffect(() => {
    ReactGA.pageview(router.asPath);
  }, []);
  return (
    <div className={classes.root}>
      <CssBaseline>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
              color="secondary"
              edge="start"
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>
            <Typography color="secondary" variant="h6" noWrap>
              {title}
            </Typography>
            <Link href="/">
              <StyledHomeIcon fontSize="large" />
            </Link>
          </Toolbar>
        </AppBar>
        <Drawer
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
          variant="permanent"
        >
          <div className={classes.toolbar}>
            <IconButton onClick={() => setOpen(!open)}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <Link href="/myprofile">
              <ListItem button>
                <ListItemIcon><AccountCircleIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary={t('sidebar.updateProfile').toUpperCase()} />
              </ListItem>
            </Link>
            <Link href="/myspaces">
              <ListItem button>
                <ListItemIcon><ImportantDevicesIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary={t('sidebar.mySpaces').toUpperCase()} />
              </ListItem>
            </Link>
            <Link href="/mybooks">
              <ListItem button>
                <ListItemIcon><LibraryBooksIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary={t('sidebar.mybooks').toUpperCase()} />
              </ListItem>
            </Link>
            <Link href="/addBook">
              <ListItem button>
                <ListItemIcon><LibraryAddIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary={t('sidebar.addBook').toUpperCase()} />
              </ListItem>
            </Link>
            <Link href="/help">
              <ListItem button>
                <ListItemIcon><ContactSupportIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary={t('sidebar.help').toUpperCase()} />
              </ListItem>
            </Link>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {
            // eslint-disable-next-line no-nested-ternary
            loading ? <Loading /> : (isLogged ? children : <NotLogged />)
          }
        </main>
      </CssBaseline>
    </div>
  );
};

const StyledHomeIcon = styledComponents(HomeIcon)`
  text-decoration: none;
  align-self: center;
  justify-self: center;
  margin-left: 70%;
  :hover{
    cursor: pointer;
  }
  color: ${(props) => props.theme.contrastText};
`;

export default MyProfileLayout;
