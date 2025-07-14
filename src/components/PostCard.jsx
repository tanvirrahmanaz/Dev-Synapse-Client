import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaArrowUp, FaClock } from 'react-icons/fa';

const PostCard = ({ post }) => {
    // পোস্ট অবজেক্ট থেকে প্রয়োজনীয় ডেটা destructure করে নেওয়া হচ্ছে
    const { 
        _id,
        authorImage, 
        authorName, 
        postTitle, 
        tags, 
        postTime, 
        commentsCount, // ধরে নেওয়া হচ্ছে এই ডেটাটি আপনার API থেকে আসছে
        upVote,
        downVote 
    } = post;

    // ভোটের পার্থক্য গণনা করা হচ্ছে
    const voteDifference = upVote - downVote;

    // পোস্টের সময়কে সুন্দর ফরম্যাটে দেখানোর জন্য
    const formattedTime = new Date(postTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        // পুরো কার্ডটিকে একটি লিংকে পরিণত করা হয়েছে যা পোস্টের ডিটেইলস পেজে নিয়ে যাবে
        <Link to={`/post/${_id}`} className="block">
            <div className="card card-compact w-full bg-base-100 shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
                <div className="card-body">
                    {/* কার্ডের উপরের অংশ: লেখকের তথ্য */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="avatar">
                            <div className="w-12 rounded-full">
                                <img src={authorImage} alt={`${authorName}'s avatar`} />
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{authorName}</p>
                            <div className='flex items-center gap-1 text-xs text-gray-500'>
                                <FaClock />
                                <span>{formattedTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* কার্ডের মধ্যম অংশ: পোস্টের টাইটেল এবং ট্যাগ */}
                    <h2 className="card-title text-xl font-bold text-gray-900">{postTitle}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <div key={index} className="badge badge-outline border-green-500 text-green-600">
                                #{tag}
                            </div>
                        ))}
                    </div>
                    
                    {/* কার্ডের নিচের অংশ: কমেন্ট এবং ভোটের সংখ্যা */}
                    <div className="card-actions justify-start mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <FaComments className="text-lg" />
                                <span>{commentsCount || 0} Comments</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaArrowUp className="text-lg" />
                                <span>{voteDifference} Votes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard;