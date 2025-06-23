import React, { useState, useContext } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Paper,
  TextField,
  Alert
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      bgcolor: 'background.default'
    }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom align="center">
          Sejuk Sejuk Service
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          required
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          Login
        </Button>

        {/* Demo Credentials Hint */}
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          Demo accounts: ali@sejuk.com, john@sejuk.com, admin@sejuk.com
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;