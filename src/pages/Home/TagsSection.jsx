import React from 'react';
import { Link } from 'react-router-dom';

const TagsSection = () => {
    // এই ট্যাগগুলো আপনি সার্ভার থেকে আনতে পারেন অথবা হার্ডকোড করতে পারেন
    const tags = ['react', 'javascript', 'nodejs', 'mongodb', 'express', 'css', 'python', 'nextjs'];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">Explore by Tags</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {tags.map(tag => (
                    // প্রতিটি ট্যাগকে একটি লিংকে পরিণত করা হয়েছে যা সার্চ পেজে নিয়ে যাবে
                    // তবে আমরা একই পেজে দেখানোর জন্য Link এর পরিবর্তে বাটন ব্যবহার করতে পারি
                    // এবং হোমে থাকা সার্চ ফাংশনটিকে কল করতে পারি।
                    // কিন্তু এখানে সহজ রাখার জন্য শুধু বাটন দেখানো হলো।
                    // এই বাটনগুলো উপরের Banner কম্পোনেন্টের সার্চ ফাংশনকে ট্রিগার করতে পারে।
                    <button 
                        key={tag}
                        className="btn btn-outline border-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 capitalize"
                        // onClick={() => handleTagClick(tag)} // এই ফাংশনটি Home পেজ থেকে props হিসেবে আসবে
                    >
                        #{tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TagsSection;