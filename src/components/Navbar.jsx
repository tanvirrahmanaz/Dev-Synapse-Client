import React, { useState, useContext } from 'react';
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

  // User's role query (to determine dashboard link)
  const { data: dbUser } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get(`/users/${user.email}`)).data,
  });

  const navLinkClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeNavLinkClass = "bg-green-100 text-green-700";
  const inactiveNavLinkClass = "text-gray-700 hover:bg-gray-200";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            {/* Logo and Name */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <img className="h-8 w-8" src="/logo.svg" alt="Dev-Synapse Logo" />
                <span className="font-bold text-xl text-gray-800">Dev-Synapse</span>
              </Link>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={({isActive}) => `${navLinkClass} ${isActive ? activeNavLinkClass : inactiveNavLinkClass}`}>Home</NavLink>
                <NavLink to="/membership" className={({isActive}) => `${navLinkClass} ${isActive ? activeNavLinkClass : inactiveNavLinkClass}`}>Membership</NavLink>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Simple Notification Icon */}
            <button className="p-1 rounded-full text-gray-600 hover:text-gray-800">
              <FaBell className="h-6 w-6" />
            </button>

            {/* Profile or Join Us Button */}
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex text-sm rounded-full focus:outline-none ring-2 ring-offset-2 ring-green-400">
                  {user.photoURL ? <img className="h-9 w-9 rounded-full object-cover" src={user.photoURL} alt="Profile" /> : <FaUserCircle className="h-9 w-9 text-gray-500" />}
                </button>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-900">{user.displayName}</p>
                    </div>
                    <Link to={dbUser?.role === 'admin' ? '/dashboard/admin-profile' : '/dashboard/my-profile'} onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <button onClick={() => { logOut(); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm bg-green-500 text-white hover:bg-green-600 border-none">
                Join US
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-700">
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `block ${navLinkClass} ${isActive ? activeNavLinkClass : inactiveNavLinkClass}`}>Home</NavLink>
            <NavLink to="/membership" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `block ${navLinkClass} ${isActive ? activeNavLinkClass : inactiveNavLinkClass}`}>Membership</NavLink>
          </div>
          <div className="border-t border-gray-200 pt-4">
            {user ? (
              // Logged in user section for mobile
               <div className="px-2">
                 <div className="flex items-center px-3 mb-3">
                    {user.photoURL ? (
                      <img className="h-10 w-10 rounded-full object-cover" src={user.photoURL} alt="Profile"/>
                    ) : (
                      <FaUserCircle className="h-10 w-10 text-gray-500" />
                    )}
                    <div className="ml-3">
                        <p className="text-base font-medium text-gray-800">{user.displayName}</p>
                    </div>
                </div>
                <div className="mt-3 space-y-1">
                    <NavLink to={dbUser?.role === 'admin' ? '/dashboard/admin-profile' : '/dashboard/my-profile'} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-200">Dashboard</NavLink>
                    <button onClick={() => { logOut(); setMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-200">Logout</button>
                </div>
               </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-200">Join US</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;