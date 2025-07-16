import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
    FaUser, FaPlusCircle, FaList, FaHome, 
    FaUserShield, FaUsers, FaFlag, FaBullhorn 
} from 'react-icons/fa';
import { AuthContext } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';

const DashboardLayout = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    // Fetches the user's role from the database to determine if they are an admin
    const { data: dbUser, isLoading: isAdminLoading } = useQuery({
        queryKey: ['dbUserForLayout', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/users/${user.email}`)).data
    });

    const isAdmin = dbUser?.role === 'admin';

    // Helper for NavLink styling
    const navLinkClass = ({ isActive }) => 
        `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
        }`;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
                <div className="text-center mb-8">
                    <img 
                        src={user?.photoURL} 
                        alt="profile" 
                        className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-green-200" 
                    />
                    <h3 className="text-xl font-semibold text-gray-800">{user?.displayName}</h3>
                </div>

                <ul className="space-y-2 flex-grow">
                    {/* Conditional Rendering based on user role */}
                    { isAdminLoading || loading ? (
                        <div className="text-center pt-10"><span className="loading loading-dots loading-md"></span></div>
                    ) : isAdmin ? (
                        <>
                            {/* === Admin Menu Links === */}
                            <li><NavLink to="/dashboard/admin-profile" className={navLinkClass}><FaUserShield /> Admin Profile</NavLink></li>
                            <li><NavLink to="/dashboard/manage-users" className={navLinkClass}><FaUsers /> Manage Users</NavLink></li>
                            <li><NavLink to="/dashboard/reported-comments" className={navLinkClass}><FaFlag /> Reported Activities</NavLink></li>
                            <li><NavLink to="/dashboard/make-announcement" className={navLinkClass}><FaBullhorn /> Make Announcement</NavLink></li>
                        </>
                    ) : (
                        <>
                            {/* === Regular User Menu Links === */}
                            <li><NavLink to="/dashboard/my-profile" className={navLinkClass}><FaUser /> My Profile</NavLink></li>
                            <li><NavLink to="/dashboard/add-post" className={navLinkClass}><FaPlusCircle /> Add Post</NavLink></li>
                            <li><NavLink to="/dashboard/my-posts" className={navLinkClass}><FaList /> My Posts</NavLink></li>
                        </>
                    )}
                </ul>

                {/* Common Links for all users */}
                <div>
                    <div className="divider my-2"></div>
                    <ul className="space-y-2">
                        <li>
                             <NavLink to="/" className={navLinkClass}>
                               <FaHome /> Home
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 lg:p-10">
                <Outlet /> {/* Child routes will render here */}
            </main>
        </div>
    );
};

export default DashboardLayout;