
import React from 'react';
import { FaUserSecret } from 'react-icons/fa';

const Avatar = ({ user, size = 'h-9 w-9' }) => {
    if (user?.photoURL) {
        return (
            <img
                className={`${size} rounded-full object-cover border-2 border-green-400/50`}
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
            />
        );
    }

    if (user?.displayName) {
        return (
            <div
                className={`${size} flex items-center justify-center rounded-full bg-gray-700 text-green-400 font-bold text-lg border-2 border-green-400/50`}
            >
                {user.displayName.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div
            className={`${size} flex items-center justify-center rounded-full bg-gray-800 text-green-400 border-2 border-green-400/50`}
        >
            <FaUserSecret className="h-5 w-5" />
        </div>
    );
};

export default Avatar;
