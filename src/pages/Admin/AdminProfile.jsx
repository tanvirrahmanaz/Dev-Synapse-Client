import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { 
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
  AreaChart, Area 
} from 'recharts';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { 
  FaTags, FaTrash, FaPlus, FaUsers, FaComments, FaFileAlt, 
  FaChartLine, FaCode, FaTerminal, FaServer, FaDatabase,
  FaGithub, FaLaptopCode, FaRocket, FaShieldAlt, FaBug,
  FaEye, FaHeart, FaShare, FaClock,FaFilter
} from 'react-icons/fa';

import { HiTrendingUp } from "react-icons/hi";

const AdminProfile = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm();
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('7d');

    // সাইটের প্রধান পরিসংখ্যান
    const { data: stats = {}, isLoading: isStatsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => (await axiosSecure.get('/admin-stats')).data
    });

    // সব ট্যাগ আনার জন্য
    const { data: allTags = [], refetch: refetchTags } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => (await axiosSecure.get('/tags')).data
    });

    // অ্যানালিটিক্স ডেটা
    const { data: analytics = {} } = useQuery({
        queryKey: ['admin-analytics', timeRange],
        queryFn: async () => (await axiosSecure.get(`/admin-analytics?range=${timeRange}`)).data
    });

    // নতুন রিয়েল-টাইম ডেটা
    const { data: realTimeData = {} } = useQuery({
        queryKey: ['real-time-data'],
        queryFn: async () => (await axiosSecure.get('/real-time-stats')).data,
        refetchInterval: 30000 // প্রতি 30 সেকেন্ডে রিফ্রেশ
    });

    const topTags = analytics.topTags || [];
    const growthData = analytics.growthData || [];
    const activityData = analytics.activityData || [];

    // মিউটেশন functions
    const { mutate: addTag } = useMutation({
        mutationFn: (newTag) => axiosSecure.post('/tags', newTag),
        onSuccess: () => {
            Swal.fire({ 
                title: "Success!", 
                text: "Tag added successfully.", 
                icon: "success",
                background: '#1f2937',
                color: '#fff'
            });
            reset();
            refetchTags();
        },
        onError: (err) => Swal.fire({ 
            title: "Error!", 
            text: err.response?.data?.message || 'Failed to add tag.', 
            icon: "error",
            background: '#1f2937',
            color: '#fff'
        })
    });
    
    const { mutate: deleteTag } = useMutation({
        mutationFn: (tagId) => axiosSecure.delete(`/tags/${tagId}`),
        onSuccess: () => {
            Swal.fire({ 
                title: "Deleted!", 
                text: "The tag has been deleted.", 
                icon: "success",
                background: '#1f2937',
                color: '#fff'
            });
            refetchTags();
        },
        onError: () => Swal.fire({ 
            title: "Error!", 
            text: "Failed to delete tag.", 
            icon: "error",
            background: '#1f2937',
            color: '#fff'
        })
    });

    const onTagSubmit = (data) => addTag({ name: data.tagName });

    const handleDeleteTag = (tag) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You won't be able to revert this! You are deleting the #${tag.name} tag.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#22C55E",
            cancelButtonColor: "#EF4444",
            confirmButtonText: "Yes, delete it!",
            background: '#1f2937',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTag(tag._id);
            }
        });
    };

    // চার্ট ডেটা
    const distributionData = [
        { name: 'Posts', value: stats?.postsCount || 0, color: '#22C55E' },
        { name: 'Users', value: stats?.usersCount || 0, color: '#10B981' },
        { name: 'Comments', value: stats?.commentsCount || 0, color: '#34D399' },
        { name: 'Active Sessions', value: realTimeData?.activeSessions || 0, color: '#059669' },
    ];

    const engagementData = [
        { name: 'Views', value: stats?.totalViews || 0, icon: <FaEye />, color: '#3B82F6' },
        { name: 'Likes', value: stats?.totalLikes || 0, icon: <FaHeart />, color: '#EF4444' },
        { name: 'Shares', value: stats?.totalShares || 0, icon: <FaShare />, color: '#8B5CF6' },
        { name: 'Reports', value: stats?.totalReports || 0, icon: <FaBug />, color: '#F59E0B' },
    ];

    const systemMetrics = [
        { label: 'Server Status', value: 'Online', status: 'success', icon: <FaServer /> },
        { label: 'Database Health', value: '98%', status: 'success', icon: <FaDatabase /> },
        { label: 'Response Time', value: '45ms', status: 'success', icon: <FaRocket /> },
        { label: 'Security Score', value: '95/100', status: 'success', icon: <FaShieldAlt /> },
    ];

    if (isStatsLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-green-500"></div>
                    <p className="text-green-400 mt-4">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-green-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="bg-gray-800 border border-green-500/20 rounded-xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img 
                                    src={user?.photoURL} 
                                    alt="admin" 
                                    className="w-16 h-16 rounded-full border-2 border-green-500"
                                />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <FaTerminal className="text-xs text-gray-900" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                                    <FaCode /> {user?.displayName}
                                </h1>
                                <p className="text-gray-400">{user?.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-1 bg-green-500 text-gray-900 rounded text-xs font-mono">
                                        ADMIN
                                    </span>
                                    <span className="px-2 py-1 bg-gray-700 text-green-400 rounded text-xs font-mono">
                                        ROOT ACCESS
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Last Login</p>
                            <p className="text-green-400 font-mono">{new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-gray-800 border border-green-500/20 rounded-xl p-1">
                    <div className="flex space-x-1">
                        {[
                            { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
                            { id: 'analytics', label: 'Analytics', icon: <HiTrendingUp /> },
                            { id: 'tags', label: 'Tag Management', icon: <FaTags /> },
                            { id: 'system', label: 'System Health', icon: <FaServer /> },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-mono text-sm ${
                                    activeTab === tab.id 
                                        ? 'bg-green-500 text-gray-900' 
                                        : 'text-gray-400 hover:text-green-400 hover:bg-gray-700'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Posts', value: stats.postsCount, icon: <FaFileAlt />, color: 'green' },
                                { label: 'Active Users', value: stats.usersCount, icon: <FaUsers />, color: 'blue' },
                                { label: 'Comments', value: stats.commentsCount, icon: <FaComments />, color: 'yellow' },
                                { label: 'Online Now', value: realTimeData?.onlineUsers || 0, icon: <FaLaptopCode />, color: 'purple' },
                            ].map((stat, index) => (
                                <div key={index} className="bg-gray-800 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                                            <div className={`text-${stat.color}-400 text-xl`}>{stat.icon}</div>
                                        </div>
                                        <div className="text-2xl font-bold text-green-400 font-mono">
                                            {stat.value?.toLocaleString() || 0}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Engagement Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {engagementData.map((metric, index) => (
                                <div key={index} className="bg-gray-800 border border-green-500/20 rounded-xl p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl" style={{ color: metric.color }}>{metric.icon}</div>
                                        <div>
                                            <p className="text-2xl font-bold text-green-400 font-mono">
                                                {metric.value?.toLocaleString() || 0}
                                            </p>
                                            <p className="text-gray-400 text-sm">{metric.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Content Distribution */}
                            <div className="bg-gray-800 border border-green-500/20 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                                    <FaChartLine /> Content Distribution
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie 
                                            data={distributionData} 
                                            dataKey="value" 
                                            nameKey="name" 
                                            cx="50%" 
                                            cy="50%" 
                                            outerRadius={80}
                                            stroke="#374151"
                                            strokeWidth={2}
                                        >
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: '#1f2937',
                                                border: '1px solid #22C55E',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Top Tags */}
                            <div className="bg-gray-800 border border-green-500/20 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                                    <FaTags /> Top Tags
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={topTags.slice(0, 6)}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="name" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: '#1f2937',
                                                border: '1px solid #22C55E',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        {/* Time Range Selector */}
                        <div className="bg-gray-800 border border-green-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-4">
                                <FaFilter className="text-green-400" />
                                <select 
                                    value={timeRange} 
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="bg-gray-700 text-green-100 border border-green-500/20 rounded px-3 py-1"
                                >
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="90d">Last 90 Days</option>
                                    <option value="1y">Last Year</option>
                                </select>
                            </div>
                        </div>

                        {/* Growth Chart */}
                        <div className="bg-gray-800 border border-green-500/20 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-green-400 mb-4">Growth Trends</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: '1px solid #22C55E',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Line type="monotone" dataKey="posts" stroke="#22C55E" strokeWidth={2} />
                                    <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                                    <Line type="monotone" dataKey="comments" stroke="#F59E0B" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Activity Heatmap */}
                        <div className="bg-gray-800 border border-green-500/20 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-green-400 mb-4">Daily Activity</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: '1px solid #22C55E',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="activity" stroke="#22C55E" fill="#22C55E" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Tags Management Tab */}
                {activeTab === 'tags' && (
                    <div className="space-y-6">
                        {/* Add Tag Form */}
                        <div className="bg-gray-800 border border-green-500/20 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                                <FaPlus /> Add New Tag
                            </h3>
                            <div className="flex gap-3">
                                <input 
                                    {...register('tagName', { required: true })} 
                                    type="text" 
                                    placeholder="Enter tag name (e.g., javascript, react, nodejs)" 
                                    className="input flex-1 bg-gray-700 border-green-500/20 text-green-100 placeholder-gray-400 focus:border-green-500"
                                />
                                <button 
                                    onClick={handleSubmit(onTagSubmit)}
                                    className="btn bg-green-500 hover:bg-green-600 text-gray-900 border-none"
                                >
                                    <FaPlus /> Add Tag
                                </button>
                            </div>
                        </div>

                        {/* Tags List */}
                        <div className="bg-gray-800 border border-green-500/20 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-green-400 mb-4">Manage Tags</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                                {allTags.map(tag => (
                                    <div key={tag._id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg border border-green-500/10">
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-400">#</span>
                                            <span className="font-mono text-green-100">{tag.name}</span>
                                            <span className="text-xs text-gray-400">({tag.count || 0})</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteTag(tag)} 
                                            className="btn btn-ghost btn-sm text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* System Health Tab */}
                {activeTab === 'system' && (
                    <div className="space-y-6">
                        {/* System Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {systemMetrics.map((metric, index) => (
                                <div key={index} className="bg-gray-800 border border-green-500/20 rounded-xl p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl text-green-400">{metric.icon}</div>
                                        <div>
                                            <p className="text-xl font-bold text-green-400 font-mono">{metric.value}</p>
                                            <p className="text-gray-400 text-sm">{metric.label}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity Log */}
                        <div className="bg-gray-800 border border-green-500/20 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                                <FaTerminal /> System Log
                            </h3>
                            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-300 max-h-60 overflow-y-auto">
                                <div className="space-y-1">
                                    <p>[{new Date().toLocaleTimeString()}] INFO: Admin dashboard loaded successfully</p>
                                    <p>[{new Date().toLocaleTimeString()}] INFO: Database connection established</p>
                                    <p>[{new Date().toLocaleTimeString()}] INFO: User authentication verified</p>
                                    <p>[{new Date().toLocaleTimeString()}] INFO: Statistics updated</p>
                                    <p>[{new Date().toLocaleTimeString()}] INFO: Real-time data synchronized</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProfile;