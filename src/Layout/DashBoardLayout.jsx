import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaUser, FaPlusCircle, FaList } from 'react-icons/fa'; // আইকন
import { AuthContext } from '../providers/AuthProvider';
import { useContext } from 'react';

const DashboardLayout = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* সাইডবার */}
            <aside className="w-64 bg-white shadow-md p-4">
                <div className="text-center mb-8">
                    <img src={user?.photoURL} alt="profile" className="w-24 h-24 rounded-full mx-auto mb-2" />
                    <h3 className="text-xl font-semibold">{user?.displayName}</h3>
                </div>
                <ul className="space-y-2">
                    <li>
                        <NavLink to="/dashboard/my-profile" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`}>
                            <FaUser /> My Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/add-post" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`}>
                            <FaPlusCircle /> Add Post
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/my-posts" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`}>
                            <FaList /> My Posts
                        </NavLink>
                    </li>
                    <div className="divider"></div>
                    {/* হোম পেজে ফেরার লিংক */}
                    <li>
                         <NavLink to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200">
                           Home
                        </NavLink>
                    </li>
                </ul>
            </aside>

            {/* মূল কন্টেন্ট */}
            <main className="flex-1 p-8">
                <Outlet /> {/* এখানে চাইল্ড রুটগুলো রেন্ডার হবে */}
            </main>
        </div>
    );
};

export default DashboardLayout;