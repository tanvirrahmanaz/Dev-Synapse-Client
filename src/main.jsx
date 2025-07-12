// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // আপনার মূল CSS ফাইল
import { RouterProvider } from "react-router-dom";
import router from './Routes/Routes'; // আমরা এই ফাইলটি একটু পরেই তৈরি করব
import AuthProvider from './providers/AuthProvider'; // আপনার AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider দিয়ে পুরো অ্যাপকে র‍্যাপ করা হয়েছে যাতে সব জায়গায় user তথ্য পাওয়া যায় */}
    <AuthProvider>
      {/* RouterProvider অ্যাপ্লিকেশনে রাউটিং ক্ষমতা যোগ করে */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)