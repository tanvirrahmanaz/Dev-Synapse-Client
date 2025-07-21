import React, { useContext, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [processing, setProcessing] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useContext(AuthContext);

    const { mutate: makeMember } = useMutation({
        mutationFn: () => axiosSecure.patch(`/users/make-member`),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['dbUser', user?.email]);
            MySwal.fire({
                title: 'Payment Successful!',
                text: 'Congratulations! You are now a Gold Member.',
                icon: 'success',
                background: '#1f2937',
                color: '#f3f4f6',
                confirmButtonColor: '#22c55e',
                confirmButtonText: 'Go to Profile',
            }).then(() => {
                navigate('/dashboard/my-profile');
            });
        },
        onError: () => {
            MySwal.fire({
                title: 'Payment Failed',
                text: 'Something went wrong. Please try again.',
                icon: 'error',
                background: '#1f2937',
                color: '#f3f4f6',
                confirmButtonColor: '#ef4444',
            });
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
                        name: user?.displayName || 'Guest User',
                    },
                },
            },
            redirect: 'if_required',
        });

        if (confirmError) {
            MySwal.fire({
                title: 'Payment Error',
                text: confirmError.message,
                icon: 'error',
                background: '#1f2937',
                color: '#f3f4f6',
                confirmButtonColor: '#ef4444',
            });
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            makeMember();
        } else {
            MySwal.fire({
                title: 'Payment Not Successful',
                text: 'Please try again.',
                icon: 'warning',
                background: '#1f2937',
                color: '#f3f4f6',
                confirmButtonColor: '#f59e0b',
            });
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