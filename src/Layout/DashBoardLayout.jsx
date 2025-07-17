import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
    FaUser, FaPlusCircle, FaList, FaHome, 
    FaUserShield, FaUsers, FaFlag, FaBullhorn, FaBars,
    FaCode, FaCog, FaChartBar, FaTerminal
} from 'react-icons/fa';
import { AuthContext } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';

const DashboardLayout = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    // ব্যবহারকারীর ভূমিকা আনার জন্য useQuery
    const { data: dbUser, isLoading: isAdminLoading } = useQuery({
        queryKey: ['dbUserForLayout', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/users/${user.email}`)).data
    });

    const isAdmin = dbUser?.role === 'admin';

    // NavLink স্টাইলিং এর জন্য
    const navLinkClass = ({ isActive }) => 
        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
            isActive 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`;

    const sidebarContent = (
        <>
            {/* Profile Section */}
            <div className="text-center mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="relative inline-block">
                    <img 
                        src={user?.photoURL || '/default-avatar.png'} 
                        alt="profile" 
                        className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-green-400 shadow-lg" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-gray-800"></div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{user?.displayName || 'Developer'}</h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
                {dbUser?.badge && (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        dbUser.badge === 'Gold' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600/20 text-gray-400'
                    }`}>
                        {dbUser.badge} Member
                    </span>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-grow">
                {/* User Menu */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 text-gray-400">
                        <FaTerminal className="text-green-400" />
                        <h4 className="text-sm font-semibold uppercase tracking-wide">Dashboard</h4>
                    </div>
                    <ul className="space-y-2">
                        <li>
                            <NavLink to="/dashboard/my-profile" className={navLinkClass}>
                                <FaUser className="text-lg" />
                                <span>My Profile</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/add-post" className={navLinkClass}>
                                <FaPlusCircle className="text-lg" />
                                <span>Add Post</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/my-posts" className={navLinkClass}>
                                <FaList className="text-lg" />
                                <span>My Posts</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                
                {/* Admin Menu */}
                {isAdmin && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3 text-gray-400">
                            <FaUserShield className="text-red-400" />
                            <h4 className="text-sm font-semibold uppercase tracking-wide">Admin Panel</h4>
                        </div>
                        <ul className="space-y-2">
                            <li>
                                <NavLink to="/dashboard/admin-profile" className={navLinkClass}>
                                    <FaUserShield className="text-lg" />
                                    <span>Admin Profile</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/manage-users" className={navLinkClass}>
                                    <FaUsers className="text-lg" />
                                    <span>Manage Users</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/reported-comments" className={navLinkClass}>
                                    <FaFlag className="text-lg" />
                                    <span>Reported Activities</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/make-announcement" className={navLinkClass}>
                                    <FaBullhorn className="text-lg" />
                                    <span>Announcements</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>

            {/* Bottom Navigation */}
            <div className="mt-auto pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                    <FaCode className="text-blue-400" />
                    <h4 className="text-sm font-semibold uppercase tracking-wide">Navigation</h4>
                </div>
                <ul className="space-y-2">
                    <li>
                        <NavLink to="/" className={navLinkClass}>
                            <FaHome className="text-lg" />
                            <span>Home</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Developer Info */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 text-green-400">
                    <FaTerminal className="text-sm" />
                    <span className="text-sm font-mono">Dev-Synapse</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Knowledge Sharing Platform</p>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                
                {/* Main Content */}
                <div className="drawer-content flex flex-col">
                    {/* Mobile Menu Button */}
                    <div className="navbar bg-gray-800 border-b border-gray-700 lg:hidden">
                        <div className="flex-none">
                            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost text-white">
                                <FaBars className="text-xl"/>
                            </label>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-green-400">
                                <FaCode className="text-xl" />
                                <h1 className="text-xl font-bold">Dev-Synapse</h1>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 bg-gray-900">
                        <Outlet />
                    </main>
                </div> 

                {/* Sidebar */}
                <aside className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
                    <div className="w-64 min-h-full bg-gray-800 border-r border-gray-700 flex flex-col">
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                    <FaCode className="text-white text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg">Dev-Synapse</h2>
                                    <p className="text-gray-400 text-xs">Knowledge Hub</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {sidebarContent}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;