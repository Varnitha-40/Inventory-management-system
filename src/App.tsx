import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot/Chatbot';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import ViewInventoryPage from './pages/ViewInventoryPage';
import PredictDemandPage from './pages/PredictDemandPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-primary text-white"
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="add-product" element={<AddProductPage />} />
              <Route path="inventory" element={<ViewInventoryPage />} />
              <Route path="predict" element={<PredictDemandPage />} />
            </Route>
          </Routes>
          <Chatbot />
        </motion.div>
      </Router>
    </AuthProvider>
  );
}

export default App;