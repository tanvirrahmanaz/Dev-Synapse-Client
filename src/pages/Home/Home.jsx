import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Banner from './Banner';
import PostsSection from '../../components/PostsSection';
import TagsSection from './TagsSection';

const Home = () => {
    const [searchTag, setSearchTag] = useState('');
    const [sortBy, setSortBy] = useState('latest'); // 'latest' or 'popularity'
    const [currentPage, setCurrentPage] = useState(1);
    const axiosPublic = useAxiosPublic();

    const { data, isLoading } = useQuery({
        queryKey: ['posts', searchTag, sortBy, currentPage],
        queryFn: async () => {
            const res = await axiosPublic.get(`/posts?tag=${searchTag}&sortBy=${sortBy}&page=${currentPage}&limit=5`);
            return res.data;
        }
    });

    const handleSearch = (tag) => {
        setSearchTag(tag);
        setCurrentPage(1); // নতুন সার্চ করলে প্রথম পেজে ফেরত যাও
    };

    const handleSortByPopularity = () => {
        setSortBy('popularity');
        setCurrentPage(1);
    };

    return (
        <div>
            <Banner onSearch={handleSearch} />
            
            <div className="text-center my-8">
                <button onClick={handleSortByPopularity} className="btn btn-primary bg-green-500 hover:bg-green-600 text-white">
                    Sort by Popularity
                </button>
            </div>
            
            <TagsSection />

            <PostsSection 
                posts={data?.posts || []} 
                isLoading={isLoading}
                totalPosts={data?.totalPosts || 0}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Home;