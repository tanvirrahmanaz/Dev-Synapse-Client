import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    // থিমের রঙ ব্যবহার করা হচ্ছে
    const colors = {
        background: '#111827', // Gray-900 (Dark background for footer)
        text: '#D1D5DB',       // Gray-300 (Light text for contrast)
        primary: '#22C55E'     // Green-500
    };

    return (
        <footer style={{ backgroundColor: colors.background, color: colors.text }}>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* কলাম ১: লোগো এবং বর্ণনা */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <img className="h-8 w-8" src="/logo.svg" alt="ForumX Logo" />
                            <span className="font-bold text-xl text-white">ForumX</span>
                        </Link>
                        <p className="text-sm">
                            The ultimate platform for developers to connect, share knowledge, and grow together. Join the conversation today!
                        </p>
                    </div>

                    {/* কলাম ২: কুইক লিংকস */}
                    <div className="md:mx-auto">
                        <h3 className="font-semibold text-white tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* কলাম ৩: সোশ্যাল মিডিয়া */}
                    <div className="md:mx-auto">
                        <h3 className="font-semibold text-white tracking-wider uppercase">Follow Us</h3>
                        <div className="flex mt-4 space-x-6">
                            <a href="#" className="hover:text-white"><FaFacebook className="h-6 w-6" /></a>
                            <a href="#" className="hover:text-white"><FaTwitter className="h-6 w-6" /></a>
                            <a href="#" className="hover:text-white"><FaLinkedin className="h-6 w-6" /></a>
                            <a href="#" className="hover:text-white"><FaGithub className="h-6 w-6" /></a>
                        </div>
                    </div>
                </div>

                {/* ফুটারের নিচের অংশ */}
                <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                    <p className="text-base">
                        &copy; {new Date().getFullYear()} ForumX. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;