import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaGithub, FaCode } from 'react-icons/fa';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';

const SocialLogin = () => {
    const { googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // ব্যবহারকারীকে লগইনের পর আগের পেজে ফেরত পাঠানোর জন্য
    const from = location.state?.from?.pathname || "/";
    
    // গুগল দিয়ে সাইন ইন হ্যান্ডলার
    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(() => {
                toast.success('Successfully logged in!', {
                    style: {
                        background: '#1f2937',
                        color: '#22c55e',
                        border: '1px solid #22c55e'
                    }
                });
                // সফলভাবে লগইন করার পর ব্যবহারকারীকে তার আগের পেজে বা হোমপেজে পাঠানো হবে
                navigate(from, { replace: true });
            })
            .catch(error => {
                toast.error(error.message, {
                    style: {
                        background: '#1f2937',
                        color: '#ef4444',
                        border: '1px solid #ef4444'
                    }
                });
            });
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
            {/* Header with developer theme */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                    <FaCode className="text-green-500 text-xl mr-2" />
                    <h3 className="text-green-400 font-mono text-lg">
                        {'<'} Developer Access {' />'}
                    </h3>
                </div>
                <p className="text-gray-400 text-sm font-mono">
                    // Join the developer community
                </p>
            </div>

            {/* Divider with terminal style */}
            <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
                <span className="px-4 text-green-400 font-mono text-sm">
                    $ authenticate
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-4">
                {/* Google Login Button */}
                <button 
                    onClick={handleGoogleSignIn} 
                    className="w-full group relative overflow-hidden bg-gray-900 hover:bg-gray-700 border border-gray-600 hover:border-green-500 text-white font-mono py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center">
                        <FaGoogle className="text-green-400 mr-3 group-hover:text-green-300 transition-colors duration-300" />
                        <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                            continue with Google
                        </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </button>

                {/* GitHub Login Button (disabled for now, but styled)
                <button 
                    disabled
                    className="w-full group relative overflow-hidden bg-gray-900 border border-gray-600 text-gray-500 font-mono py-3 px-6 rounded-lg cursor-not-allowed opacity-50"
                >
                    <div className="relative flex items-center justify-center">
                        <FaGithub className="text-gray-500 mr-3" />
                        <span className="text-gray-500">
                            continue with GitHub
                        </span>
                        <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded text-gray-400">
                            coming soon
                        </span>
                    </div>
                </button> */}
            </div>

            {/* Footer with terminal style comment */}
            <div className="mt-6 text-center">
                <p className="text-gray-500 text-xs font-mono">
                    {'/* By continuing, you agree to our Terms & Privacy Policy */'}
                </p>
            </div>
        </div>
    );
};

export default SocialLogin;