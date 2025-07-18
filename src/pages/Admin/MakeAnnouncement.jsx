import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { 
    FaBullhorn, 
    FaTerminal, 
    FaCode, 
    FaCheckCircle, 
    FaExclamationTriangle, 
    FaUser,
    FaCalendarAlt,
    FaEye,
    FaEdit,
    FaPaperPlane,
    FaSpinner
} from 'react-icons/fa';
import Avatar from '../../components/Avatar';

const MakeAnnouncement = () => {
    // AuthContext থেকে বর্তমান অ্যাডমিনের তথ্য নেওয়া হচ্ছে
    const { user } = useContext(AuthContext);
    
    // react-hook-form থেকে প্রয়োজনীয় ফাংশন নেওয়া হচ্ছে
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    
    // Preview mode এর জন্য স্টেট
    const [previewMode, setPreviewMode] = useState(false);
    
    // নিরাপদ API কলের জন্য কাস্টম হুক
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    
    // Form values watch করার জন্য
    const watchedValues = watch();
    
    // useMutation হুকটি সার্ভারে ডেটা পাঠানোর (POST রিকোয়েস্ট) কাজটি পরিচালনা করে
    const { mutate: publishAnnouncement, isLoading } = useMutation({
        // mutationFn: সার্ভারে কোন কাজটি করা হবে তা নির্ধারণ করে
        mutationFn: (announcement) => axiosSecure.post('/announcements', announcement),
        
        // onSuccess: API কল সফল হলে এই ফাংশনটি রান হয়
        onSuccess: (res) => {
            if (res.data.insertedId) {
                // SweetAlert2 সফল হওয়ার বার্তা
                Swal.fire({
                    title: 'Success!',
                    text: 'Announcement published successfully!',
                    icon: 'success',
                    confirmButtonText: 'Great!',
                    confirmButtonColor: '#10B981',
                    background: '#1F2937',
                    color: '#10B981',
                    timer: 3000,
                    timerProgressBar: true
                });
                
                toast.success('🎉 Announcement published successfully!');
                reset(); // ফর্মটি রিসেট করে দেওয়া হচ্ছে
                setPreviewMode(false); // Preview mode বন্ধ করা
                
                // Navbar-এর নোটিফিকেশন কাউন্ট আপডেট করার জন্য এই কোয়েরিটি invalidate করা হচ্ছে
                queryClient.invalidateQueries({ queryKey: ['announcementCount'] });
                queryClient.invalidateQueries({ queryKey: ['allAnnouncements'] }); // হোমপেজের তালিকাও রিফ্রেশ হবে
            }
        },
        
        // onError: API কল ব্যর্থ হলে এই ফাংশনটি রান হয়
        onError: () => {
            // SweetAlert2 ত্রুটি বার্তা
            Swal.fire({
                title: 'Error!',
                text: 'Failed to publish announcement. Please try again.',
                icon: 'error',
                confirmButtonText: 'Retry',
                confirmButtonColor: '#EF4444',
                background: '#1F2937',
                color: '#EF4444'
            });
            toast.error('❌ Failed to publish announcement.');
        },
    });
    
    // ফর্ম সাবমিট হলে এই ফাংশনটি কল করা হয়
    const onSubmit = (data) => {
        // প্রকাশের আগে নিশ্চিতকরণ
        Swal.fire({
            title: 'Publish Announcement?',
            text: 'Are you sure you want to publish this announcement? All developers will be notified.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Publish!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280',
            background: '#1F2937',
            color: '#10B981',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const announcement = {
                    authorName: user.displayName,
                    authorImage: user.photoURL,
                    title: data.title,
                    description: data.description,
                    timestamp: new Date()
                };
                // useMutation-এর `mutate` ফাংশনকে কল করে সার্ভারে ডেটা পাঠানো হচ্ছে
                publishAnnouncement(announcement);
            }
        });
    };
    
    // ফর্ম রিসেট করার জন্য সতর্কতা
    const handleReset = () => {
        if (watchedValues.title || watchedValues.description) {
            Swal.fire({
                title: 'Clear Form?',
                text: 'All your progress will be lost. Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Clear',
                cancelButtonText: 'Keep Writing',
                confirmButtonColor: '#EF4444',
                cancelButtonColor: '#6B7280',
                background: '#1F2937',
                color: '#EF4444'
            }).then((result) => {
                if (result.isConfirmed) {
                    reset();
                    setPreviewMode(false);
                    Swal.fire({
                        title: 'Cleared!',
                        text: 'Form has been cleared.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        background: '#1F2937',
                        color: '#10B981'
                    });
                }
            });
        }
    };
    
    // Priority level নির্ধারণ
    const getPriorityColor = (title) => {
        const titleLower = title?.toLowerCase() || '';
        if (titleLower.includes('urgent') || titleLower.includes('critical')) {
            return 'text-red-400 border-red-500';
        } else if (titleLower.includes('important') || titleLower.includes('update')) {
            return 'text-yellow-400 border-yellow-500';
        } else {
            return 'text-green-400 border-green-500';
        }
    };
    
    // Priority warning দেখানোর জন্য
    const showPriorityWarning = (title) => {
        const titleLower = title?.toLowerCase() || '';
        if (titleLower.includes('urgent') || titleLower.includes('critical')) {
            Swal.fire({
                title: 'High Priority Alert!',
                text: 'This announcement will be marked as high priority. All developers will receive immediate notifications.',
                icon: 'warning',
                confirmButtonText: 'Understood',
                confirmButtonColor: '#EF4444',
                background: '#1F2937',
                color: '#EF4444'
            });
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-green-400 p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <FaBullhorn className="text-3xl text-green-400" />
                    <h1 className="text-4xl font-bold font-mono text-green-400">
                        <span className="text-green-500">~/</span>make_announcement
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-mono">
                    <FaTerminal className="text-green-400" />
                    <span>Broadcasting to all developers...</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FaCode className="text-green-400" />
                        <h2 className="text-xl font-bold font-mono text-green-400">Create Announcement</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Author Info Display */}
                        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                            <div className="flex items-center gap-3">
                                <Avatar user={user} size="w-10 h-10" />
                                <div>
                                    <p className="font-mono text-sm text-gray-400">Publishing as:</p>
                                    <p className="font-mono text-green-400 font-bold">{user?.displayName || 'Admin'}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Title Input Field */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">
                                <FaEdit className="inline mr-2" />
                                Announcement Title
                            </label>
                            <input 
                                {...register('title', { 
                                    required: "Title is required",
                                    minLength: { value: 5, message: "Title must be at least 5 characters" },
                                    maxLength: { value: 100, message: "Title cannot exceed 100 characters" }
                                })} 
                                type="text" 
                                placeholder="Enter announcement title..." 
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                                onBlur={(e) => {
                                    if (e.target.value && (e.target.value.toLowerCase().includes('urgent') || e.target.value.toLowerCase().includes('critical'))) {
                                        showPriorityWarning(e.target.value);
                                    }
                                }}
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm mt-1 font-mono flex items-center gap-1">
                                    <FaExclamationTriangle className="text-xs" />
                                    {errors.title.message}
                                </p>
                            )}
                            {/* Character count */}
                            <p className="text-xs text-gray-500 mt-1 font-mono">
                                {watchedValues.title?.length || 0}/100 characters
                            </p>
                        </div>
                        
                        {/* Description Textarea Field */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">
                                <FaCode className="inline mr-2" />
                                Description
                            </label>
                            <textarea 
                                {...register('description', { 
                                    required: "Description is required",
                                    minLength: { value: 10, message: "Description must be at least 10 characters" },
                                    maxLength: { value: 500, message: "Description cannot exceed 500 characters" }
                                })} 
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono h-32 resize-none"
                                placeholder="Write the announcement details..."
                            ></textarea>
                            {errors.description && (
                                <p className="text-red-400 text-sm mt-1 font-mono flex items-center gap-1">
                                    <FaExclamationTriangle className="text-xs" />
                                    {errors.description.message}
                                </p>
                            )}
                            {/* Character count */}
                            <p className="text-xs text-gray-500 mt-1 font-mono">
                                {watchedValues.description?.length || 0}/500 characters
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setPreviewMode(!previewMode)}
                                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 font-mono"
                            >
                                <FaEye />
                                {previewMode ? 'Hide Preview' : 'Preview'}
                            </button>
                            
                            <button 
                                type="button"
                                onClick={handleReset}
                                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 font-mono"
                            >
                                <FaExclamationTriangle />
                                Clear
                            </button>
                            
                            <button 
                                type="submit" 
                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 font-mono disabled:bg-gray-600 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        Publish
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Preview Section */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FaEye className="text-green-400" />
                        <h2 className="text-xl font-bold font-mono text-green-400">Live Preview</h2>
                    </div>
                    
                    {previewMode && (watchedValues.title || watchedValues.description) ? (
                        <div className={`bg-gray-700 rounded-lg p-6 border-l-4 ${getPriorityColor(watchedValues.title)}`}>
                            {/* Preview Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar user={user} size="w-8 h-8" />
                                <div>
                                    <p className="font-mono text-sm text-green-400 font-bold">
                                        {user?.displayName || 'Admin'}
                                    </p>
                                    <p className="font-mono text-xs text-gray-400 flex items-center gap-1">
                                        <FaCalendarAlt className="text-xs" />
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Preview Content */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-green-400 font-mono">
                                    {watchedValues.title || 'Announcement Title'}
                                </h3>
                                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                                    {watchedValues.description || 'Announcement description will appear here...'}
                                </p>
                            </div>
                            
                            {/* Priority Badge */}
                            <div className="mt-4 pt-4 border-t border-gray-600">
                                <span className={`px-3 py-1 rounded-full text-xs font-mono ${getPriorityColor(watchedValues.title)} bg-gray-800`}>
                                    {watchedValues.title?.toLowerCase().includes('urgent') || watchedValues.title?.toLowerCase().includes('critical') ? 
                                        '🚨 High Priority' : 
                                        watchedValues.title?.toLowerCase().includes('important') || watchedValues.title?.toLowerCase().includes('update') ? 
                                        '⚠️ Medium Priority' : 
                                        '📢 Normal Priority'
                                    }
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gray-700 rounded-lg border border-gray-600">
                            <FaCode className="mx-auto text-4xl text-gray-500 mb-4" />
                            <p className="text-gray-400 font-mono">
                                {previewMode ? 'Start typing to see preview...' : 'Click "Preview" to see how your announcement will look'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Status Bar */}
            <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between text-sm font-mono text-gray-400">
                    <span>Status: <span className="text-green-400">Ready to publish</span></span>
                    <span>Author: <span className="text-green-400">{user?.displayName || 'Admin'}</span></span>
                    <span>Mode: <span className="text-green-400">Development Forum</span></span>
                </div>
            </div>
        </div>
    );
};

export default MakeAnnouncement;