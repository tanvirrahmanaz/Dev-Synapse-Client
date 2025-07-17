import React, { useEffect, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../providers/AuthProvider';
import { FaBullhorn } from 'react-icons/fa';

const AnnouncementsPage = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // সব অ্যানাউন্সমেন্ট আনার জন্য useQuery
    const { data: announcements = [], isLoading } = useQuery({
        queryKey: ['allAnnouncements'],
        queryFn: async () => (await axiosPublic.get('/announcements')).data,
    });

    // ব্যবহারকারীর "দেখা" স্ট্যাটাস আপডেট করার জন্য useMutation
    const { mutate: markAsRead } = useMutation({
        mutationFn: () => axiosSecure.post('/users/update-view-time'),
        onSuccess: () => {
            // সফলভাবে সময় আপডেট হওয়ার পর, Navbar এর কাউন্ট রিফ্রেশ করা
            queryClient.invalidateQueries({ queryKey: ['newAnnouncementCount', user?.email] });
            console.log("Marked as read, refetching count.");
        },
        onError: (err) => console.error("Failed to update view time", err),
    });

    // পেজটি লোড হওয়ার পর ব্যবহারকারীর শেষ ভিজিটের সময় আপডেট করা
    useEffect(() => {
        if (user) {
            markAsRead();
        }
    }, [user, markAsRead]);

    if (isLoading) {
        return <div className="text-center my-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <FaBullhorn className="text-4xl text-green-500" />
                <h1 className="text-4xl font-bold">Announcements</h1>
            </div>

            {announcements.length === 0 ? (
                <p className="text-center text-gray-500">No announcements at the moment.</p>
            ) : (
                <div className="space-y-6">
                    {announcements.map(announcement => (
                        <div key={announcement._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                           <div className="flex items-center gap-4 mb-3">
                                <img src={announcement.authorImage} alt={announcement.authorName} className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-semibold">{announcement.authorName}</p>
                                    <p className="text-sm text-gray-500">{new Date(announcement.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{announcement.title}</h2>
                            <p className="text-gray-700">{announcement.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnnouncementsPage;