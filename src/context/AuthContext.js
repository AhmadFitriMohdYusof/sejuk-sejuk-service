import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Make sure you have auth imported from your firebase config
import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Determine role based on email or other logic
        const role = determineUserRole(user.email);
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || extractNameFromEmail(user.email),
          role: role
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Helper function to determine role
  const determineUserRole = (email) => {
    if (!email) return 'customer';
    if (email.includes('admin@')) return 'admin';
    if (email.includes('ali@')) return 'technician';
    if (email.includes('john@')) return 'technician';
    if (email.includes('min@')) return 'technician';
    return 'customer';
  };

  // Helper to extract name from email
  const extractNameFromEmail = (email) => {
    if (!email) return 'User';
    if (email.includes('ali@')) return 'Ali';
    if (email.includes('john@')) return 'John';
    if (email.includes('min@')) return 'Min';
    return email.split('@')[0];
  };

  // Login function with Firebase Auth
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const role = determineUserRole(user.email);
      
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName || extractNameFromEmail(user.email),
        role: role
      });
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

  // For testing/demo purposes (can be removed in production)
  const demoLogin = (role, name) => {
    setCurrentUser({
      uid: `${role}_${name.toLowerCase().replace(/\s+/g, '_')}`,
      email: `${name.toLowerCase()}@sejukdemo.com`,
      name: name,
      role: role
    });
  };

  const value = {
    currentUser,
    login,
    logout,
    demoLogin // Remove this in production
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};