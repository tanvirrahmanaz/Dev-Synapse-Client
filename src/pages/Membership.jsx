import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { FaCode, FaUsers, FaRocket, FaShieldAlt, FaCrown, FaCheck } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

// আপনার Stripe Publishable Key দিয়ে loadStripe কল করুন
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Membership = () => {
    const axiosSecure = useAxiosSecure();
    
    // সার্ভার থেকে clientSecret আনার জন্য useQuery
    const { data: clientSecret, isLoading } = useQuery({
        queryKey: ['payment-intent'],
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-green-400 text-lg font-mono">Loading payment gateway...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 opacity-50"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
            
            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-500/20 p-4 rounded-full border border-green-500/30 shadow-lg shadow-green-500/20">
                                <FaCrown className="text-5xl text-green-400 animate-pulse" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            Gold Membership Checkout
                        </h1>
                        <p className="text-xl text-gray-300 font-mono">
                            Join the elite community of developers
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Features Section */}
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
                            
                            {/* Pricing */}
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

                        {/* Payment Section */}
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
                                <Elements stripe={stripePromise} options={{ 
                                    clientSecret,
                                    appearance: {
                                        theme: 'night',
                                        variables: {
                                            colorPrimary: '#22c55e',
                                            colorBackground: '#374151',
                                            colorText: '#f3f4f6',
                                            colorDanger: '#ef4444',
                                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                            spacingUnit: '4px',
                                            borderRadius: '8px',
                                            colorTextSecondary: '#9ca3af',
                                            colorTextPlaceholder: '#6b7280',
                                            colorIcon: '#22c55e',
                                            colorIconHover: '#16a34a',
                                            colorInputBackground: '#1f2937',
                                            colorInputBorder: '#4b5563',
                                            colorInputText: '#f3f4f6',
                                            colorInputPlaceholder: '#6b7280',
                                            colorInputBorderFocus: '#22c55e',
                                            colorInputBorderHover: '#16a34a',
                                            colorButtonBackground: '#22c55e',
                                            colorButtonText: '#000000',
                                            colorButtonBackgroundHover: '#16a34a',
                                            colorButtonBorder: '#22c55e',
                                            colorButtonBorderHover: '#16a34a',
                                            colorTabIcon: '#6b7280',
                                            colorTabIconSelected: '#22c55e',
                                            colorTabText: '#9ca3af',
                                            colorTabTextSelected: '#f3f4f6',
                                            colorLinkText: '#22c55e',
                                            colorLinkTextHover: '#16a34a'
                                        },
                                        rules: {
                                            '.Input': {
                                                backgroundColor: '#1f2937',
                                                border: '1px solid #4b5563',
                                                boxShadow: 'none',
                                                color: '#f3f4f6',
                                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                                            },
                                            '.Input:focus': {
                                                border: '1px solid #22c55e',
                                                boxShadow: '0 0 0 1px #22c55e'
                                            },
                                            '.Input::placeholder': {
                                                color: '#6b7280'
                                            },
                                            '.Tab': {
                                                backgroundColor: '#374151',
                                                border: '1px solid #4b5563',
                                                color: '#9ca3af'
                                            },
                                            '.Tab:hover': {
                                                backgroundColor: '#4b5563',
                                                color: '#f3f4f6'
                                            },
                                            '.Tab--selected': {
                                                backgroundColor: '#22c55e',
                                                color: '#000000',
                                                border: '1px solid #22c55e'
                                            },
                                            '.Label': {
                                                color: '#f3f4f6',
                                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                                fontSize: '14px'
                                            },
                                            '.Error': {
                                                color: '#ef4444',
                                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                                fontSize: '12px'
                                            },
                                            '.SubmitButton': {
                                                backgroundColor: '#22c55e',
                                                color: '#000000',
                                                border: 'none',
                                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                                fontWeight: '600',
                                                borderRadius: '8px',
                                                padding: '12px 24px',
                                                fontSize: '16px',
                                                transition: 'all 0.2s ease'
                                            },
                                            '.SubmitButton:hover': {
                                                backgroundColor: '#16a34a',
                                                transform: 'translateY(-1px)'
                                            },
                                            '.SubmitButton:active': {
                                                transform: 'translateY(0)'
                                            }
                                        }
                                    }
                                }}>
                                    <div className="bg-gray-800/80 border border-gray-600/50 rounded-xl p-6 backdrop-blur-sm">
                                        <CheckoutForm />
                                    </div>
                                </Elements>
                            )}
                            
                            {/* Trust Indicators */}
                            <div className="mt-6 grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl text-green-400 mb-2">🔒</div>
                                    <p className="text-xs text-gray-400 font-mono">Secure</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl text-green-400 mb-2">⚡</div>
                                    <p className="text-xs text-gray-400 font-mono">Instant</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl text-green-400 mb-2">🎯</div>
                                    <p className="text-xs text-gray-400 font-mono">Cancel Anytime</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
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