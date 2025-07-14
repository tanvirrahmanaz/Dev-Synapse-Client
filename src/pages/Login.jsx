import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import SocialLogin from '../components/SocialLogin'; // <-- নতুন কম্পোনেন্ট ইম্পোর্ট করুন

const Login = () => {
    const { signIn } = useContext(AuthContext); // <-- googleSignIn এখান থেকে সরিয়ে ফেলা হয়েছে
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        // ... আপনার ফর্ম সাবমিটের লজিক আগের মতোই থাকবে ...
        const loadingToast = toast.loading('Signing in...');
        signIn(data.email, data.password)
            .then(() => {
                toast.dismiss(loadingToast);
                toast.success('Login Successful!');
                navigate(from, { replace: true });
            })
            .catch(error => {
                toast.dismiss(loadingToast);
                toast.error("Invalid credentials. Please try again.");
            });
    };

    // গুগল দিয়ে সাইন ইন হ্যান্ডলারটি এখান থেকে সরিয়ে ফেলা হয়েছে

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* ... Email এবং Password ফিল্ড ... */}
                    <div>
                        <label htmlFor="email">Email address</label>
                        <input {...register("email", { required: "Email is required" })} id="email" type="email" placeholder="Email address" className="input input-bordered w-full mt-1" />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input {...register("password", { required: "Password is required" })} id="password" type="password" placeholder="Password" className="input input-bordered w-full mt-1" />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <button type="submit" className="w-full btn btn-primary bg-green-500 text-white hover:bg-green-600">Sign In</button>
                    </div>
                </form>
                
                {/* সোশ্যাল লগইন কম্পোনেন্ট এখানে ব্যবহার করা হয়েছে */}
                <SocialLogin />
                
                <p className="mt-2 text-center text-sm text-gray-600">
                    New here?{' '}
                    <Link to="/register" className="font-medium text-green-600 hover:text-green-500">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;