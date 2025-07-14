import React, { useContext } from 'react';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';

const Membership = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

     const handleBecomeMember = () => {
        const toastId = toast.loading('Processing your membership...');

        // URL থেকে user.email অংশটি সরিয়ে ফেলা হয়েছে
        axiosSecure.patch('/users/make-member', { email: user.email }) 
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('Congratulations! You are now a Gold Member.', { id: toastId });
                    // আপনি চাইলে এখানে ব্যবহারকারীর তথ্য আবার আনতে পারেন বা পেজ রিলোড করতে পারেন
                    // window.location.reload(); 
                } else {
                    toast.error('Could not process membership.', { id: toastId });
                }
            })
            .catch(err => {
                // useAxiosSecure এরর হ্যান্ডেল করবে, কিন্তু একটি ফলব্যাক মেসেজ দেখানো ভালো
                toast.error(err.response?.data?.message || 'An error occurred.', { id: toastId });
            });
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full text-center bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold mb-2">Become a Gold Member</h1>
                <p className="text-gray-600 mb-6">Unlock exclusive features, including the ability to post more than 5 times!</p>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md">
                    <p>For a one-time payment of **$10.00**, you get lifetime access.</p>
                </div>
                <button onClick={handleBecomeMember} className="btn btn-primary w-full bg-green-500 hover:bg-green-600 text-white">
                    Become a Member Now 
                </button>
            </div>
        </div>
    );
};

export default Membership;