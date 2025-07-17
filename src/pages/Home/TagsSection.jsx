import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';

// onTagClick নামে একটি prop গ্রহণ করা হচ্ছে
const TagsSection = ({ onTagClick }) => {
    const axiosPublic = useAxiosPublic();

    // সার্ভার থেকে সব ট্যাগ আনার জন্য useQuery
    const { data: tags = [], isLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => (await axiosPublic.get('/tags')).data
    });

    if (isLoading) {
        return <div className="text-center"><span className="loading loading-dots"></span></div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Explore by Tags</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {tags.map(tag => (
                    <button 
                        key={tag._id}
                        // বাটনে ক্লিক করলে props হিসেবে আসা onTagClick ফাংশনটি কল হবে
                        onClick={() => onTagClick(tag.name)}
                        className="btn btn-outline border-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 capitalize"
                    >
                        #{tag.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TagsSection;