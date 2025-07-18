import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBell, FaBars, FaTimes, FaTerminal, FaCode } from 'react-icons/fa';
import Avatar from './Avatar';
import { AuthContext } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useAxiosPublic from '../hooks/useAxiosPublic';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // অ্যানাউন্সমেন্ট সংখ্যা আনার জন্য
    const { data: newAnnouncementCountData } = useQuery({
        queryKey: ['newAnnouncements', user?.email],
        enabled: !!user,
        queryFn: async () => (await axiosSecure.get('/announcements/new-count')).data,
    });
    const newAnnouncementCount = newAnnouncementCountData?.count || 0;

    // ব্যবহারকারীর ভূমিকা আনার জন্য
    const { data: dbUser } = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/users/${user.email}`)).data,
    });
    
    // Click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    // Developer-friendly nav link styles
    const navLinkClass = ({isActive}) => 
        `px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-200 ease-in-out transform hover:scale-105 ${
            isActive 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 shadow-lg shadow-green-500/25' 
                : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50 hover:shadow-md'
        }`;

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo এবং প্রধান মেনু */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="relative">
                                <FaTerminal className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono font-bold text-xl text-green-400 group-hover:text-green-300 transition-colors">
                                    Dev-Synapse
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    &gt; knowledge.share()
                                </span>
                            </div>
                        </Link>
                        
                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-2">
                                <NavLink to="/" className={navLinkClass}>
                                    <span className="text-green-400">&gt;</span> Home
                                </NavLink>
                                <NavLink to="/membership" className={navLinkClass}>
                                    <span className="text-green-400">&gt;</span> Membership
                                </NavLink>
                                {user && (
                                    <>
                                        <NavLink to="/dashboard/add-post" className={navLinkClass}>
                                            <span className="text-green-400">&gt;</span> Add Post
                                        </NavLink>
                                        <NavLink to="/dashboard/my-posts" className={navLinkClass}>
                                            <span className="text-green-400">&gt;</span> My Posts
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ডান অংশ */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Notification Bell - Always Red */}
                        <Link 
                            to="/announcements" 
                            className="relative p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-gray-800/50 transition-all duration-200 group"
                        >
                            <FaBell className="h-5 w-5 group-hover:animate-bounce" />
                            {/* Always show red indicator */}
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            {/* Show count if available */}
                            {newAnnouncementCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white font-mono font-bold ring-2 ring-gray-900">
                                    {newAnnouncementCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setDropdownOpen(!isDropdownOpen)} 
                                    className="flex text-sm rounded-full focus:outline-none ring-2 ring-offset-2 ring-green-400 ring-offset-gray-900 hover:ring-green-300 transition-all duration-200 transform hover:scale-105"
                                >
                                    <Avatar user={user} size="h-9 w-9" />
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-gray-800 border border-gray-700 ring-1 ring-black ring-opacity-5 z-50 backdrop-blur-md">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <div>
                                                    <p className="text-sm font-mono font-semibold text-green-400 truncate">
                                                        {user.displayName || 'Developer'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 font-mono">
                                                        {dbUser?.role || 'user'}@dev-synapse
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <Link 
                                                to={dbUser?.role === 'admin' ? '/dashboard/admin-profile' : '/dashboard/my-profile'} 
                                                onClick={() => setDropdownOpen(false)} 
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-green-400 transition-all duration-200 font-mono"
                                            >
                                                <FaCode className="h-4 w-4" />
                                                <span>&gt; Dashboard</span>
                                            </Link>
                                            
                                            {dbUser?.role !== 'admin' && (
                                                <Link 
                                                    to="/dashboard/my-posts" 
                                                    onClick={() => setDropdownOpen(false)} 
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-green-400 transition-all duration-200 font-mono"
                                                >
                                                    <FaCode className="h-4 w-4" />
                                                    <span>&gt; My Posts</span>
                                                </Link>
                                            )}
                                            
                                            <button 
                                                onClick={() => { logOut(); setDropdownOpen(false); }} 
                                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 font-mono"
                                            >
                                                <span className="text-red-400">×</span>
                                                <span>&gt; Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className="relative px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 rounded-lg font-mono font-semibold hover:from-green-400 hover:to-emerald-400 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                            >
                                <span className="relative z-10">&gt; Join US</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            </Link>
                        )}
                    </div>
                    
                    {/* মোবাইল মেনু বাটন */}
                    <div className="flex md:hidden">
                        <button 
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} 
                            className="p-2 rounded-md text-gray-400 hover:text-green-400 hover:bg-gray-800/50 transition-all duration-200"
                        >
                            {isMobileMenuOpen ? 
                                <FaTimes className="h-6 w-6" /> : 
                                <FaBars className="h-6 w-6" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* মোবাইল মেনুর ড্রপডাউন */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink 
                            to="/" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className={({ isActive }) => 
                                `block px-3 py-2 rounded-md text-base font-mono font-medium transition-all duration-200 ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900' 
                                        : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                                }`
                            }
                        >
                            <span className="text-green-400">&gt;</span> Home
                        </NavLink>
                        <NavLink 
                            to="/membership" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className={({ isActive }) => 
                                `block px-3 py-2 rounded-md text-base font-mono font-medium transition-all duration-200 ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900' 
                                        : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                                }`
                            }
                        >
                            <span className="text-green-400">&gt;</span> Membership
                        </NavLink>
                        {user && (
                            <>
                                <NavLink 
                                    to="/dashboard/add-post" 
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className={({ isActive }) => 
                                        `block px-3 py-2 rounded-md text-base font-mono font-medium transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900' 
                                                : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                                        }`
                                    }
                                >
                                    <span className="text-green-400">&gt;</span> Add Post
                                </NavLink>
                                <NavLink 
                                    to="/dashboard/my-posts" 
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className={({ isActive }) => 
                                        `block px-3 py-2 rounded-md text-base font-mono font-medium transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900' 
                                                : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                                        }`
                                    }
                                >
                                    <span className="text-green-400">&gt;</span> My Posts
                                </NavLink>
                            </>
                        )}
                    </div>
                    
                    <div className="border-t border-gray-800 pt-4">
                        {user ? (
                            <div className="px-2">
                                <div className="flex items-center px-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar user={user} size="h-10 w-10" />
                                        <div>
                                            <p className="text-base font-mono font-medium text-green-400">
                                                {user.displayName || 'Developer'}
                                            </p>
                                            <p className="text-xs text-gray-400 font-mono">
                                                {dbUser?.role || 'user'}@dev-synapse
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-3 space-y-1">
                                    <NavLink 
                                        to="/announcements" 
                                        onClick={() => setMobileMenuOpen(false)} 
                                        className="flex items-center justify-between px-3 py-2 rounded-md text-base font-mono font-medium text-gray-300 hover:bg-gray-800/50 hover:text-green-400 transition-all duration-200"
                                    >
                                        <span><span className="text-green-400">&gt;</span> Announcements</span>
                                        {newAnnouncementCount > 0 && (
                                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-mono font-bold px-2 py-1 rounded-full">
                                                {newAnnouncementCount}
                                            </span>
                                        )}
                                    </NavLink>
                                    
                                    <NavLink 
                                        to={dbUser?.role === 'admin' ? '/dashboard/admin-profile' : '/dashboard/my-profile'} 
                                        onClick={() => setMobileMenuOpen(false)} 
                                        className="block px-3 py-2 rounded-md text-base font-mono font-medium text-gray-300 hover:bg-gray-800/50 hover:text-green-400 transition-all duration-200"
                                    >
                                        <span className="text-green-400">&gt;</span> Dashboard
                                    </NavLink>
                                    
                                    {dbUser?.role !== 'admin' && (
                                        <NavLink 
                                            to="/dashboard/my-posts" 
                                            onClick={() => setMobileMenuOpen(false)} 
                                            className="block px-3 py-2 rounded-md text-base font-mono font-medium text-gray-300 hover:bg-gray-800/50 hover:text-green-400 transition-all duration-200"
                                        >
                                            <span className="text-green-400">&gt;</span> My Posts
                                        </NavLink>
                                    )}
                                    
                                    <button 
                                        onClick={() => { logOut(); setMobileMenuOpen(false); }} 
                                        className="w-full text-left block px-3 py-2 rounded-md text-base font-mono font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                                    >
                                        <span className="text-red-400">×</span> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="block mx-3 mb-3 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 rounded-lg font-mono font-semibold text-center hover:from-green-400 hover:to-emerald-400 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25"
                            >
                                &gt; Join US
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;