import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';

const SocialLogin = () => {
    const { googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // ব্যবহারকারীকে লগইনের পর আগের পেজে ফেরত পাঠানোর জন্য
    const from = location.state?.from?.pathname || "/";

    // গুগল দিয়ে সাইন ইন হ্যান্ডলার
    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(() => {
                toast.success('Successfully logged in!');
                // সফলভাবে লগইন করার পর ব্যবহারকারীকে তার আগের পেজে বা হোমপেজে পাঠানো হবে
                navigate(from, { replace: true });
            })
            .catch(error => {
                toast.error(error.message);
            });
    };

    return (
        <div>
            <div className="divider">OR</div>
            <div className="w-full">
                <button onClick={handleGoogleSignIn} className="w-full btn btn-outline">
                    <FaGoogle className="mr-2" /> Continue with Google
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;