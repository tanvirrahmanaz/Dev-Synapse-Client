// src/Routes/Routes.jsx

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home/Home";
import Membership from "../pages/Membership";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import PostDetails from "../pages/PostDetails"; // Assuming you have a PostDetails component
import MyProfile from "../pages/DashBoard/MyProfile";
import AddPost from "../pages/DashBoard/AddPost";
import MyPosts from "../pages/DashBoard/MyPosts";
import DashboardLayout from "../Layout/DashBoardLayout";
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
        element: <PrivateRoute><Membership /></PrivateRoute>, // PrivateRoute ব্যবহার করা হয়েছে যাতে লগইন ছাড়া এই পেজে যাওয়া না যায়
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/post/:id",
        element: <PostDetails />,
      },
    ],
  },


  {
        path: 'dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            {
                path: 'my-profile',
                element: <MyProfile />
            },
            {
                path: 'add-post',
                element: <AddPost />
            },
            {
                path: 'my-posts',
                element: <MyPosts />
            }
        ]
    }
]);

export default router;