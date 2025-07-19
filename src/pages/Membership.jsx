import React, { useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../providers/AuthProvider';
import { FaCode, FaUsers, FaRocket, FaShieldAlt, FaCrown, FaCheck, FaSpinner } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

// আপনার Stripe Publishable Key দিয়ে loadStripe কল করুন
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Membership = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading: authLoading } = useContext(AuthContext);

    // ব্যবহারকারীর ডেটাবেস তথ্য আনার জন্য
    const { data: dbUser, isLoading: userLoading } = useQuery({
        queryKey: ['dbUser', user?.email],
        enabled: !authLoading && !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/users/${user.email}`)).data
    });

    // সার্ভার থেকে clientSecret আনার জন্য useQuery
    const { data: clientSecret, isLoading: intentLoading } = useQuery({
        queryKey: ['payment-intent'],
        enabled: dbUser?.badge !== 'Gold', // শুধুমাত্র গোল্ড মেম্বার না হলেই ইন্টেন্ট তৈরি হবে
        queryFn: async () => {
            const res = await axiosSecure.post('/create-payment-intent', { price: 10 }); // $10 for membership
            return res.data.clientSecret;
        },
    });

    const premiumFeatures = [
        { icon: <FaCode className="text-green-400" />, text: "Unlimited code snippet sharing" },
        { icon: <FaUsers className="text-green-400" />, text: "Access to exclusive developer communities" },
        { icon: <FaRocket className="text-green-400" />, text: "Priority support and faster responses" },
        { icon: <FaShieldAlt className="text-green-400" />, text: "Advanced security features" },
        { icon: <HiSparkles className="text-green-400" />, text: "Early access to new features" },
        { icon: <FaCrown className="text-green-400" />, text: "Premium badge and profile customization" }
    ];

    const isLoading = authLoading || userLoading || (dbUser?.badge !== 'Gold' && intentLoading);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <FaSpinner className="animate-spin text-green-500 text-5xl" />
                    <p className="text-green-400 text-lg font-mono">Loading Membership Status...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 opacity-50"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
            
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-500/20 p-4 rounded-full border border-green-500/30 shadow-lg shadow-green-500/20">
                                <FaCrown className="text-5xl text-green-400 animate-pulse" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            {dbUser?.badge === 'Gold' ? 'You are a Gold Member' : 'Gold Membership Checkout'}
                        </h1>
                        <p className="text-xl text-gray-300 font-mono">
                            {dbUser?.badge === 'Gold' ? 'Thank you for being a part of our elite community!' : 'Join the elite community of developers'}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center">
                                <FaCode className="mr-3" />
                                Premium Features
                            </h2>
                            <div className="space-y-4">
                                {premiumFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
                                        <div className="text-xl">{feature.icon}</div>
                                        <p className="text-gray-300 font-mono text-sm">{feature.text}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-8 text-center">
                                <div className="flex justify-center items-center space-x-4 mb-4">
                                    <span className="text-gray-400 text-2xl line-through">$20</span>
                                    <span className="text-4xl font-bold text-green-400">$10</span>
                                    <span className="text-gray-300 text-lg">/month</span>
                                </div>
                                <div className="bg-green-500 text-black px-4 py-2 rounded-full text-sm font-bold inline-block">
                                    🎉 50% OFF LIMITED TIME
                                </div>
                            </div>
                        </div>

                        {dbUser?.badge === 'Gold' ? (
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center">
                                <HiSparkles className="text-7xl text-yellow-400 mb-6" />
                                <h2 className="text-3xl font-bold text-white mb-4">Already a Gold Member!</h2>
                                <p className="text-gray-300 font-mono mb-6">
                                    You have full access to all premium features. Explore the community and enjoy!
                                </p>
                                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-lg shadow-lg">
                                    <FaCrown className="mr-2" />
                                    Gold Developer Status
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold mb-2 text-green-400">
                                        Secure Payment
                                    </h2>
                                    <p className="text-gray-300 font-mono text-sm">
                                        Powered by Stripe • 256-bit SSL Encryption
                                    </p>
                                </div>
                                
                                {clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                                        <div className="bg-gray-800/80 border border-gray-600/50 rounded-xl p-6 backdrop-blur-sm">
                                            <CheckoutForm />
                                        </div>
                                    </Elements>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="text-center mt-12">
                        <div className="flex justify-center items-center space-x-2 text-green-400">
                            <FaCheck />
                            <span className="font-mono text-sm">30-day money-back guarantee</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Membership;
