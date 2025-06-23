import React, { useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

const NotificationSender = () => {
  useEffect(() => {
    // Initialize EmailJS (replace with your credentials)
    emailjs.init('YOUR_USER_ID');
    
    const unsubscribe = onSnapshot(
      doc(db, 'orders', 'ORDER1236'), // In real app, query all orders
      (doc) => {
        const data = doc.data();
        if (data.status === 'Completed' && !data.notificationSent) {
          sendNotification(data);
        }
      }
    );
    
    return () => unsubscribe();
  }, []);

  const sendNotification = async (orderData) => {
    try {
      // Send email
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          order_id: orderData.orderId,
          customer_name: orderData.customerName,
          technician: orderData.assignedTechnician,
          time: new Date().toLocaleTimeString(),
          to_email: 'customer@example.com', // Replace with actual email
        }
      );
      
      console.log('Notification sent');
      
      // Mark as sent in Firestore
      await updateDoc(doc(db, 'orders', orderData.id), {
        notificationSent: true
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  return null; // This component works in the background
};

export default NotificationSender;