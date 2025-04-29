import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner"


// This is a mock implementation - in a real app, you'd connect to a backend
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // Simulating loading user from storage
  useEffect(() => {
    const storedUser = localStorage.getItem('campus_events_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('campus_events_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Mock API call - in a real app, this would be a fetch call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login logic
      if (email === 'admin@example.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          avatar: 'https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        };
        setUser(userData);
        localStorage.setItem('campus_events_user', JSON.stringify(userData));
        toast({
          title: 'Login Successful',
          description: 'Welcome back, Admin!',
        });
      } else if (email === 'club@example.com' && password === 'password') {
        const userData = {
          id: '2',
          name: 'Tech Club',
          email: 'club@example.com',
          role: 'club',
          department: 'Computer Science',
          avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        };
        setUser(userData);
        localStorage.setItem('campus_events_user', JSON.stringify(userData));
        toast({
          title: 'Login Successful',
          description: 'Welcome back, Tech Club!',
        });
      } else if (email === 'student@example.com' && password === 'password') {
        const userData = {
          id: '3',
          name: 'John Student',
          email: 'student@example.com',
          role: 'student',
          department: 'Computer Science',
          year: 2,
          avatar: 'https://images.pexels.com/photos/5212361/pexels-photo-5212361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        };
        setUser(userData);
        localStorage.setItem('campus_events_user', JSON.stringify(userData));
        toast({
          title: 'Login Successful',
          description: 'Welcome back, John!',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      console.error('Login error', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };


  const register = async (userData) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll allow registration but with a mock response
      const newUser = {
        id: '4',
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        year: userData.year,
        avatar: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      };
      
      setUser(newUser);
      localStorage.setItem('campus_events_user', JSON.stringify(newUser));
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully!',
      });
    } catch (error) {
      console.error('Registration error', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campus_events_user');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
