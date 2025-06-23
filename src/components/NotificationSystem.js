import React, { useState, useEffect } from 'react';
import { realtimeDb } from '../firebase';
import { ref, push, onValue, off } from 'firebase/database';
import { 
  Snackbar, 
  Alert, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  List, 
  ListItem, 
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationSystem = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Listen for notifications
  useEffect(() => {
    const notificationsRef = ref(realtimeDb, `notifications/${userId}`);
    
    const listener = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationList = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          read: data[key].read || false
        }));
        
        setNotifications(notificationList.reverse());
        setUnreadCount(notificationList.filter(n => !n.read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => off(notificationsRef, listener);
  }, [userId]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (notificationId) => {
    // In a real app, you would update the notification in the database
    // For simplicity, we'll just update local state
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? {...n, read: true} : n
    ));
    setUnreadCount(prev => prev - 1);
  };

  const showNotification = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: '70vh',
            width: '350px',
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ p: 2 }}>
          Notifications
        </Typography>
        
        {notifications.length === 0 ? (
          <MenuItem disabled>
            No notifications
          </MenuItem>
        ) : (
          <List dense>
            {notifications.map(notification => (
              <ListItem 
                key={notification.id}
                sx={{ 
                  bgcolor: notification.read ? 'background.paper' : 'action.selected',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
                onClick={() => markAsRead(notification.id)}
              >
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {notification.message}
                      </Typography>
                      <br />
                      {new Date(notification.timestamp).toLocaleString()}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotificationSystem;

// Helper function to send notifications
export const sendNotification = async (userId, title, message) => {
  const notificationsRef = ref(realtimeDb, `notifications/${userId}`);
  
  await push(notificationsRef, {
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false
  });
  
  return true;
};