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
import CommentsPage from "../pages/DashBoard/CommentsPage"; // Importing the CommentsPage component
import AdminRoute from './AdminRoute';
import ManageUsers from '../pages/Admin/ManageUsers';
import AdminProfile from '../pages/Admin/AdminProfile'; // Assuming you have an AdminProfile component
import ReportedComments from '../pages/Admin/ReportedComments'; // Importing the ReportedComments component
import ReportedActivities from '../pages/Admin/ReportedActivities'; // নতুন পেজ ইম্পোর্ট করুন
import AnncouncementsPage from '../pages/AnnouncementsPage'; // Assuming you have an AnnouncementsPage component
import MakeAnnouncement from '../pages/Admin/MakeAnnouncement'; // Importing the MakeAnnouncement component
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
      {
        path: '/announcements',
        element : <AnncouncementsPage />, // Assuming you have an AnnouncementsPage component
      }
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
      },
      {
        path: 'comments/:postId', // <-- এই ডাইনামিক রুটটি যোগ করুন
        element: <CommentsPage />
      },
      // Admin Routes
      { path: 'manage-users', element: <AdminRoute><ManageUsers /></AdminRoute> },
      {
        path: 'admin-profile',
        element: <AdminRoute><AdminProfile /></AdminRoute>
      },
      {
        path: 'manage-users',
        element: <AdminRoute><ManageUsers /></AdminRoute>
      },
      {
        path: 'make-announcement',
        element: <AdminRoute><MakeAnnouncement /></AdminRoute>
      },
      {
        path: 'reported-comments', // অথবা 'reported-activities'
        element: <AdminRoute><ReportedActivities /></AdminRoute>
      },


    ]
  }
]);

export default router;