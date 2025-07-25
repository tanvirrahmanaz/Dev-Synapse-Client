import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FaUser, FaComment, FaArrowUp, FaArrowDown, FaClock, FaTag, FaSearch, FaFire, FaCode, FaLaptop, FaServer, FaDatabase, FaMobile, FaGlobe, FaHome, FaExclamationCircle, FaJsSquare, FaReact, FaNodeJs, FaPython, FaCss3Alt, FaVuejs } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTypescript } from 'react-icons/si';
import { BiSortDown } from 'react-icons/bi';
import Banner from './Banner';
import PostsSection from '../../components/PostsSection';
import TagsSection from './TagsSection';
import CommunityStats from './CommunityStats';

const Home = () => {
    const [searchTag, setSearchTag] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();


    // সার্ভার থেকে জনপ্রিয় ট্যাগগুলো আনার জন্য useQuery
    const { data: popularTags = [], isLoading: isTagsLoading } = useQuery({
        queryKey: ['popularTags'],
        queryFn: async () => (await axiosPublic.get('/tags/popular')).data
    });

    // ট্যাগ অনুযায়ী আইকন দেখানোর জন্য একটি হেল্পার ফাংশন
    const getTagIcon = (tagName) => {
        const lowerCaseTag = tagName.toLowerCase();
        const iconMap = {
            'javascript': <FaJsSquare />,
            'react': <FaReact />,
            'frontend': <FaReact />,
            'backend': <FaServer />,
            'nodejs': <FaNodeJs />,
            'mongodb': <SiMongodb />,
            'python': <FaPython />,
            'css': <FaCss3Alt />,
            'vue.js': <FaVuejs />,
            'express': <SiExpress />,
            'typescript': <SiTypescript />,
            'react native': <FaReact />
        };
        return iconMap[lowerCaseTag] || <FaTag />; // ডিফল্ট আইকন
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['posts', searchTag, sortBy, currentPage],
        queryFn: async () => {
            const res = await axiosPublic.get(`/posts?tag=${searchTag}&sortBy=${sortBy}&page=${currentPage}&limit=6`);
            return res.data;
        },
        keepPreviousData: true // এটি pagination এর জন্য ভাল
    });

    // যদি কোন পোস্ট না থাকে এবং আমরা প্রথম পেজে নেই, তাহলে প্রথম পেজে যাও
    useEffect(() => {
        if (data && data.posts && data.posts.length === 0 && currentPage > 1) {
            setCurrentPage(1);
        }
    }, [data, currentPage]);

    // এই ফাংশনটিই আমরা TagsSection এ পাঠাব
    const handleSearchByTag = (tag) => {
        setSearchTag(tag);
        setCurrentPage(1); // নতুন সার্চ করলে প্রথম পেজে ফেরত যাও
    };

    const handleSortByPopularity = () => {
        setSortBy('popularity');
        setCurrentPage(1);
    };

    const handleGoToFirstPage = () => {
        setCurrentPage(1);
        setSearchTag('');
        setSortBy('latest');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCreatePostClick = () => {
        navigate('/dashboard/add-post');
    };

    const handleBrowseCategoriesClick = () => {
        window.scrollTo({ top: 0});
    };

    const handleViewAnnouncementsClick = () => {
        navigate('/announcements');
    };

    // No posts found component
    const NoPostsFound = () => (
        <div className="text-center py-12 bg-gray-800 border border-green-500/20 rounded-lg">
            <FaExclamationCircle className="text-6xl text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No Posts Found</h3>
            <p className="text-gray-500 mb-6">
                {searchTag 
                    ? `No posts found for "${searchTag}" tag.` 
                    : 'No posts available at the moment.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={handleGoToFirstPage}
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                    <FaHome />
                    <span>Go to First Page</span>
                </button>
                {searchTag && (
                    <button
                        onClick={() => {
                            setSearchTag('');
                            setCurrentPage(1);
                        }}
                        className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-green-400 px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        <FaSearch />
                        <span>Clear Filter</span>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-green-400">
            {/* Header/Banner Section with Dark Theme */}
            <div className="bg-gray-800 border-b border-green-500/20">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2 text-green-400">
                            <FaCode className="inline mr-2" />
                            DevForum BD
                        </h1>
                        <p className="text-gray-300">Knowledge sharing community for developers</p>
                    </div>
                    
                    {/* Banner Component */}
                    <Banner onSearch={handleSearchByTag} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Sort Button with Enhanced Design */}
                        <div className="flex flex-wrap items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-2xl font-bold text-green-400">
                                    {searchTag ? `Posts tagged with "${searchTag}"` : 'Latest Posts'}
                                </h2>
                                {searchTag && (
                                    <button
                                        onClick={() => {
                                            setSearchTag('');
                                            setCurrentPage(1);
                                        }}
                                        className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
                                    >
                                        Clear filter
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleSortByPopularity}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all font-medium ${
                                    sortBy === 'popularity' 
                                        ? 'bg-green-600 text-white shadow-lg' 
                                        : 'bg-gray-700 hover:bg-gray-600 text-green-400 hover:text-white'
                                }`}
                            >
                                <FaFire />
                                <span>Sort by Popularity</span>
                                <BiSortDown />
                            </button>
                        </div>

                        {/* TagsSection Component */}
                        <TagsSection onTagClick={handleSearchByTag} />

                        {/* PostsSection Component with Dark Theme Support */}
                        <div className="mt-8">
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                                    <p className="text-gray-400 mt-4">Loading posts...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12 bg-gray-800 border border-red-500/20 rounded-lg">
                                    <FaExclamationCircle className="text-6xl text-red-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-300 mb-2">Error Loading Posts</h3>
                                    <p className="text-gray-500 mb-6">Something went wrong while loading posts.</p>
                                    <button
                                        onClick={handleGoToFirstPage}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : data && data.posts && data.posts.length === 0 ? (
                                <NoPostsFound />
                            ) : (
                                <PostsSection 
                                    posts={data?.posts || []} 
                                    isLoading={isLoading}
                                    totalPosts={data?.totalPosts || 0}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    totalPages={data?.totalPages || 1}
                                />
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Popular Tags */}
                        <div className="bg-gray-800 border border-green-500/20 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                                <FaTag className="mr-2" />
                                Popular Tags
                            </h3>
                            <div className="space-y-4">
                                {popularTags.map((tag, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSearchByTag(tag.name)}
                                        className="flex items-center justify-between w-full p-3 bg-gray-700 hover:bg-green-600 rounded-lg transition-colors group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-green-400 group-hover:text-white transition-colors">
                                                {getTagIcon(tag.name)}
                                            </span>
                                            <span className="text-white font-medium">{tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded-full">
                                            {tag.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Community Stats */}
                       <div className="max-w-7xl mx-auto">
                 <CommunityStats></CommunityStats>
            </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-800 border border-green-500/20 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">Quick Actions</h3>
                            <div className="space-y-4">
                                <button onClick={handleCreatePostClick} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors font-medium">
                                    Create New Post
                                </button>
                                <button onClick={handleBrowseCategoriesClick} className="w-full bg-gray-700 hover:bg-gray-600 text-green-400 py-3 px-4 rounded-lg transition-colors font-medium">
                                    Browse Categories
                                </button>
                                <button onClick={handleViewAnnouncementsClick} className="w-full bg-gray-700 hover:bg-gray-600 text-green-400 py-3 px-4 rounded-lg transition-colors font-medium">
                                    View Announcements
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;