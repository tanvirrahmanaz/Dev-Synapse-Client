import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBell, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ব্যবহারকারীর জন্য নতুন অ্যানাউন্সমেন্টের সংখ্যা আনার জন্য useQuery
    const { data: newAnnouncementCountData } = useQuery({
        // queryKey তে user.email যোগ করা হয়েছে, যাতে এটি ব্যবহারকারী-ভিত্তিক হয়
        queryKey: ['newAnnouncementCount', user?.email],
        // শুধুমাত্র লগইন করা ব্যবহারকারীর জন্য এই কোয়েরি চলবে
        enabled: !!user, 
        queryFn: async () => (await axiosSecure.get('/announcements/new-count')).data,
    });
    const newAnnouncementCount = newAnnouncementCountData?.count || 0;

    // ব্যবহারকারীর ভূমিকা (role) আনার জন্য useQuery
    const { data: dbUser } = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/users/${user.email}`)).data,
    });

    // ড্রপডাউনের বাইরে ক্লিক করলে সেটি বন্ধ করার জন্য useEffect
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const navLinkClass = ({isActive}) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-700 hover:bg-gray-200'}`;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* বাম ও মধ্যম অংশ */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <img className="h-8 w-8" src="/logo.svg" alt="Dev-Synapse Logo" />
                            <span className="font-bold text-xl text-gray-800">Dev-Synapse</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/" className={navLinkClass}>Home</NavLink>
                                <NavLink to="/membership" className={navLinkClass}>Membership</NavLink>
                            </div>
                        </div>
                    </div>

                    {/* ডান অংশ */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/announcements" className="relative p-1 rounded-full text-gray-600 hover:text-gray-800">
                            <FaBell className="h-6 w-6" />
                            {newAnnouncementCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white ring-2 ring-white">
                                    {newAnnouncementCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex text-sm rounded-full focus:outline-none ring-2 ring-offset-2 ring-green-400">
                                    {user.photoURL ? <img className="h-9 w-9 rounded-full object-cover" src={user.photoURL} alt="Profile" /> : <FaUserCircle className="h-9 w-9 text-gray-500" />}
                                </button>
                                {isDropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="px-4 py-3 border-b"><p className="text-sm font-semibold text-gray-900 truncate">{user.displayName}</p></div>
                                        <Link to={dbUser?.role === 'admin' ? '/dashboard/admin-profile' : '/dashboard/my-profile'} onClick={() => setDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                                        <button onClick={() => { logOut(); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm bg-green-500 text-white hover:bg-green-600 border-none">Join US</Link>
                        )}
                    </div>
                    {/* মোবাইল মেনু বাটন */}
                    <div className="flex md:hidden">
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-700"><FaTimes className={`h-6 w-6 transform transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} /></button>
                    </div>
                </div>
            </div>
            {/* মোবাইল মেনু ড্রপডাউন */}
            {isMobileMenuOpen && ( <div className="md:hidden pb-4">{/*...*/}</div> )}
        </nav>
    );
};
export default Navbar;