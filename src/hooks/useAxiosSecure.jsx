import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

// Axios এর একটি কাস্টম ইনস্ট্যান্স তৈরি করা হচ্ছে
const axiosSecure = axios.create({
    baseURL: 'https://dev-synapse.vercel.app/' // আপনার সার্ভারের URL
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);

    // Axios রিকোয়েস্ট ইন্টারসেপ্টর: প্রতিটি রিকোয়েস্ট পাঠানোর আগে এটি কাজ করবে
    axiosSecure.interceptors.request.use(async (config) => {
        // যদি ব্যবহারকারী লগইন করা থাকে
        if (user) {
            // Firebase থেকে সর্বশেষ ID Token সংগ্রহ করা হচ্ছে
            const token = await user.getIdToken();
            // রিকোয়েস্টের হেডারে Authorization টোকেন যুক্ত করা হচ্ছে
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // Axios রেসপন্স ইন্টারসেপ্টর: সার্ভার থেকে রেসপন্স আসার পর এটি কাজ করবে
    axiosSecure.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        // যদি টোকেন inválid বা মেয়াদোত্তীর্ণ হওয়ার কারণে এরর আসে
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            // ব্যবহারকারীকে লগআউট করে লগইন পেজে পাঠিয়ে দেওয়া হবে
            await logOut();
            navigate('/login');
        }
        return Promise.reject(error);
    });

    return axiosSecure;
};

export default useAxiosSecure;