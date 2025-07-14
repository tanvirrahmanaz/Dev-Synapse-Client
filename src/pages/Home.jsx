import React from 'react';
import Banner from './Home/Banner';
import TagsSection from './Home/TagSection';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import PostCard from '../components/PostCard';

const Home = () => {
    const axiosPublic = useAxiosPublic();

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await axiosPublic.get('/posts');
            return res.data;
        }
    });

    if (isLoading) return <div className="text-center my-10"><span className="loading loading-lg"></span></div>;

    return (
        <div>
           <Banner />
           <TagsSection />
           <div className="max-w-7xl mx-auto p-4 md:p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Recent Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => <PostCard key={post._id} post={post} />)}
                </div>
            </div>
        </div>
    );
};

export default Home;