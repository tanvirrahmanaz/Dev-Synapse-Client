import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { 
    FaTrash, 
    FaInfoCircle, 
    FaThList, 
    FaFileAlt, 
    FaCommentAlt, 
    FaExclamationTriangle,
    FaSearch,
    FaFilter,
    FaEye,
    FaCode,
    FaTerminal,
    FaShieldAlt
} from 'react-icons/fa';

const ReportedActivities = () => {
    const [filter, setFilter] = useState(''); // ফিল্টারের জন্য স্টেট
    const [searchTerm, setSearchTerm] = useState(''); // সার্চের জন্য স্টেট
    const [selectedReport, setSelectedReport] = useState(null); // বিস্তারিত দেখার জন্য
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Tanstack Query দিয়ে ফিল্টার অনুযায়ী রিপোর্ট আনা হচ্ছে
    const { data: reports = [], isLoading, refetch } = useQuery({
        queryKey: ['reports', filter], // ফিল্টার পরিবর্তন হলে কোয়েরি রি-রান হবে
        queryFn: async () => (await axiosSecure.get(`/reports?type=${filter}`)).data
    });

    // সার্চ ফিল্টার করা reports
    const filteredReports = reports.filter(report => {
        const searchLower = searchTerm.toLowerCase();
        return (
            report.feedback?.toLowerCase().includes(searchLower) ||
            report.reporterEmail?.toLowerCase().includes(searchLower) ||
            report.commentText?.toLowerCase().includes(searchLower) ||
            report.targetId?.toLowerCase().includes(searchLower)
        );
    });

    // ব্যবস্থা নেওয়ার জন্য useMutation (এখন আরও ডাইনামিক)
    const takeActionMutation = useMutation({
        mutationFn: async ({ report }) => {
            // রিপোর্টের ধরন অনুযায়ী সঠিক API কল করা হচ্ছে
            if (report.type === 'comment') {
                await axiosSecure.delete(`/comments/${report.commentId}`);
            } else if (report.type === 'post') {
                await axiosSecure.delete(`/posts/${report.targetId}`); // targetId তে postId থাকবে
            }
            // সবশেষে রিপোর্টটি ডিলিট করা হচ্ছে
            await axiosSecure.delete(`/reports/${report._id}`);
        },
        onSuccess: () => {
            toast.success('🛡️ Action taken successfully!');
            refetch(); // তালিকা রিফ্রেশ করার জন্য
        },
        onError: () => toast.error('❌ Failed to take action.')
    });

    // রিপোর্ট dismiss করার জন্য নতুন mutation
    const dismissReportMutation = useMutation({
        mutationFn: async (reportId) => {
            await axiosSecure.delete(`/reports/${reportId}`);
        },
        onSuccess: () => {
            toast.success('📋 Report dismissed successfully!');
            refetch();
        },
        onError: () => toast.error('❌ Failed to dismiss report.')
    });

    const handleTakeAction = (report) => {
        if (window.confirm(`⚠️ This will permanently delete the reported content and the report itself. Are you sure?`)) {
            takeActionMutation.mutate({ report });
        }
    };

    const handleDismissReport = (reportId) => {
        if (window.confirm('📋 This will dismiss the report without deleting the content. Continue?')) {
            dismissReportMutation.mutate(reportId);
        }
    };

    const getReportTypeIcon = (type) => {
        switch (type) {
            case 'comment':
                return <FaCommentAlt className="text-green-400" />;
            case 'post':
                return <FaFileAlt className="text-blue-400" />;
            default:
                return <FaInfoCircle className="text-gray-400" />;
        }
    };

    const getReportSeverityColor = (reason) => {
        const severityMap = {
            'spam': 'text-yellow-400',
            'inappropriate': 'text-red-400',
            'harassment': 'text-red-500',
            'misinformation': 'text-orange-400',
            'violation': 'text-pink-400',
            'other': 'text-gray-400'
        };
        return severityMap[reason?.toLowerCase()] || 'text-gray-400';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
                    <p className="text-green-400 font-mono">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-green-400 p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <FaShieldAlt className="text-3xl text-green-400" />
                    <h1 className="text-4xl font-bold font-mono text-green-400">
                        <span className="text-green-500">~/</span>reported_activities
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-mono">
                    <FaTerminal className="text-green-400" />
                    <span>Total Reports: </span>
                    <span className="text-green-400 font-bold">{filteredReports.length}</span>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
                {/* Search Bar */}
                <div className="relative mb-4">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('')}
                        className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 flex items-center gap-2 ${
                            filter === '' 
                                ? 'bg-green-600 text-white border-green-500' 
                                : 'bg-gray-700 text-green-400 border-gray-600 hover:bg-gray-600'
                        } border`}
                    >
                        <FaThList /> All Reports
                    </button>
                    <button
                        onClick={() => setFilter('post')}
                        className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 flex items-center gap-2 ${
                            filter === 'post' 
                                ? 'bg-blue-600 text-white border-blue-500' 
                                : 'bg-gray-700 text-green-400 border-gray-600 hover:bg-gray-600'
                        } border`}
                    >
                        <FaFileAlt /> Posts
                    </button>
                    <button
                        onClick={() => setFilter('comment')}
                        className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 flex items-center gap-2 ${
                            filter === 'comment' 
                                ? 'bg-green-600 text-white border-green-500' 
                                : 'bg-gray-700 text-green-400 border-gray-600 hover:bg-gray-600'
                        } border`}
                    >
                        <FaCommentAlt /> Comments
                    </button>
                </div>
            </div>

            {/* Reports Section */}
            {filteredReports.length === 0 ? (
                <div className="text-center p-12 bg-gray-800 rounded-lg border border-gray-700">
                    <FaCode className="mx-auto text-6xl text-gray-600 mb-4" />
                    <p className="text-gray-400 font-mono text-lg">No reports found matching your criteria</p>
                    <p className="text-gray-500 font-mono mt-2">System status: All clear 🟢</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReports.map((report, index) => (
                        <div key={report._id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-green-500 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Report Header */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-green-400 font-mono text-sm">#{index + 1}</span>
                                        {getReportTypeIcon(report.type)}
                                        <span className="text-gray-300 font-mono text-sm">
                                            {report.type === 'comment' ? 'Comment Report' : 'Post Report'}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-mono ${getReportSeverityColor(report.feedback)} bg-gray-700`}>
                                            {report.feedback}
                                        </span>
                                    </div>

                                    {/* Report Content */}
                                    <div className="mb-3">
                                        <p className="text-gray-300 font-mono text-sm mb-1">Content:</p>
                                        <div className="bg-gray-700 rounded p-3 border-l-4 border-green-500">
                                            <p className="text-gray-200 font-mono text-sm break-all">
                                                {report.type === 'comment' 
                                                    ? report.commentText 
                                                    : `Post ID: ${report.targetId}`
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reporter Info */}
                                    <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
                                        <span>Reporter: <span className="text-green-400">{report.reporterEmail}</span></span>
                                        <span>Date: <span className="text-green-400">{new Date(report.createdAt || Date.now()).toLocaleDateString()}</span></span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => setSelectedReport(selectedReport === report._id ? null : report._id)}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center gap-2 text-sm font-mono"
                                        title="View Details"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleDismissReport(report._id)}
                                        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300 flex items-center gap-2 text-sm font-mono"
                                        title="Dismiss Report"
                                    >
                                        <FaInfoCircle />
                                    </button>
                                    <button
                                        onClick={() => handleTakeAction(report)}
                                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 flex items-center gap-2 text-sm font-mono"
                                        title="Delete Content"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {selectedReport === report._id && (
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                                        <h4 className="text-green-400 mb-2">📋 Report Details:</h4>
                                        <div className="space-y-2 text-gray-300">
                                            <p><span className="text-green-400">ID:</span> {report._id}</p>
                                            <p><span className="text-green-400">Type:</span> {report.type}</p>
                                            <p><span className="text-green-400">Reason:</span> {report.feedback}</p>
                                            <p><span className="text-green-400">Reporter:</span> {report.reporterEmail}</p>
                                            {report.commentId && (
                                                <p><span className="text-green-400">Comment ID:</span> {report.commentId}</p>
                                            )}
                                            {report.targetId && (
                                                <p><span className="text-green-400">Target ID:</span> {report.targetId}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Stats */}
            <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between text-sm font-mono text-gray-400">
                    <span>System Status: <span className="text-green-400">Active</span></span>
                    <span>Reports Processed: <span className="text-green-400">{filteredReports.length}</span></span>
                    <span>Actions Pending: <span className="text-yellow-400">{filteredReports.length}</span></span>
                </div>
            </div>
        </div>
    );
};

export default ReportedActivities;