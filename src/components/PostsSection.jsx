import React from 'react';
import PostCard from './PostCard';

const PostsSection = ({ posts, isLoading, totalPosts, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalPosts / 5);

    if (isLoading) {
        return (
            <div className="text-center my-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
                <p className="mt-4 text-gray-400">Loading posts...</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center my-10 py-12 bg-gray-800 border border-green-500/20 rounded-lg">
                <div className="text-6xl text-gray-600 mb-4">📝</div>
                <p className="text-xl text-gray-400 mb-2">No posts found</p>
                <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {posts.map(post => <PostCard key={post._id} post={post} />)}
            </div>

            {/* Pagination Controls with Dark Theme */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2 bg-gray-800 border border-green-500/20 rounded-lg p-2">
                        {/* Previous Button */}
                        {currentPage > 1 && (
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-green-400 hover:text-white rounded-lg transition-colors font-medium"
                            >
                                Previous
                            </button>
                        )}

                        {/* Page Numbers */}
                        <div className="flex space-x-1">
                            {[...Array(totalPages).keys()].map(page => {
                                const pageNumber = page + 1;
                                const isCurrentPage = currentPage === pageNumber;
                                
                                return (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(pageNumber)}
                                        className={`min-w-[40px] h-10 px-3 py-2 rounded-lg font-medium transition-all ${
                                            isCurrentPage
                                                ? 'bg-green-600 text-white shadow-lg border border-green-500'
                                                : 'bg-gray-700 hover:bg-gray-600 text-green-400 hover:text-white border border-gray-600'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        {currentPage < totalPages && (
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-green-400 hover:text-white rounded-lg transition-colors font-medium"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Posts Info */}
            <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                    Showing {posts.length} of {totalPosts} posts
                    {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
                </p>
            </div>
        </div>
    );
};

export default PostsSection;