import axios from "axios";

// এই ইনস্ট্যান্সটিতে কোনো ইন্টারসেপ্টর নেই
const axiosPublic = axios.create({
    baseURL: 'http://localhost:5000' // আপনার সার্ভারের URL
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;