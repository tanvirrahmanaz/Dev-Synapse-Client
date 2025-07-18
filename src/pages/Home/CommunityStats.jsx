import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FaUsers, FaComments, FaFileAlt } from 'react-icons/fa';

const CommunityStats = () => {
    const axiosPublic = useAxiosPublic();
    
    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['communityStats'],
        queryFn: async () => {
            const res = await axiosPublic.get('/community-stats');
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="bg-gray-800 border border-green-500/20 rounded-lg p-6">
                <div className="flex justify-center items-center h-full">
                    <span className="loading loading-dots loading-md"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                <FaUsers className="mr-2" />
                Community Stats
            </h3>
            <div className="space-y-4">
                <div className="w-full bg-gray-700 text-green-400 py-3 px-4 rounded-lg font-medium flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FaFileAlt className="text-green-400" />
                        <span className="text-gray-300">Total Posts</span>
                    </div>
                    <span className="text-green-400 font-bold text-lg">
                        {stats.totalPosts || 0}
                    </span>
                </div>
                <div className="w-full bg-gray-700 text-green-400 py-3 px-4 rounded-lg font-medium flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FaUsers className="text-green-400" />
                        <span className="text-gray-300">Total Members</span>
                    </div>
                    <span className="text-green-400 font-bold text-lg">
                        {stats.totalUsers || 0}
                    </span>
                </div>
                <div className="w-full bg-gray-700 text-green-400 py-3 px-4 rounded-lg font-medium flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FaComments className="text-green-400" />
                        <span className="text-gray-300">Total Comments</span>
                    </div>
                    <span className="text-green-400 font-bold text-lg">
                        {stats.totalComments || 0}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CommunityStats;