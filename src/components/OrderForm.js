import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { TextField, Button, MenuItem, Box, Typography, CircularProgress } from "@mui/material";

const OrderForm = ({ onOrderSubmit }) => {
  const [formData, setFormData] = useState({
    orderId: `ORDER${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: "",
    phone: "",
    address: "",
    problemDescription: "",
    service: "",
    quotedPrice: "",
    assignedTechnician: "",
    adminNotes: "",
    status: "Pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const services = [
    "Aircond cleaning",
    "Gas top-up",
    "Repair",
    "Installation",
    "Maintenance",
  ];

  const technicians = ["Ali", "John", "Min"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Check required fields
    const requiredFields = ['customerName', 'phone', 'address', 'service', 'quotedPrice', 'assignedTechnician'];
    const isFormValid = requiredFields.every(field => formData[field]);
    
    if (!isFormValid) {
      console.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "orders"), formData);
      console.log("Document written with ID: ", docRef.id);
      onOrderSubmit(formData);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('Failed to submit order. Please check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
      gap: 3,
      mt: 2,
    }}>
      <Typography variant="h6" gutterBottom sx={{ gridColumn: '1 / -1' }}>
        Create New Order
      </Typography>

      <TextField
        label="Order ID"
        value={formData.orderId}
        fullWidth
        margin="normal"
        disabled
      />

      <TextField
        label="Customer Name *"
        name="customerName"
        value={formData.customerName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={formSubmitted && !formData.customerName}
        helperText={formSubmitted && !formData.customerName ? 'This field is required' : ''}
      />

      <TextField
        label="Phone Number *"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={formSubmitted && !formData.phone}
        helperText={formSubmitted && !formData.phone ? 'This field is required' : ''}
      />

      <TextField
        label="Address *"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        multiline
        rows={3}
        error={formSubmitted && !formData.address}
        helperText={formSubmitted && !formData.address ? 'This field is required' : ''}
        sx={{ gridColumn: '1 / -1' }}
      />

      <TextField
        label="Problem Description *"
        name="problemDescription"
        value={formData.problemDescription}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        multiline
        rows={3}
        error={formSubmitted && !formData.problemDescription}
        helperText={formSubmitted && !formData.problemDescription ? 'This field is required' : ''}
        sx={{ gridColumn: '1 / -1' }}
      />

      <TextField
        select
        label="Service Needed *"
        name="service"
        value={formData.service}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={formSubmitted && !formData.service}
        helperText={formSubmitted && !formData.service ? 'Please select a service' : ''}
      >
        {services.map((service) => (
          <MenuItem key={service} value={service}>
            {service}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Quoted Price (RM) *"
        name="quotedPrice"
        value={formData.quotedPrice}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        type="number"
        error={formSubmitted && !formData.quotedPrice}
        helperText={formSubmitted && !formData.quotedPrice ? 'This field is required' : ''}
      />

      <TextField
        select
        label="Assigned Technician *"
        name="assignedTechnician"
        value={formData.assignedTechnician}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={formSubmitted && !formData.assignedTechnician}
        helperText={formSubmitted && !formData.assignedTechnician ? 'Please select a technician' : ''}
      >
        {technicians.map((tech) => (
          <MenuItem key={tech} value={tech}>
            {tech}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Admin Notes to Technician"
        name="adminNotes"
        value={formData.adminNotes}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
        sx={{ gridColumn: '1 / -1' }}
      />

      <Button 
        type="submit" 
        variant="contained" 
        sx={{ mt: 3, gridColumn: '1 / -1' }}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Submit Order'}
      </Button>
    </Box>
  );
};

export default OrderForm;