import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FaSearch, FaCode, FaTerminal, FaLaptopCode, FaRocket } from 'react-icons/fa';

const Banner = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState('');
    const axiosPublic = useAxiosPublic();

    // সাম্প্রতিক সার্চগুলো আনার জন্য useQuery
    const { data: recentSearches = [] } = useQuery({
        queryKey: ['recent-searches'],
        queryFn: async () => (await axiosPublic.get('/searches/recent')).data
    });

    // নতুন সার্চ লগ করার জন্য useMutation
    const { mutate: logSearch } = useMutation({
        mutationFn: (searchTerm) => axiosPublic.post('/searches', searchTerm)
    });

    const handleSearch = (tag) => {
        if (!tag) return;
        // প্যারেন্ট কম্পোনেন্টে সার্চ টার্ম পাঠাচ্ছে
        onSearch(tag);
        // আমাদের সার্ভারে সার্চ টার্মটি লগ করছে
        logSearch({ term: tag });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const tag = e.target.search.value.toLowerCase().trim();
        handleSearch(tag);
        e.target.reset();
        setSearchValue('');
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className="relative min-h-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden rounded-3xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Code Icons */}
                <div className="absolute top-10 left-10 text-green-500/20 animate-bounce">
                    <FaCode className="text-4xl" />
                </div>
                <div className="absolute top-20 right-20 text-green-400/20 animate-pulse">
                    <FaTerminal className="text-3xl" />
                </div>
                <div className="absolute bottom-20 left-20 text-green-300/20 animate-bounce delay-1000">
                    <FaLaptopCode className="text-5xl" />
                </div>
                <div className="absolute bottom-10 right-10 text-green-500/20 animate-pulse delay-500">
                    <FaRocket className="text-4xl" />
                </div>
                
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-12 gap-4 h-full">
                        {Array.from({ length: 48 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-green-500/20 animate-pulse"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationDuration: '3s'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Matrix Rain Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, index) => (
                    <div
                        key={index}
                        className="absolute text-green-500/30 font-mono text-sm animate-matrix-rain"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 5}s`
                        }}
                    >
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="mb-1">
                                {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-[500px] px-4">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Animated Title */}
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-emerald-400 animate-pulse mb-4">
                            <span className="inline-block animate-fadeInUp">Dev</span>
                            <span className="inline-block animate-fadeInUp delay-200">Synapse</span>
                        </h1>
                        <div className="h-1 w-32 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto animate-expandWidth"></div>
                    </div>

                    {/* Animated Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light animate-fadeInUp delay-500">
                        <span className="text-green-400 font-semibold">Connect</span>, 
                        <span className="text-emerald-400 font-semibold"> Share</span>, and 
                        <span className="text-green-500 font-semibold"> Grow</span> with a community of developers
                    </p>

                    {/* Animated Search Form */}
                    <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto px-4 sm:px-0 mb-8 animate-fadeInUp delay-700">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative flex bg-gray-800 border border-green-500/30 rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300">
                                <div className="flex items-center pl-4 text-green-400">
                                    <FaSearch className="text-lg" />
                                </div>
                                <input
                                    type="text"
                                    name="search"
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    placeholder="Search by tags (e.g., react, nodejs, python)..."
                                    className="flex-1 px-4 py-3 md:py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0 font-mono text-sm md:text-base"
                                />
                                <button 
                                    type="submit" 
                                    className="px-4 py-3 md:px-8 md:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                                >
                                    <span className="hidden md:inline"><FaSearch className="inline mr-2" />Search</span>
                                    <span className="inline md:hidden"><FaSearch /></span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Recent Searches with Animation */}
                    {recentSearches.length > 0 && (
                        <div className="animate-fadeInUp delay-1000">
                            <span className="text-gray-400 mb-4 block">Recent Searches:</span>
                            <div className="flex flex-wrap justify-center gap-3">
                                {recentSearches.map((search, index) => (
                                    <button
                                        key={search._id}
                                        onClick={() => handleSearch(search._id)}
                                        className="group relative px-4 py-2 bg-gray-700/50 border border-green-500/30 rounded-full text-green-400 hover:bg-green-500/20 hover:border-green-500/60 transition-all duration-300 transform hover:scale-105 font-mono text-sm"
                                        style={{
                                            animationDelay: `${index * 0.1}s`
                                        }}
                                    >
                                        <span className="relative z-10">#{search._id}</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 to-emerald-500/0 group-hover:from-green-400/10 group-hover:to-emerald-500/10 rounded-full transition-all duration-300"></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Animated Call to Action */}
                    <div className="mt-12 animate-fadeInUp delay-1200">
                        <div className="inline-flex items-center text-gray-400 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping mr-2"></div>
                            <span className="font-mono">Ready to explore? Start your journey now!</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes matrix-rain {
                    0% { transform: translateY(-100vh); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes expandWidth {
                    from {
                        width: 0;
                    }
                    to {
                        width: 8rem;
                    }
                }
                
                .animate-matrix-rain {
                    animation: matrix-rain linear infinite;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.4s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-expandWidth {
                    animation: expandWidth 1s ease-out 1s forwards;
                    width: 0;
                }
                
                .delay-200 {
                    animation-delay: 0.2s;
                }
                
                .delay-500 {
                    animation-delay: 0.3s;
                }
                
                .delay-700 {
                    animation-delay: 0.5s;
                }
                
                .delay-1000 {
                    animation-delay: 1s;
                }
                
                .delay-1200 {
                    animation-delay: 1.2s;
                }
            `}</style>
        </div>
    );
};

export default Banner;