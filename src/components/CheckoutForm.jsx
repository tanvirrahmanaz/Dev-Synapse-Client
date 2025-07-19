import React, { useContext, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from '../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [processing, setProcessing] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useContext(AuthContext);

    // ব্যবহারকারীকে গোল্ড মেম্বার বানানোর জন্য মিউটেশন
    const { mutate: makeMember } = useMutation({
        mutationFn: () => axiosSecure.patch(`/users/make-member`),
        onSuccess: () => {
            toast.success('Congratulations! You are now a Gold Member.');
            // Invalidate the user query to refetch the data
            queryClient.invalidateQueries(['dbUser', user?.email]);
            navigate('/dashboard/my-profile');
        }
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);

        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                payment_method_data: {
                    billing_details: {
                        name: 'Guest User', // আপনি চাইলে AuthContext থেকে ব্যবহারকারীর নাম দিতে পারেন
                    },
                },
            },
            redirect: 'if_required', // পেমেন্ট সফল হলে রিডাইরেক্ট না করে এখানেই রেজাল্ট দিন
        });

        if (confirmError) {
            toast.error(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            // পেমেন্ট সফল হলে, আমাদের সার্ভারে কল করে ব্যবহারকারীকে মেম্বার বানান
            makeMember();
        } else {
            toast.error('Payment was not successful. Please try again.');
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4">Card Information</h2>
            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full btn btn-primary bg-green-500 text-white mt-6"
            >
                {processing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export default CheckoutForm;