import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AuthLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;