import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import BiddingItemsPage from './pages/BiddingItems';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/bidding-items" element={<BiddingItemsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
