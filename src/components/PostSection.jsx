import React from 'react';
import PostCard from './PostCard';

const PostsSection = ({ posts, isLoading, totalPosts, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalPosts / 5);

    if (isLoading) {
        return <div className="text-center my-10"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (posts.length === 0) {
        return <p className="text-center text-gray-500 my-10">No posts found.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => <PostCard key={post._id} post={post} />)}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
                <div className="join">
                    {[...Array(totalPages).keys()].map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page + 1)}
                            className={`join-item btn ${currentPage === page + 1 ? 'btn-active' : ''}`}
                        >
                            {page + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostsSection;