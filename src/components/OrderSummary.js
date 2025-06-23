import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const OrderSummary = ({ order, onNewOrder }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Order Submitted Successfully!
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Order ID: {order.orderId}
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        Customer: {order.customerName}
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        Service: {order.service}
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        Technician: {order.assignedTechnician}
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        Status: {order.status}
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={onNewOrder}
        sx={{ mt: 3 }}
      >
        Create Another Order
      </Button>
    </Box>
  );
};

export default OrderSummary;