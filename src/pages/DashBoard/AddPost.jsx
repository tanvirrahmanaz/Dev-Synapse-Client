import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { 
    FaCode, FaPlus, FaTag, FaEdit, FaRocket, 
    FaJsSquare, FaReact, FaNodeJs, FaPython, 
    FaCss3Alt, FaVuejs, FaServer, FaDatabase, FaTimes 
} from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress } from 'react-icons/si';

const AddPost = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, watch, setValue } = useForm();
    const [selectedTags, setSelectedTags] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Popular tags with icons and colors
    const popularTags = [
        { name: 'JavaScript', icon: FaJsSquare, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
        { name: 'React', icon: FaReact, color: 'text-blue-400', bg: 'bg-blue-400/20' },
        { name: 'Node.js', icon: FaNodeJs, color: 'text-green-400', bg: 'bg-green-400/20' },
        { name: 'MongoDB', icon: SiMongodb, color: 'text-green-500', bg: 'bg-green-500/20' },
        { name: 'Python', icon: FaPython, color: 'text-blue-300', bg: 'bg-blue-300/20' },
        { name: 'CSS', icon: FaCss3Alt, color: 'text-blue-500', bg: 'bg-blue-500/20' },
        { name: 'Vue.js', icon: FaVuejs, color: 'text-green-300', bg: 'bg-green-300/20' },
        { name: 'Express', icon: SiExpress, color: 'text-gray-300', bg: 'bg-gray-300/20' },
        { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-400', bg: 'bg-blue-400/20' },
        { name: 'React Native', icon: FaReact, color: 'text-cyan-400', bg: 'bg-cyan-400/20' }
    ];
    
    // ব্যবহারকারীর পোস্ট সংখ্যা এবং ব্যাজ তথ্য আনা হচ্ছে
    const { data: postCountData, isLoading } = useQuery({
        queryKey: ['postCount', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const countRes = await axiosSecure.get(`/posts/count/${user.email}`);
            const userRes = await axiosSecure.get(`/users/${user.email}`);
            return { postCount: countRes.data.count, badge: userRes.data.badge };
        }
    });

    // Enhanced onSubmit function with SweetAlert2 confirmation
    const onSubmit = async (data) => {
        if (selectedTags.length === 0) {
            toast.error('Please select at least one tag!');
            return;
        }
        
        // Show confirmation dialog before submitting
        const result = await Swal.fire({
            title: 'Ready to Publish?',
            html: `
                <div style="text-align: left; margin: 20px 0;">
                    <p style="margin-bottom: 15px; color: #64748b;"><strong>Post Title:</strong> ${data.title}</p>
                    <p style="margin-bottom: 15px; color: #64748b;"><strong>Tags:</strong> ${selectedTags.join(', ')}</p>
                    <p style="color: #64748b;"><strong>Description:</strong> ${data.description.substring(0, 100)}${data.description.length > 100 ? '...' : ''}</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '🚀 Publish Post',
            cancelButtonText: '✏️ Edit More',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            background: '#1f2937',
            color: '#f3f4f6',
            customClass: {
                popup: 'swal-dark-popup',
                title: 'swal-dark-title',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn'
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        setIsSubmitting(true);
        
        const newPost = {
            authorImage: user.photoURL,
            authorName: user.displayName,
            authorEmail: user.email,
            postTitle: data.title,
            postDescription: data.description,
            tags: selectedTags,
            postTime: new Date(),
            upVotedBy: [],
            downVotedBy: [],
            commentsCount: 0
        };
        
        try {
            const res = await axiosSecure.post('/posts', newPost);
            
            if (res.data.insertedId) {
                // Show success animation
                await Swal.fire({
                    title: 'Post Published Successfully! 🎉',
                    html: `
                        <div style="text-align: center; margin: 20px 0;">
                            <div style="font-size: 60px; margin-bottom: 20px;">🚀</div>
                            <p style="color: #10b981; font-size: 18px; margin-bottom: 15px;">Your post is now live!</p>
                            <p style="color: #64748b;">The developer community can now see and interact with your post.</p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'View My Posts',
                    confirmButtonColor: '#10b981',
                    background: '#1f2937',
                    color: '#f3f4f6',
                    timer: 3000,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'swal-dark-popup',
                        title: 'swal-dark-title',
                        confirmButton: 'swal-confirm-btn'
                    }
                });
                
                // Reset form and navigate
                reset();
                setSelectedTags([]);
                navigate('/dashboard/my-posts');
            }
        } catch (error) {
            // Show error alert
            await Swal.fire({
                title: 'Failed to Publish Post',
                html: `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="font-size: 60px; margin-bottom: 20px;">😔</div>
                        <p style="color: #ef4444; font-size: 18px; margin-bottom: 15px;">Something went wrong!</p>
                        <p style="color: #64748b;">Please try again. If the problem persists, contact support.</p>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#ef4444',
                background: '#1f2937',
                color: '#f3f4f6',
                customClass: {
                    popup: 'swal-dark-popup',
                    title: 'swal-dark-title',
                    confirmButton: 'swal-confirm-btn'
                }
            });
            
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTagSelect = (tagName) => {
        if (selectedTags.includes(tagName)) {
            // Remove tag if already selected
            setSelectedTags(selectedTags.filter(tag => tag !== tagName));
        } else {
            // Add tag if not selected (max 5 tags)
            if (selectedTags.length < 5) {
                setSelectedTags([...selectedTags, tagName]);
            } else {
                toast.error('Maximum 5 tags allowed!');
            }
        }
    };

    const removeTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };
    
    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="loading loading-spinner loading-lg text-green-400"></div>
        </div>
    );
    
    const canPost = postCountData?.badge === 'Gold' || postCountData?.postCount < 5;

    return (
        <>
            {/* Custom CSS for SweetAlert2 dark theme */}
            <style jsx global>{`
                .swal-dark-popup {
                    background: #1f2937 !important;
                    border: 1px solid #374151 !important;
                }
                .swal-dark-title {
                    color: #f3f4f6 !important;
                }
                .swal-confirm-btn {
                    background: linear-gradient(to right, #10b981, #3b82f6) !important;
                    border: none !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    padding: 12px 24px !important;
                    transition: all 0.3s ease !important;
                }
                .swal-confirm-btn:hover {
                    background: linear-gradient(to right, #059669, #2563eb) !important;
                    transform: translateY(-2px) !important;
                }
                .swal-cancel-btn {
                    background: #6b7280 !important;
                    border: none !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    padding: 12px 24px !important;
                    transition: all 0.3s ease !important;
                }
                .swal-cancel-btn:hover {
                    background: #4b5563 !important;
                    transform: translateY(-2px) !important;
                }
                .swal2-progress-bar {
                    background: linear-gradient(to right, #10b981, #3b82f6) !important;
                }
            `}</style>
            
            <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FaCode className="text-green-400 text-2xl" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Create New Post
                        </h1>
                    </div>
                    <p className="text-gray-400">Share your knowledge with the developer community</p>
                </div>

                {canPost ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Post Title */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaEdit className="text-green-400" />
                                        <label className="text-lg font-semibold text-gray-200">Post Title</label>
                                    </div>
                                    <input 
                                        {...register('title', {required: true})} 
                                        type="text" 
                                        placeholder="Enter an engaging title for your post..."
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {/* Post Description */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaCode className="text-green-400" />
                                        <label className="text-lg font-semibold text-gray-200">Post Description</label>
                                    </div>
                                    <textarea 
                                        {...register('description', {required: true})} 
                                        rows="8"
                                        placeholder="Share your knowledge, code snippets, tutorials, or ask questions..."
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 resize-vertical"
                                    ></textarea>
                                </div>

                                {/* Tag Selection */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaTag className="text-green-400" />
                                        <label className="text-lg font-semibold text-gray-200">
                                            Select Tags 
                                            <span className="text-sm text-gray-400 ml-2">
                                                (Max 5 tags, {selectedTags.length}/5 selected)
                                            </span>
                                        </label>
                                    </div>
                                    
                                    {/* Selected Tags Display */}
                                    {selectedTags.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-300 mb-2">Selected Tags:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedTags.map((tag) => {
                                                    const tagData = popularTags.find(t => t.name === tag);
                                                    const IconComponent = tagData?.icon || FaTag;
                                                    return (
                                                        <span 
                                                            key={tag}
                                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${tagData?.bg} ${tagData?.color} border border-current`}
                                                        >
                                                            <IconComponent className="text-xs" />
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTag(tag)}
                                                                className="ml-1 text-xs hover:text-red-400 transition-colors"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Tag Selection Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {popularTags.map((tag) => {
                                            const IconComponent = tag.icon;
                                            const isSelected = selectedTags.includes(tag.name);
                                            const isDisabled = selectedTags.length >= 5 && !isSelected;
                                            
                                            return (
                                                <button
                                                    key={tag.name}
                                                    type="button"
                                                    onClick={() => handleTagSelect(tag.name)}
                                                    disabled={isDisabled}
                                                    className={`flex items-center gap-2 px-4 py-3 rounded-md border transition-all duration-200 ${
                                                        isSelected
                                                            ? `${tag.bg} ${tag.color} border-current shadow-md`
                                                            : isDisabled
                                                            ? 'bg-gray-700/50 border-gray-600 text-gray-500 cursor-not-allowed'
                                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
                                                    }`}
                                                >
                                                    <IconComponent className="text-sm" />
                                                    <span className="text-sm font-medium">{tag.name}</span>
                                                    {isSelected && (
                                                        <span className="ml-auto text-xs">✓</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Selection Info */}
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <span className="text-gray-400">
                                            Click to select/deselect tags
                                        </span>
                                        <span className={`font-medium ${
                                            selectedTags.length === 0 ? 'text-red-400' : 'text-green-400'
                                        }`}>
                                            {selectedTags.length === 0 ? 'No tags selected' : `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`}
                                        </span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    disabled={selectedTags.length === 0 || isSubmitting}
                                    className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                                        selectedTags.length === 0 || isSubmitting
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white hover:scale-105'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <FaRocket className="text-lg" />
                                            {selectedTags.length === 0 ? 'Select Tags to Continue' : 'Publish Post'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Post Limit Info */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-200 mb-4">Post Limit</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Posts Created:</span>
                                        <span className="text-green-400 font-semibold">{postCountData?.postCount || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Limit:</span>
                                        <span className="text-blue-400 font-semibold">
                                            {postCountData?.badge === 'Gold' ? 'Unlimited' : '5'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Badge:</span>
                                        <span className={`font-semibold ${
                                            postCountData?.badge === 'Gold' ? 'text-yellow-400' : 'text-gray-400'
                                        }`}>
                                            {postCountData?.badge || 'Bronze'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tag Selection Tips */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-200 mb-4">Tag Selection Tips</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li>• Select 1-5 relevant tags</li>
                                    <li>• Choose specific technologies used</li>
                                    <li>• Tags help others find your post</li>
                                    <li>• More tags = better visibility</li>
                                    <li>• Click selected tags to remove them</li>
                                </ul>
                            </div>

                            {/* Popular Tags Info */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-200 mb-4">Popular Tags</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {popularTags.slice(0, 6).map((tag) => {
                                        const IconComponent = tag.icon;
                                        return (
                                            <div key={tag.name} className={`flex items-center gap-2 px-2 py-1 rounded ${tag.bg}`}>
                                                <IconComponent className={`text-xs ${tag.color}`} />
                                                <span className="text-xs text-gray-300">{tag.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-8 text-center">
                            <div className="mb-6">
                                <FaRocket className="text-5xl text-yellow-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Post Limit Reached!</h3>
                                <p className="text-gray-300">You've reached your posting limit. Upgrade to Gold membership for unlimited posts!</p>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-200 mb-2">Gold Membership Benefits:</h4>
                                    <ul className="text-sm text-gray-400 space-y-1">
                                        <li>• Unlimited post creation</li>
                                        <li>• Priority support</li>
                                        <li>• Advanced features</li>
                                        <li>• Community recognition</li>
                                    </ul>
                                </div>
                                <button 
                                    onClick={() => navigate('/membership')} 
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                                >
                                    <FaRocket />
                                    Upgrade to Gold
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AddPost;