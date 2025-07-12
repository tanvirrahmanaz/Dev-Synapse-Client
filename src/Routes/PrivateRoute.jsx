// src/Routes/PrivateRoute.jsx

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // ডেটা লোড হওয়ার সময় লোডিং ইন্ডিকেটর দেখানো হচ্ছে
  if (loading) {
    return <div className="text-center my-10"><span className="loading loading-lg"></span></div>;
  }

  // ব্যবহারকারী লগইন করা থাকলে তাকে সেই পেজে যাওয়ার অনুমতি দেওয়া হচ্ছে
  if (user) {
    return children;
  }
  
  // ব্যবহারকারী লগইন করা না থাকলে তাকে লগইন পেজে পাঠিয়ে দেওয়া হচ্ছে
  // state={{from: location}} ব্যবহার করা হয়েছে যাতে লগইন করার পর তাকে আবার আগের পেজেই ফেরত আনা যায়
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;