import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaBullhorn } from 'react-icons/fa'; // হেডিং-এর জন্য আইকন

const MakeAnnouncement = () => {
    // AuthContext থেকে বর্তমান অ্যাডমিনের তথ্য নেওয়া হচ্ছে
    const { user } = useContext(AuthContext);
    
    // react-hook-form থেকে প্রয়োজনীয় ফাংশন নেওয়া হচ্ছে
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    // নিরাপদ API কলের জন্য কাস্টম হুক
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // useMutation হুকটি সার্ভারে ডেটা পাঠানোর (POST রিকোয়েস্ট) কাজটি পরিচালনা করে
    const { mutate: publishAnnouncement, isLoading } = useMutation({
        // mutationFn: সার্ভারে কোন কাজটি করা হবে তা নির্ধারণ করে
        mutationFn: (announcement) => axiosSecure.post('/announcements', announcement),
        
        // onSuccess: API কল সফল হলে এই ফাংশনটি রান হয়
        onSuccess: (res) => {
            if (res.data.insertedId) {
                toast.success('Announcement published successfully!');
                reset(); // ফর্মটি রিসেট করে দেওয়া হচ্ছে
                
                // Navbar-এর নোটিফিকেশন কাউন্ট আপডেট করার জন্য এই কোয়েরিটি invalidate করা হচ্ছে
                queryClient.invalidateQueries({ queryKey: ['announcementCount'] });
                queryClient.invalidateQueries({ queryKey: ['allAnnouncements'] }); // হোমপেজের তালিকাও রিফ্রেশ হবে
            }
        },
        
        // onError: API কল ব্যর্থ হলে এই ফাংশনটি রান হয়
        onError: () => toast.error('Failed to publish announcement.'),
    });

    // ফর্ম সাবমিট হলে এই ফাংশনটি কল করা হয়
    const onSubmit = (data) => {
        const announcement = {
            authorName: user.displayName,
            authorImage: user.photoURL,
            title: data.title,
            description: data.description,
            timestamp: new Date()
        };
        // useMutation-এর `mutate` ফাংশনকে কল করে সার্ভারে ডেটা পাঠানো হচ্ছে
        publishAnnouncement(announcement);
    };
    
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <FaBullhorn className="text-3xl text-green-600" />
                <h2 className="text-3xl font-bold">Make an Announcement</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                {/* Title Input Field */}
                <div>
                    <label className="label">
                        <span className="label-text font-semibold">Announcement Title</span>
                    </label>
                    <input 
                        {...register('title', { required: "Title is required" })} 
                        type="text" 
                        placeholder="Enter title" 
                        className="input input-bordered w-full" 
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Description Textarea Field */}
                <div>
                    <label className="label">
                        <span className="label-text font-semibold">Description</span>
                    </label>
                    <textarea 
                        {...register('description', { required: "Description is required" })} 
                        className="textarea textarea-bordered w-full h-32" 
                        placeholder="Write the announcement details..."
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="btn btn-primary bg-green-500 text-white hover:bg-green-600"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner"></span>
                            Publishing...
                        </>
                    ) : 'Publish Announcement'}
                </button>
            </form>
        </div>
    );
};

export default MakeAnnouncement;