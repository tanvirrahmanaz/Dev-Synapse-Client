
import React from 'react';
import { FaUserSecret } from 'react-icons/fa';

const Avatar = ({ user, size = 'h-9 w-9' }) => {
    const displayName = user?.displayName || 'Anonymous';
    const photoURL = user?.photoURL;

    if (photoURL) {
        return (
            <img
                className={`${size} rounded-full object-cover border-2 border-green-400/50`}
                src={photoURL}
                alt={displayName}
            />
        );
    }

    return (
        <div
            className={`${size} flex items-center justify-center rounded-full bg-gray-700 text-green-400 font-bold text-lg border-2 border-green-400/50`}
            title={displayName} // Tooltip হিসেবে পুরো নাম দেখানো হচ্ছে
        >
            {displayName.charAt(0).toUpperCase()}
        </div>
    );
};

export default Avatar;
