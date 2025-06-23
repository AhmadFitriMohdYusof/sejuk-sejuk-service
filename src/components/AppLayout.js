import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  AppBar
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  Assessment,
  Menu,
  ExitToApp,
  Person
} from '@mui/icons-material';

const drawerWidth = 240;

const AppLayout = ({ children }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { 
      text: 'Admin', 
      icon: <Dashboard />, 
      path: '/admin',
      roles: ['admin'] 
    },
    { 
      text: 'Technician', 
      icon: <Assignment />, 
      path: '/technician',
      roles: ['technician'] 
    },
    { 
      text: 'Dashboard', 
      icon: <Assessment />, 
      path: '/dashboard',
      roles: ['admin', 'technician'] 
    }
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        justifyContent: isMobile ? 'space-between' : 'center'
      }}>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        )}
        <Typography variant="h6" noWrap>
          Sejuk Sejuk
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          item.roles.includes(currentUser?.role) && (
            <ListItem 
              button 
              key={item.text}
              selected={location.pathname.startsWith(item.path)}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname.startsWith(item.path) ? 'white' : 'inherit' 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
      </List>
      <Divider />
      <List>
        <ListItem 
          button 
          onClick={() => {
            logout();
            navigate('/login');
          }}
          sx={{
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText'
            }
          }}
        >
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <Menu />
              </IconButton>
            )}
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              {navItems.find(item => location.pathname.startsWith(item.path))?.text || 'Admin'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                {currentUser?.name}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ 
          mt: 8,
          p: 3 
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;