// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from './Routes/Routes';
import AuthProvider from './providers/AuthProvider';

// Tanstack Query থেকে প্রয়োজনীয় জিনিস ইম্পোর্ট করুন
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// QueryClient এর একটি নতুন ইনস্ট্যান্স তৈরি করুন
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* QueryClientProvider দিয়ে পুরো অ্যাপকে র‍্যাপ করুন */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)