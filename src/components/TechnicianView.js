import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Card, 
  CardContent,
  IconButton,
  InputAdornment,
  LinearProgress,
  Alert
} from '@mui/material';
import { PhotoCamera, CheckCircle } from '@mui/icons-material';

const TechnicianView = () => {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    workDone: '',
    extraCharges: '',
    finalAmount: '',
    remarks: '',
    photos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('assignedTechnician', '==', currentUser?.name || ''),
          where('status', '==', 'Pending')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      }
    };

    if (currentUser?.name) {
      fetchOrders();
    }
  }, [currentUser]);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setFormData({
      ...formData,
      finalAmount: order.quotedPrice
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).map(file => file.name);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const orderRef = doc(db, 'orders', selectedOrder.id);
      await updateDoc(orderRef, {
        status: 'Completed',
        completedAt: new Date().toISOString(),
        ...formData,
        technicianName: currentUser.name
      });
      setIsCompleted(true);
    } catch (err) {
      setError('Failed to submit job completion');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 2
      }}>
        <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Job Completed Successfully!
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => {
            setSelectedOrder(null);
            setIsCompleted(false);
            setFormData({
              workDone: '',
              extraCharges: '',
              finalAmount: '',
              remarks: '',
              photos: []
            });
          }}
          sx={{ mt: 3 }}
        >
          Back to Job List
        </Button>
      </Box>
    );
  }
  if (selectedOrder) {
    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Complete Job: {selectedOrder.orderId}
        </Typography>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1">
              Customer: {selectedOrder.customerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: {selectedOrder.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Service: {selectedOrder.service}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Original Quote: RM{selectedOrder.quotedPrice}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin Notes: {selectedOrder.adminNotes}
            </Typography>
          </CardContent>
        </Card>
        
        <TextField
          label="Work Done Description"
          name="workDone"
          value={formData.workDone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          multiline
          rows={3}
        />
        
        <TextField
          label="Extra Charges (RM)"
          name="extraCharges"
          value={formData.extraCharges}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        
        <TextField
          label="Final Amount (RM)"
          name="finalAmount"
          value={formData.finalAmount}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          type="number"
        />
        
        <TextField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
        
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Upload Job Photos (max 6):
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ mr: 2 }}
          >
            Add Photos
            <input 
              type="file" 
              hidden 
              multiple 
              accept="image/*"
              onChange={handlePhotoUpload}
              max="6"
            />
          </Button>
          {formData.photos.length > 0 && (
            <Typography variant="caption" display="block">
              {formData.photos.join(', ')}
            </Typography>
          )}
        </Box>
        
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Mark as Completed'}
        </Button>
        
        <Button 
          variant="outlined" 
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setSelectedOrder(null)}
        >
          Back to Job List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Assigned Jobs for  {currentUser?.name}
      </Typography>
      
      {orders.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No pending jobs assigned to you.
        </Typography>
      ) : (
        orders.map(order => (
          <Card 
            key={order.id} 
            sx={{ mb: 2, cursor: 'pointer' }}
            onClick={() => handleOrderSelect(order)}
          >
            <CardContent>
              <Typography variant="subtitle1">
                {order.orderId} - {order.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.service} - RM{order.quotedPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.address}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default TechnicianView;