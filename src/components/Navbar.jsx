import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBell, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../providers/AuthProvider'; // সঠিক পাথ দিন

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // থিমের রঙগুলো ভ্যারিয়েবলে রাখা হয়েছে
  const colors = {
    primary: '#22C55E', // Green-500
    background: '#F9FAFB', // Gray-50
    text: '#111827', // Gray-900
    accent: '#10B981', // Emerald-500
  };

  // NavLink এর জন্য স্টাইল অবজেক্ট
  const navLinkStyles = ({ isActive }) => {
    return {
      color: isActive ? colors.primary : colors.text,
      fontWeight: isActive ? 'bold' : 'normal',
    };
  };

  return (
    <nav style={{ backgroundColor: colors.background }} className="shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* বাম অংশ: লোগো এবং নাম */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img className="h-8 w-8" src="/logo.svg" alt="ForumX Logo" />
              <span className="font-bold text-xl" style={{ color: colors.text }}>ForumX</span>
            </Link>
          </div>

          {/* মধ্যম অংশ: ডেস্কটপ মেনু */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <NavLink to="/" style={navLinkStyles}>Home</NavLink>
              <NavLink to="/membership" style={navLinkStyles}>Membership</NavLink>
            </div>
          </div>

          {/* ডান অংশ: নোটিফিকেশন ও প্রোফাইল */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-1 rounded-full" style={{color: colors.text}}>
              <FaBell className="h-6 w-6" />
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!isDropdownOpen)}>
                  <img className="h-9 w-9 rounded-full object-cover" src={user.photoURL} alt="Profile" />
                </button>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-sm font-semibold border-b" style={{color: colors.text}}>
                      {user.displayName}
                    </div>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100" style={{color: colors.text}}>
                      Dashboard
                    </Link>
                    <button onClick={logOut} className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100" style={{color: colors.text}}>
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
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md" style={{color: colors.text}}>
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* মোবাইল মেনুর ড্রপডাউন */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className="block px-3 py-2 rounded-md text-base font-medium" style={navLinkStyles}>Home</NavLink>
            <NavLink to="/membership" className="block px-3 py-2 rounded-md text-base font-medium" style={navLinkStyles}>Membership</NavLink>
            {/* মোবাইল মেনুতেও লগইন/লগআউট বাটন */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;