import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home/Home";
import Membership from "../pages/Membership";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import PostDetails from "../pages/PostDetails";
import DashboardLayout from "../Layout/DashBoardLayout";
import MyProfile from "../pages/DashBoard/MyProfile";
import AddPost from "../pages/DashBoard/AddPost";
import MyPosts from "../pages/DashBoard/MyPosts";
import CommentsPage from "../pages/DashBoard/CommentsPage";
import AdminRoute from './AdminRoute';
import AdminProfile from '../pages/Admin/AdminProfile';
import ManageUsers from '../pages/Admin/ManageUsers';
import MakeAnnouncement from '../pages/Admin/MakeAnnouncement';
import ReportedActivities from '../pages/Admin/ReportedActivities'; // এই নামটি ব্যবহার করা হবে
import AnnouncementsPage from '../pages/AnnouncementsPage';
import ErrorPage from '../pages/ErrorPage'; // ErrorPage কম্পোনেন্টটি এখানে যুক্ত করা

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />, // ErrorPage কম্পোনেন্টটি এখানে যুক্ত করা
    children: [
      { path: "/", element: <Home /> },
      { path: "/membership", element: <PrivateRoute><Membership /></PrivateRoute> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/post/:id", element: <PostDetails /> },
      { path: '/announcements', element: <AnnouncementsPage /> }
    ],
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // User Routes
      { path: 'my-profile', element: <MyProfile /> },
      { path: 'add-post', element: <AddPost /> },
      { path: 'my-posts', element: <MyPosts /> },
      { path: 'comments/:postId', element: <CommentsPage /> },

      // Admin Routes
      { path: 'admin-profile', element: <AdminRoute><AdminProfile /></AdminRoute> },
      // manage-users রুটটি একবারই থাকবে
      { path: 'manage-users', element: <AdminRoute><ManageUsers /></AdminRoute> }, 
      { path: 'make-announcement', element: <AdminRoute><MakeAnnouncement /></AdminRoute> },
      { 
        path: 'reported-comments',
        // এখানে ReportedActivities কম্পোনেন্ট ব্যবহার করা হয়েছে
        element: <AdminRoute><ReportedActivities /></AdminRoute> 
      },
    ]
  }
]);

export default router;