import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';

// আপনার Stripe Publishable Key দিয়ে loadStripe কল করুন
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

    if (isLoading) {
        return <div className="text-center my-10"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Gold Membership Checkout</h1>
                {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default Membership;