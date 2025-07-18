import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaCode, FaTerminal, FaHeart, FaCoffee, FaRocket } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-green-500/20">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* Column 1: Brand & Description */}
                    <div className="space-y-4 md:col-span-2">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <FaTerminal className="h-10 w-10 text-green-500 group-hover:text-green-400 transition-colors" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <span className="font-bold text-2xl bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                                    DevForum
                                </span>
                                <p className="text-green-400 font-mono text-sm">&gt; Knowledge Hub</p>
                            </div>
                        </Link>
                        
                        <div className="bg-gray-800 rounded-lg p-4 border border-green-500/20">
                            <p className="text-gray-300 leading-relaxed font-mono text-sm">
                                <span className="text-green-400"># </span>
                                The ultimate platform for developers to connect, share knowledge, and grow together. 
                                Join our community of passionate coders!
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm font-mono">
                            <div className="flex items-center gap-2 text-green-400">
                                <FaCode className="text-green-500" />
                                <span>10k+ Developers</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <FaRocket className="text-green-500" />
                                <span>24/7 Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-green-400 tracking-wider uppercase font-mono flex items-center gap-2">
                            <span className="text-green-500">&gt;</span>
                            Quick Links
                        </h3>
                        <div className="bg-gray-800 rounded-lg p-4 border border-green-500/10">
                            <ul className="space-y-3 font-mono text-sm">
                                <li>
                                    <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2">
                                        <span className="text-green-500">→</span>
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2">
                                        <span className="text-green-500">→</span>
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2">
                                        <span className="text-green-500">→</span>
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2">
                                        <span className="text-green-500">→</span>
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/announcements" className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2">
                                        <span className="text-green-500">→</span>
                                        Announcements
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: Social Media & Community */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-green-400 tracking-wider uppercase font-mono flex items-center gap-2">
                            <span className="text-green-500">&gt;</span>
                            Connect
                        </h3>
                        <div className="bg-gray-800 rounded-lg p-4 border border-green-500/10">
                            <div className="grid grid-cols-2 gap-3">
                                <a 
                                    href="#" 
                                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors p-2 rounded hover:bg-gray-700"
                                >
                                    <FaFacebook className="h-5 w-5" />
                                    <span className="font-mono text-sm">Facebook</span>
                                </a>
                                <a 
                                    href="#" 
                                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors p-2 rounded hover:bg-gray-700"
                                >
                                    <FaTwitter className="h-5 w-5" />
                                    <span className="font-mono text-sm">Twitter</span>
                                </a>
                                <a 
                                    href="#" 
                                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors p-2 rounded hover:bg-gray-700"
                                >
                                    <FaLinkedin className="h-5 w-5" />
                                    <span className="font-mono text-sm">LinkedIn</span>
                                </a>
                                <a 
                                    href="#" 
                                    className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors p-2 rounded hover:bg-gray-700"
                                >
                                    <FaGithub className="h-5 w-5" />
                                    <span className="font-mono text-sm">GitHub</span>
                                </a>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-gray-800 rounded-lg p-4 border border-green-500/10">
                            <p className="text-gray-300 font-mono text-sm mb-3">
                                <span className="text-green-400"># </span>
                                Stay updated
                            </p>
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    className="flex-1 bg-gray-900 border border-green-500/20 rounded-l px-3 py-2 text-sm font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
                                />
                                <button className="bg-green-500 hover:bg-green-600 text-gray-900 px-4 py-2 rounded-r font-mono text-sm transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-green-500/20 bg-gray-800">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        
                        {/* Copyright */}
                        <div className="text-center md:text-left">
                            <p className="text-gray-400 font-mono text-sm">
                                <span className="text-green-500">© </span>
                                {new Date().getFullYear()} DevForum. All Rights Reserved.
                            </p>
                            <p className="text-gray-500 font-mono text-xs mt-1">
                                Version 1.0.0 • Built with React & Node.js
                            </p>
                        </div>

                        {/* Fun Developer Quote */}
                        <div className="text-center">
                            <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
                                Made with 
                                <FaHeart className="text-red-500 animate-pulse" />
                                and 
                                <FaCoffee className="text-yellow-600" />
                                by developers, for developers
                            </p>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-2 text-sm font-mono">
                            <div className="flex items-center gap-2 text-green-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Server Status: Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terminal-style bottom bar */}
            <div className="bg-gray-900 border-t border-green-500/30 py-2">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center text-green-400 font-mono text-xs">
                        <span className="text-green-500">&gt; </span>
                        Thank you for being part of our developer community!
                        <span className="text-green-500"> &lt;</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;