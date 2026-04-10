import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BankingSandbox from './pages/BankingSandbox';
import UpiSimulator from './pages/modules/UpiSimulator';
import NetBankingSimulator from './pages/modules/NetBankingSimulator';
import FraudSimulator from './pages/modules/FraudSimulator';
import OtpSimulator from './pages/modules/OtpSimulator';
import UpiPinSetupSimulator from './pages/modules/UpiPinSetupSimulator';
import IdentitySafety from './pages/IdentitySafety';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/banking" element={<BankingSandbox />} />
          <Route path="/banking/upi" element={<UpiSimulator />} />
          <Route path="/banking/netbanking" element={<NetBankingSimulator />} />
          <Route path="/banking/fraud" element={<FraudSimulator />} />
          <Route path="/banking/otp" element={<OtpSimulator />} />
          <Route path="/banking/upi-setup" element={<UpiPinSetupSimulator />} />
          <Route path="/identity" element={<IdentitySafety />} />
        </Routes>
      </Router>
    </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
