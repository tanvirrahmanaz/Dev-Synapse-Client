import React, { useEffect, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../providers/AuthProvider';
import { FaBullhorn, FaCode, FaTerminal, FaClock, FaUser } from 'react-icons/fa';
import Avatar from '../components/Avatar';

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
            // সফলভাবে সময় আপডেট হওয়ার পর, Navbar এর কাউন্ট রিফ্রেশ করা
            queryClient.invalidateQueries({ queryKey: ['newAnnouncements', user?.email] });
            console.log("Marked as read, refetching count.");
        },
        onError: (err) => console.error("Failed to update view time", err),
    });

    // পেজটি লোড হওয়ার পর ব্যবহারকারীর শেষ ভিজিটের সময় আপডেট করা
    useEffect(() => {
        if (user) {
            markAsRead();
        }
    }, [user, markAsRead]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-green-500"></div>
                    <p className="text-green-400 mt-4 font-mono">Loading announcements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-green-400">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-green-500/20">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <FaTerminal className="text-5xl text-green-500" />
                            <FaBullhorn className="text-2xl text-green-400 absolute -top-2 -right-2" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                                System Announcements
                            </h1>
                            <p className="text-gray-400 mt-2 font-mono">
                                &gt; Latest updates and notifications for developers
                            </p>
                        </div>
                    </div>
                    
                    {/* Terminal-style info bar */}
                    <div className="bg-gray-800 rounded-lg p-4 border border-green-500/30 font-mono text-sm">
                        <div className="flex items-center gap-4 text-green-400">
                            <span className="flex items-center gap-2">
                                <FaCode className="text-green-500" />
                                Total: {announcements.length}
                            </span>
                            <span className="text-gray-500">|</span>
                            <span className="flex items-center gap-2">
                                <FaClock className="text-green-500" />
                                Last updated: {new Date().toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {announcements.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-800 rounded-lg p-8 border border-green-500/20 max-w-md mx-auto">
                            <FaTerminal className="text-6xl text-green-500/50 mx-auto mb-4" />
                            <p className="text-green-400 font-mono text-lg">
                                &gt; No announcements found
                            </p>
                            <p className="text-gray-500 mt-2 font-mono text-sm">
                                Check back later for updates...
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {announcements.map((announcement, index) => (
                            <div 
                                key={announcement._id} 
                                className="bg-gray-800 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300 overflow-hidden group"
                            >
                                {/* Terminal-style header */}
                                <div className="bg-gray-700 px-6 py-3 border-b border-green-500/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <span className="text-gray-400 font-mono text-sm">
                                                announcement_{index + 1}.md
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                                            <FaClock className="text-xs" />
                                            {new Date(announcement.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Author Info */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative">
                                            <Avatar user={{ photoURL: announcement.authorImage, displayName: announcement.authorName }} size="w-12 h-12" />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-green-400 flex items-center gap-2">
                                                <FaUser className="text-xs" />
                                                {announcement.authorName}
                                            </p>
                                            <p className="text-gray-500 font-mono text-sm">
                                                @admin • System Administrator
                                            </p>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-2xl font-bold mb-4 text-green-300 group-hover:text-green-200 transition-colors">
                                        <span className="font-mono text-green-500"># </span>
                                        {announcement.title}
                                    </h2>

                                    {/* Description */}
                                    <div className="bg-gray-900 rounded-lg p-4 border border-green-500/10">
                                        <p className="text-gray-300 leading-relaxed font-mono">
                                            {announcement.description}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 pt-4 border-t border-green-500/10">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-4 text-gray-500 font-mono">
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    Status: Active
                                                </span>
                                                <span>•</span>
                                                <span>Priority: High</span>
                                            </div>
                                            <div className="text-green-400 font-mono">
                                                ID: {announcement._id?.slice(-8)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-800 border-t border-green-500/20 mt-12">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-center text-gray-500 font-mono">
                        <p>&gt; End of announcements buffer</p>
                        <p className="text-green-400 mt-2">
                            Stay tuned for more updates • Forum v1.0.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsPage;