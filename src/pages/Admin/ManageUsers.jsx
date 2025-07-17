import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { 
    FaSearch, 
    FaUsers, 
    FaUserShield, 
    FaCrown, 
    FaSortAmountDown,
    FaCode,
    FaTerminal,
    FaUserCog,
    FaFilter,
    FaChevronDown,
    FaEye,
    FaSpinner
} from 'react-icons/fa';
import { AuthContext } from '../../providers/AuthProvider';

const ManageUsers = () => {
    const { user: loggedInAdmin } = useContext(AuthContext);
    const [search, setSearch] = useState('');
    const [membershipFilter, setMembershipFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Separate state for input
    const [isSearching, setIsSearching] = useState(false); // Loading state for search
    
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const deferredSearchTerm = React.useDeferredValue(searchTerm);

    // Debounce search to avoid too many API calls
  React.useEffect(() => {
    if (!deferredSearchTerm.trim()) return;

    setIsSearching(true);

    // Simulate API call
    const fetchData = async () => {
        await new Promise((r) => setTimeout(r, 300)); // Fake delay
        setSearch(deferredSearchTerm); // update result
        setIsSearching(false);
    };

    fetchData();
}, [deferredSearchTerm]);



    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['users', search, membershipFilter, sortBy],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search.trim()) params.append('search', search.trim());
            if (membershipFilter) params.append('membership', membershipFilter);
            if (sortBy) params.append('sortBy', sortBy);
            
            const res = await axiosSecure.get(`/users?${params.toString()}`);
            return res.data;
        },
        enabled: true // Always enabled, but with debounced search
    });

    const { mutate: changeRole } = useMutation({
        mutationFn: ({ userId, role }) => axiosSecure.patch(`/users/role/${userId}`, { role }),
        onSuccess: () => {
            Swal.fire({
                title: "✅ Operation Successful!",
                text: "User role has been updated successfully.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                background: '#1a1a1a',
                color: '#22C55E',
                customClass: {
                    popup: 'border border-green-500/30'
                }
            });
            refetch();
        },
        onError: (err) => {
            Swal.fire({
                title: "❌ Operation Failed!",
                text: err.response?.data?.message || 'Failed to update user role. Please try again.',
                icon: "error",
                confirmButtonColor: '#22C55E',
                background: '#1a1a1a',
                color: '#ef4444',
                customClass: {
                    popup: 'border border-red-500/30'
                }
            });
        },
    });

    const handleRoleChange = (user, newRole) => {
        Swal.fire({
            title: '🔐 Admin Role Management',
            html: `
                <div class="text-left space-y-3 p-4 bg-gray-800 rounded-lg border border-green-500/20">
                    <div class="flex items-center gap-2">
                        <span class="text-green-400">👤 User:</span>
                        <span class="text-green-300 font-mono">${user.name}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-green-400">📧 Email:</span>
                        <span class="text-green-300 font-mono">${user.email}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-green-400">🎯 Current Role:</span>
                        <span class="text-blue-400 font-mono">${user.role}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-green-400">🔄 New Role:</span>
                        <span class="text-yellow-400 font-mono font-bold">${newRole}</span>
                    </div>
                    <div class="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded">
                        <p class="text-orange-400 text-sm">⚠️ This action will change user permissions immediately.</p>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#22C55E',
            cancelButtonColor: '#ef4444',
            confirmButtonText: '✅ Execute Command',
            cancelButtonText: '❌ Cancel',
            background: '#1a1a1a',
            color: '#ffffff',
            customClass: {
                popup: 'border border-green-500/30',
                confirmButton: 'font-mono',
                cancelButton: 'font-mono'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading state
                Swal.fire({
                    title: '⏳ Processing...',
                    text: 'Updating user role, please wait...',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    background: '#1a1a1a',
                    color: '#22C55E',
                    customClass: {
                        popup: 'border border-green-500/30'
                    },
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                changeRole({ userId: user._id, role: newRole });
            }
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSearchTerm(''); // Clear both search states
        setMembershipFilter('');
        setSortBy('');
    };

    const showAllUsers = () => {
        clearFilters();
        refetch();
    };

    // Check if there are any active filters
    const hasActiveFilters = search || membershipFilter || sortBy;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                    <p className="text-green-400 font-mono">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-green-400 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="border-b border-green-500/20 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FaTerminal className="text-green-500 text-2xl" />
                        <h1 className="text-3xl font-bold font-mono text-green-400">
                            ./manage-users
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-green-500/80">
                        <FaUsers />
                        <span className="font-mono">Total Users: {users.length}</span>
                    </div>
                </div>

                {/* Controls Panel */}
                <div className="bg-gray-800 border border-green-500/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-green-500" />
                            <span className="font-mono text-green-400">Filters & Search</span>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden btn btn-sm btn-ghost text-green-400 hover:text-green-300"
                        >
                            <FaChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    
                    <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Search Input */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-mono text-green-400 mb-2">
                                    Search Query
                                </label>
                                <div className="relative">
                                    {isSearching ? (
                                        <FaSpinner className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 z-10 animate-spin" />
                                    ) : (
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 z-10" />
                                    )}
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-green-500/30 rounded-lg text-green-400 placeholder-green-500/50 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-mono transition-all duration-300 ease-in-out"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {isSearching && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-sm font-mono">
                                            Searching...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Membership Filter */}
                            <div>
                                <label className="block text-sm font-mono text-green-400 mb-2">
                                    Membership Filter
                                </label>
                                <select
                                    className="w-full px-3 py-3 bg-gray-900 border border-green-500/30 rounded-lg text-green-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-mono transition-all duration-300 ease-in-out"
                                    value={membershipFilter}
                                    onChange={(e) => setMembershipFilter(e.target.value)}
                                >
                                    <option value="">All Members</option>
                                    <option value="Gold">Gold Tier</option>
                                    <option value="Bronze">Bronze Tier</option>
                                </select>
                            </div>

                            {/* Sort Control */}
                            <div>
                                <label className="block text-sm font-mono text-green-400 mb-2">
                                    Sort Options
                                </label>
                                <button
                                    onClick={() => setSortBy(sortBy === 'postCount' ? '' : 'postCount')}
                                    className={`w-full px-3 py-3 rounded-lg font-mono transition-all duration-300 ease-in-out ${
                                        sortBy === 'postCount'
                                            ? 'bg-green-500 text-gray-900 hover:bg-green-400 shadow-lg'
                                            : 'bg-gray-900 text-green-400 border border-green-500/30 hover:border-green-500 hover:shadow-lg'
                                    }`}
                                >
                                    <FaSortAmountDown className="inline mr-2" />
                                    {sortBy === 'postCount' ? 'Sorted by Posts' : 'Sort by Posts'}
                                </button>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(searchTerm || membershipFilter || sortBy) && (
                            <div className="flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-300 ease-in-out font-mono"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Users Table or No Users Message */}
                {users.length === 0 && !isLoading ? (
                    <div className="bg-gray-800 border border-green-500/20 rounded-lg p-12 text-center">
                        <div className="space-y-4">
                            <FaUsers className="text-6xl text-green-500/50 mx-auto" />
                            <h3 className="text-xl font-mono text-green-400">
                                {hasActiveFilters ? 'No Users Found' : 'No Users Available'}
                            </h3>
                            <p className="text-green-500/80 font-mono">
                                {hasActiveFilters 
                                    ? 'No users match your current search criteria.' 
                                    : 'There are no users in the system yet.'
                                }
                            </p>
                            {hasActiveFilters && (
                                <div className="flex justify-center gap-4 mt-6">
                                    <button
                                        onClick={clearFilters}
                                        className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-300 ease-in-out font-mono"
                                    >
                                        Clear Filters
                                    </button>
                                    <button
                                        onClick={showAllUsers}
                                        className="px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all duration-300 ease-in-out font-mono flex items-center gap-2"
                                    >
                                        <FaEye />
                                        Show All Users
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-800 border border-green-500/20 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900">
                                    <tr className="border-b border-green-500/20">
                                        <th className="px-6 py-4 text-left text-green-400 font-mono">#</th>
                                        <th className="px-6 py-4 text-left text-green-400 font-mono">Developer</th>
                                        <th className="px-6 py-4 text-left text-green-400 font-mono">Email</th>
                                        <th className="px-6 py-4 text-center text-green-400 font-mono">Posts</th>
                                        <th className="px-6 py-4 text-center text-green-400 font-mono">Role</th>
                                        <th className="px-6 py-4 text-center text-green-400 font-mono">Membership</th>
                                        <th className="px-6 py-4 text-center text-green-400 font-mono">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id} className="border-b border-green-500/10 hover:bg-gray-800/50 transition-all duration-300 ease-in-out">
                                            <td className="px-6 py-4 font-mono text-green-500">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FaCode className="text-green-500" />
                                                    <span className="font-mono text-green-400">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-green-300">{user.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-mono text-sm">
                                                    {user.postCount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {user.email === 'admin@gmail.com' ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-mono text-sm">
                                                        <FaUserShield />
                                                        ROOT
                                                    </span>
                                                ) : user.role === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-mono text-sm">
                                                        <FaUserCog />
                                                        ADMIN
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-mono text-sm">
                                                        <FaCode />
                                                        USER
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {user.badge === 'Gold' ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-mono text-sm">
                                                        <FaCrown />
                                                        GOLD
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 font-mono text-sm">
                                                        BRONZE
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {user.email === 'admin@gmail.com' ? (
                                                    <span className="font-mono text-blue-400 text-sm">PROTECTED</span>
                                                ) : user.role === 'admin' ? (
                                                    <button
                                                        onClick={() => handleRoleChange(user, 'user')}
                                                        className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors font-mono text-sm"
                                                    >
                                                        Revoke Admin
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRoleChange(user, 'admin')}
                                                        className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors font-mono text-sm"
                                                    >
                                                        Grant Admin
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Footer Stats */}
                <div className="bg-gray-800 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm font-mono">
                        <div className="flex items-center gap-4">
                            <span className="text-green-400">
                                Total: {users.length} users
                            </span>
                            <span className="text-yellow-400">
                                Admins: {users.filter(u => u.role === 'admin').length}
                            </span>
                            <span className="text-orange-400">
                                Gold: {users.filter(u => u.badge === 'Gold').length}
                            </span>
                        </div>
                        <div className="text-green-500/60 flex items-center gap-2">
                            {isSearching && (
                                <div className="flex items-center gap-1">
                                    <FaSpinner className="animate-spin" />
                                    <span>Searching...</span>
                                </div>
                            )}
                            <span>Last updated: {new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;