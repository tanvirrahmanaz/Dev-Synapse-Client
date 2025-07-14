import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBell, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'; // FaUserCircle আইকন যোগ করা হয়েছে
import { AuthContext } from '../providers/AuthProvider'; // সঠিক পাথ দিন

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ডিবাগিং এর জন্য: user অবজেক্টটি দেখতে পারেন
  // console.log('User in Navbar:', user);

  // থিমের রঙগুলো ভ্যারিয়েবলে রাখা হয়েছে
  const colors = {
    primary: '#22C55E', // Green-500
    background: '#F9FAFB', // Gray-50
    text: '#111827', // Gray-900
    accent: '#10B981', // Emerald-500
  };

  // NavLink এর জন্য স্টাইল অবজেক্ট
  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? colors.primary : colors.text,
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'color 0.2s',
  });

  return (
    <nav style={{ backgroundColor: colors.background }} className="shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* বাম অংশ: লোগো এবং ওয়েবসাইটের নাম */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img className="h-8 w-8" src="/logo.svg" alt="Dev-Synapse Logo" />
              <span className="font-bold text-xl" style={{ color: colors.text }}>Dev-Synapse</span>
            </Link>
          </div>

          {/* মধ্যম অংশ: ডেস্কটপ মেনু */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" style={navLinkStyles}>Home</NavLink>
            <NavLink to="/membership" style={navLinkStyles}>Membership</NavLink>
          </div>

          {/* ডান অংশ: নোটিফিকেশন ও প্রোফাইল */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-1 rounded-full" style={{color: colors.text}}>
              <FaBell className="h-6 w-6" />
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex text-sm rounded-full focus:outline-none ring-2 ring-offset-2 ring-green-400">
                  {/* প্রোফাইল ছবির জন্য উন্নত লজিক */}
                  {user.photoURL ? (
                    <img className="h-9 w-9 rounded-full object-cover" src={user.photoURL} alt="Profile" />
                  ) : (
                    <FaUserCircle className="h-9 w-9 text-gray-500" /> // ছবি না থাকলে ডিফল্ট আইকন
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold" style={{color: colors.text}}>{user.displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100" style={{color: colors.text}}>
                      Dashboard
                    </Link>
                    <button onClick={() => { logOut(); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100" style={{color: colors.text}}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-white px-4 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: colors.primary }}>
                Join US
              </Link>
            )}
          </div>

          {/* মোবাইল মেনু বাটন */}
          <div className="flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md" style={{color: colors.text}}>
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* মোবাইল মেনুর ড্রপডাউন (উন্নত করা হয়েছে) */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium" style={navLinkStyles}>Home</NavLink>
            <NavLink to="/membership" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium" style={navLinkStyles}>Membership</NavLink>
            
            <div className="border-t border-gray-200 pt-4 mt-2">
            {user ? (
              <>
                <div className="flex items-center px-3 mb-3">
                  {user.photoURL ? (
                    <img className="h-10 w-10 rounded-full object-cover" src={user.photoURL} alt="Profile"/>
                  ) : (
                    <FaUserCircle className="h-10 w-10 text-gray-500" />
                  )}
                  <div className="ml-3">
                    <p className="text-base font-medium" style={{color: colors.text}}>{user.displayName}</p>
                  </div>
                </div>
                <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-200">Dashboard</NavLink>
                <button onClick={() => { logOut(); setMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-200">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-200">Join US</Link>
            )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;