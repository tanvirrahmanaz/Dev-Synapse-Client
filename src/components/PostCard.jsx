import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaArrowUp, FaClock } from 'react-icons/fa';
import Avatar from './Avatar';

const PostCard = ({ post }) => {
    // পোস্ট অবজেক্ট থেকে প্রয়োজনীয় ডেটা destructure করে নেওয়া হচ্ছে
    const { 
        _id,
        authorImage, 
        authorName, 
        postTitle, 
        tags, 
        postTime, 
        commentsCount, // ধরে নেওয়া হচ্ছে এই ডেটাটি আপনার API থেকে আসছে
        upVote,
        downVote 
    } = post;

    // ভোটের পার্থক্য গণনা করা হচ্ছে
    const voteDifference = upVote - downVote;

    // পোস্টের সময়কে সুন্দর ফরম্যাটে দেখানোর জন্য
    const formattedTime = new Date(postTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        // পুরো কার্ডটিকে একটি লিংকে পরিণত করা হয়েছে যা পোস্টের ডিটেইলস পেজে নিয়ে যাবে
        <Link to={`/post/${_id}`} className="block">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-green-500/20 h-full w-full flex flex-col">
                {/* কার্ডের উপরের অংশ: লেখকের তথ্য */}
                <div className="flex items-center gap-3 mb-4">
                    <Avatar user={{ photoURL: authorImage, displayName: authorName }} size="h-12 w-12" />
                    <div>
                        <p className="font-semibold text-green-400">{authorName}</p>
                        <div className='flex items-center gap-1 text-xs text-gray-400'>
                            <FaClock className="text-green-500" />
                            <span>{formattedTime}</span>
                        </div>
                    </div>
                </div>

                {/* কার্ডের মধ্যম অংশ: পোস্টের টাইটেল এবং ট্যাগ */}
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-white mb-3 hover:text-green-400 transition-colors duration-200">
                        {postTitle}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                            <span 
                                key={index} 
                                className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm font-mono hover:bg-green-500/30 transition-colors duration-200"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                {/* কার্ডের নিচের অংশ: কমেন্ট এবং ভোটের সংখ্যা */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors duration-200">
                        <FaComments className="text-lg" />
                        <span className="font-mono">{commentsCount || 0} Comments</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors duration-200">
                        <FaArrowUp className="text-lg" />
                        <span className="font-mono">{voteDifference} Votes</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard;