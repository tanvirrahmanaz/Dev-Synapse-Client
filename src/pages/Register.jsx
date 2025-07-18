import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';
import SocialLogin from '../components/SocialLogin';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { FaCode, FaEye, FaEyeSlash, FaTerminal, FaUser, FaLock } from 'react-icons/fa';

const image_hosting_key = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
    const { createUser, updateUserProfile, signIn } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    
    const onSubmit = async (data) => {
        // রেজিস্ট্রেশন প্রক্রিয়া শুরু
        const registrationPromise = async () => {
            let photoURL = null;
            
            // ধাপ ১: ছবি আপলোড (যদি ব্যবহারকারী ছবি দেয়)
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
            
            // ধাপ ৫: Registration complete হওয়ার পর Login করা
            await signIn(data.email, data.password);
        };

        try {
            // toast.promise ব্যবহার করে সুন্দর লোডিং, সফলতা এবং এরর মেসেজ দেখানো
            await toast.promise(
                registrationPromise(),
                {
                    loading: 'Registering and logging in...',
                    success: <b>Registration successful! Welcome to DevForum! 🎉</b>,
                    error: (err) => <b>Error: {err.message || 'Authentication failed'}</b>,
                }
            );
            
            // Registration সফল হলে সরাসরি home page এ redirect
            navigate('/');
            
        } catch (error) {
            // Error handling already done by toast.promise
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 text-6xl text-green-500 animate-pulse">
                    <FaCode />
                </div>
                <div className="absolute top-20 right-20 text-4xl text-emerald-500 animate-bounce">
                    <FaTerminal />
                </div>
                <div className="absolute bottom-20 left-20 text-5xl text-green-400 animate-pulse">
                    {'</>'}
                </div>
                <div className="absolute bottom-10 right-10 text-3xl text-emerald-400 animate-bounce">
                    {'{}'}
                </div>
            </div>

            {/* Register Card */}
            <div className="w-full max-w-md relative">
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 animate-pulse"></div>
                
                <div className="relative bg-gray-800 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                                <FaCode className="text-2xl text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            Developer Forum
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Join thousands of developers sharing knowledge
                        </p>
                    </div>

                    {/* Terminal-like greeting */}
                    <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 font-mono text-sm">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-green-400">
                            <span className="text-emerald-400">$</span> ./register.sh
                        </div>
                        <div className="text-gray-400 text-xs">
                            Initializing authentication...
                        </div>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="name" 
                                className="block text-sm font-medium text-gray-300 flex items-center gap-2"
                            >
                                <FaUser className="text-green-400" />
                                Name
                            </label>
                            <div className="relative">
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:border-green-500"
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span>
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Profile Picture */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="image" 
                                className="block text-sm font-medium text-gray-300 flex items-center gap-2"
                            >
                                <FaCode className="text-green-400" />
                                Profile Picture (Optional)
                            </label>
                            <input
                                {...register("image")}
                                id="image"
                                type="file"
                                accept="image/*"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-medium text-gray-300 flex items-center gap-2"
                            >
                                <FaUser className="text-green-400" />
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    {...register("email", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    id="email"
                                    type="email"
                                    placeholder="developer@example.com"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:border-green-500"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-300 flex items-center gap-2"
                            >
                                <FaLock className="text-green-400" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register("password", { 
                                        required: "Password is required", 
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:border-green-500 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Register Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300"
                            >
                                Sign Up →
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-gray-800 px-4 text-gray-400">or continue with</span>
                        </div>
                    </div>

                    {/* Social Login Component */}
                    <SocialLogin />

                    {/* Footer */}
                    <div className="text-center space-y-2">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-green-400 hover:text-green-300 font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                        <p className="text-xs text-gray-500">
                            Join thousands of developers sharing knowledge
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-green-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            </div>
        </div>
    );
};

export default Register;

