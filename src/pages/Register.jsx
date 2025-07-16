import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';
import SocialLogin from '../components/SocialLogin';
import useAxiosPublic from '../hooks/useAxiosPublic';

const image_hosting_key = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        // রেজিস্ট্রেশন প্রক্রিয়া শুরু
        const registrationPromise = async () => {
            let photoURL = null;

            // ধাপ ১: ছবি আপলোড (যদি ব্যবহারকারী ছবি দেয়)
            if (data.image && data.image[0]) {
                const imageFile = { image: data.image[0] };
                const res = await axios.post(image_hosting_api, imageFile, {
                    headers: { 'content-type': 'multipart/form-data' }
                });
                if (!res.data.success) {
                    throw new Error('Image upload failed');
                }
                photoURL = res.data.data.display_url;
            }

            // ধাপ ২: Firebase এ ইউজার তৈরি করা
            await createUser(data.email, data.password);
            
            // ধাপ ৩: Firebase প্রোফাইল আপডেট করা
            await updateUserProfile(data.name, photoURL);

            // ধাপ ৪: আপনার নিজের ডাটাবেসে ইউজার সেভ করা
            const userInfo = {
                name: data.name,
                email: data.email,
                photoURL: photoURL
            };
            await axiosPublic.post('/users', userInfo);
        };

        // toast.promise ব্যবহার করে সুন্দর লোডিং, সফলতা এবং এরর মেসেজ দেখানো
        await toast.promise(
            registrationPromise(),
            {
                loading: 'Creating your account...',
                success: <b>Registration Successful! Welcome.</b>,
                error: (err) => <b>{err.message || 'Could not register.'}</b>,
            }
        );
        
        // সফল রেজিস্ট্রেশনের পর একটি ছোট ডিলে দিয়ে নেভিগেট করা
        // যাতে AuthProvider স্টেট আপডেট করার সময় পায়
        setTimeout(() => {
            navigate('/');
        }, 1000); // 1 সেকেন্ড ডিলে
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a New Account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* ইনপুট ফিল্ডগুলো আগের মতোই থাকবে */}
                    <div>
                        <label htmlFor="name">Name</label>
                        <input {...register("name", { required: "Name is required" })} id="name" type="text" placeholder="Your Name" className="input input-bordered w-full mt-1" />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="image">Profile Picture (Optional)</label>
                        <input {...register("image")} id="image" type="file" className="file-input file-input-bordered file-input-success w-full mt-1" />
                    </div>
                    <div>
                        <label htmlFor="email">Email address</label>
                        <input {...register("email", { required: "Email is required" })} id="email" type="email" placeholder="Email address" className="input input-bordered w-full mt-1" />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input {...register("password", { 
                                required: "Password is required", 
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            })} id="password" type="password" placeholder="Password" className="input input-bordered w-full mt-1" />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <button type="submit" className="w-full btn btn-primary bg-green-500 text-white hover:bg-green-600">
                            Sign Up
                        </button>
                    </div>
                </form>
                <SocialLogin />
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;