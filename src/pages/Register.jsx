import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';
import SocialLogin from '../components/SocialLogin'; // <-- নতুন কম্পোনেন্ট ইম্পোর্ট করুন

const image_hosting_key = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext); // <-- googleSignIn এখান থেকে সরিয়ে ফেলা হয়েছে
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        // ... আপনার ফর্ম সাবমিটের লজিক আগের মতোই থাকবে ...
        const loadingToast = toast.loading('Creating your account...');
        const imageFile = { image: data.image[0] };
        try {
            const res = await axios.post(image_hosting_api, imageFile, {
                headers: { 'content-type': 'multipart/form-data' }
            });
            if (res.data.success) {
                const photoURL = res.data.data.display_url;
                await createUser(data.email, data.password);
                await updateUserProfile(data.name, photoURL);
                toast.dismiss(loadingToast);
                toast.success('Registration Successful! Welcome.');
                navigate('/');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.response?.data?.error?.message || error.message || "Registration failed.");
        }
    };

    // গুগল দিয়ে সাইন ইন হ্যান্ডলারটি এখান থেকে সরিয়ে ফেলা হয়েছে

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a New Account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* ... আপনার সব ইনপুট ফিল্ড ... */}
                    {/* Name, Image, Email, Password fields */}
                     <div>
                        <label htmlFor="name">Name</label>
                        <input {...register("name", { required: "Name is required" })} id="name" type="text" placeholder="Your Name" className="input input-bordered w-full mt-1" />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="image">Profile Picture</label>
                        <input {...register("image", { required: "A profile picture is required" })} id="image" type="file" className="file-input file-input-bordered file-input-success w-full mt-1" />
                        {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>}
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
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                            pattern: { value: /(?=.*[A-Z])(?=.*[!@#$&*])/, message: "Password needs an uppercase letter and a special character" }
                        })} id="password" type="password" placeholder="Password" className="input input-bordered w-full mt-1" />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <button type="submit" className="w-full btn btn-primary bg-green-500 text-white hover:bg-green-600">Sign Up</button>
                    </div>
                </form>
                
                {/* সোশ্যাল লগইন কম্পোনেন্ট এখানে ব্যবহার করা হয়েছে */}
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