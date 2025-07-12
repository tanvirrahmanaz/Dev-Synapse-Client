// src/Routes/Routes.jsx

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home";
import Membership from "../pages/Membership";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard"; // Assuming you have a Dashboard component

const router = createBrowserRouter([
  {
    path: "/", // এটি হলো প্যারেন্ট রুট
    element: <MainLayout />, // এই রুটের জন্য লেআউট
    // errorElement: <ErrorPage />, // কোনো ভুল হলে দেখানোর জন্য
    children: [
      // MainLayout এর ভেতরে এই চাইল্ড রুটগুলো রেন্ডার হবে
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/membership",
        element: <PrivateRoute><Dashboard /></PrivateRoute>, // PrivateRoute ব্যবহার করা হয়েছে যাতে লগইন ছাড়া এই পেজে যাওয়া না যায়
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;