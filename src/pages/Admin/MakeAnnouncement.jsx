// src/pages/Admin/MakeAnnouncement.jsx
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';

const MakeAnnouncement = () => {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    const onSubmit = (data) => {
        const announcement = {
            authorName: user.displayName,
            authorImage: user.photoURL,
            title: data.title,
            description: data.description,
            timestamp: new Date()
        };
        axiosSecure.post('/announcements', announcement)
            .then(res => {
                if(res.data.insertedId){
                    toast.success('Announcement published!');
                    reset();
                }
            });
    };
    
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Make an Announcement</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg">
                {/* ... Title এবং Description এর জন্য ইনপুট ফিল্ড ... */}
                <button type="submit" className="btn btn-primary">Publish</button>
            </form>
        </div>
    );
};
export default MakeAnnouncement;