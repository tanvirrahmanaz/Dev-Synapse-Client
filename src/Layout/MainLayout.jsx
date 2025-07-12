// src/Layout/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Navbar কম্পোনেন্ট
import Footer from '../components/Footer'; // Footer কম্পোনেন্ট (যদি থাকে)

const MainLayout = () => {
  return (
    <div>
      <Navbar /> {/* এই Navbar সব পেজে দেখা যাবে */}
      <div className="min-h-[calc(100vh-100px)]">
        <Outlet /> {/* এখানে আপনার মূল পেজের কন্টেন্ট রেন্ডার হবে */}
      </div>
      <Footer /> {/* এই Footer সব পেজে দেখা যাবে */}
    </div>
  );
};

export default MainLayout;