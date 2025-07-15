import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddPost = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    
    // ব্যবহারকারীর পোস্ট সংখ্যা এবং ব্যাজ তথ্য আনা হচ্ছে
    const { data: postCountData, isLoading } = useQuery({
        queryKey: ['postCount', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const countRes = await axiosSecure.get(`/posts/count/${user.email}`);
            const userRes = await axiosSecure.get(`/users/${user.email}`);
            return { postCount: countRes.data.count, badge: userRes.data.badge };
        }
    });

    const onSubmit = (data) => {
        const newPost = {
            authorImage: user.photoURL,
            authorName: user.displayName,
            authorEmail: user.email,
            postTitle: data.title,
            postDescription: data.description,
            tags: [data.tag],
            postTime: new Date(),
            upVotedBy: [],
            downVotedBy: [],
            commentsCount: 0
        };
        
        axiosSecure.post('/posts', newPost)
            .then(res => {
                if(res.data.insertedId){
                    toast.success('Post added successfully!');
                    reset();
                    navigate('/dashboard/my-posts');
                }
            })
    };
    
    if (isLoading) return <span className="loading loading-spinner"></span>;
    
    const canPost = postCountData?.badge === 'Gold' || postCountData?.postCount < 5;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Add a New Post</h2>
            {canPost ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                    <div>
                        <label className="label"><span className="label-text">Post Title</span></label>
                        <input {...register('title', {required: true})} type="text" placeholder="Title" className="input input-bordered w-full" />
                    </div>
                    <div>
                        <label className="label"><span className="label-text">Post Description</span></label>
                        <textarea {...register('description', {required: true})} className="textarea textarea-bordered w-full" placeholder="Description"></textarea>
                    </div>
                     <div>
                        <label className="label"><span className="label-text">Tag</span></label>
                        <select {...register('tag', {required: true})} className="select select-bordered w-full">
                            <option>react</option>
                            <option>javascript</option>
                            <option>nodejs</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary bg-green-500">Add Post</button>
                </form>
            ) : (
                <div className="text-center p-8 bg-yellow-100 rounded-lg">
                    <h3 className="text-xl font-bold">You have reached your posting limit!</h3>
                    <p className="my-4">Become a Gold member to add unlimited posts.</p>
                    <button onClick={() => navigate('/membership')} className="btn btn-primary bg-yellow-500">Become a Member</button>
                </div>
            )}
        </div>
    );
};
export default AddPost;