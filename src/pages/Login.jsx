import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import SocialLogin from '../components/SocialLogin';
import { FaCode, FaEye, FaEyeSlash, FaTerminal, FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (data) => {
        setIsLoading(true);
        const loadingToast = toast.loading('Signing in...', {
            style: {
                borderRadius: '10px',
                background: '#1f2937',
                color: '#10b981',
                border: '1px solid #10b981'
            }
        });
        
        signIn(data.email, data.password)
            .then(() => {
                toast.dismiss(loadingToast);
                toast.success('Login Successful! Welcome back, developer! 🚀', {
                    duration: 3000,
                    style: {
                        borderRadius: '10px',
                        background: '#1f2937',
                        color: '#10b981',
                        border: '1px solid #10b981'
                    }
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                toast.dismiss(loadingToast);
                toast.error("Invalid credentials. Please try again. 🔐", {
                    duration: 3000,
                    style: {
                        borderRadius: '10px',
                        background: '#1f2937',
                        color: '#ef4444',
                        border: '1px solid #ef4444'
                    }
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
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

            {/* Login Card */}
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
                            Welcome back! Sign in to continue coding together.
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
                            <span className="text-emerald-400">$</span> ./login.sh
                        </div>
                        <div className="text-gray-400 text-xs">
                            Initializing authentication...
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
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

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <span className="text-lg">→</span>
                                    </>
                                )}
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
                            New here?{' '}
                            <Link 
                                to="/register" 
                                className="text-green-400 hover:text-green-300 font-medium transition-colors"
                            >
                                Create an account
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

export default Login;