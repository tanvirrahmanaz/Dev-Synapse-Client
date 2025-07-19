import axios from "axios";

// এই ইনস্ট্যান্সটিতে কোনো ইন্টারসেপ্টর নেই
const axiosPublic = axios.create({
    baseURL: 'https://dev-synapse.vercel.app/' // আপনার সার্ভারের URL
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;