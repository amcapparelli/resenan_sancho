import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import ReactGA from "react-ga4";
import { Theme, useTheme, styled } from '@mui/material/styles';
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
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import HomeIcon from '@mui/icons-material/Home';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import { NotLogged, Loading } from '..';
import UserContext from '../../store/context/userContext/UserContext';

const drawerWidth = 250;

const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden' as const,
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open ? {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  } : {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  '@media (max-width:768px)': {
    padding: theme.spacing(1),
  },
}));

interface MyProps {
  children: JSX.Element,
  title: string,
}

const MyProfileLayout: React.FC<MyProps> = ({ children, title }: MyProps): JSX.Element => {
  const { t } = useTranslation();
  const { isLogged, loading } = useContext(UserContext);
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
    ReactGA.send({ hitType: "pageview", page: router.asPath });
  }, []);
  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline>
        <StyledAppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
              color="secondary"
              edge="start"
              onClick={() => setOpen(!open)}
              size="large">
              <MenuIcon />
            </IconButton>
            <Typography color="secondary" variant="h6" noWrap>
              {title}
            </Typography>
            <Link href="/">
              <StyledHomeIcon fontSize="large" />
            </Link>
          </Toolbar>
        </StyledAppBar>
        <StyledDrawer open={open} variant="permanent">
          <DrawerHeader>
            <IconButton onClick={() => setOpen(!open)} size="large">
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
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
        </StyledDrawer>
        <MainContent>
          <DrawerHeader />
          {
            // eslint-disable-next-line no-nested-ternary
            loading ? <Loading /> : (isLogged ? children : <NotLogged />)
          }
        </MainContent>
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
