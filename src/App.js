import React, { useContext, useState } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import AppLayout from "./components/AppLayout";
import OrderForm from "./components/OrderForm";
import OrderSummary from "./components/OrderSummary";
import TechnicianView from "./components/TechnicianView";
import TechnicianDashboard from "./components/TechnicianDashboard";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container
} from "@mui/material";

function AdminView() {
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  const handleOrderSubmit = (order) => {
    setSubmittedOrder(order);
  };

  const handleNewOrder = () => {
    setSubmittedOrder(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSubmittedOrder(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sejuk Sejuk Service
          </Typography>
        </Toolbar>
        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab label="Admin View" />
          <Tab label="Technician View" />
          <Tab label="Performance Dashboard" />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {currentTab === 0 ? (
          !submittedOrder ? (
            <OrderForm onOrderSubmit={handleOrderSubmit} />
          ) : (
            <OrderSummary order={submittedOrder} onNewOrder={handleNewOrder} />
          )
        ) : currentTab === 1 ? (
          <TechnicianView />
        ) : (
          <TechnicianDashboard />
        )}
      </Container>
    </>
  );
}

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/admin" />} />
      <Route path="*" element={
        currentUser ? (
          <AppLayout>
            <Routes>
              <Route path="/admin" element={<AdminView />} />
              <Route path="/technician" element={<TechnicianView />} />
              <Route path="/dashboard" element={<TechnicianDashboard />} />
              <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
}

export default App;