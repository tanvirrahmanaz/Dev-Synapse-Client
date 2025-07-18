import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaTerminal, FaCode, FaBug, FaRedo } from 'react-icons/fa';

const ErrorPage = () => {
    // react-router-dom থেকে এররের বিস্তারিত তথ্য আনার জন্য
    const error = useRouteError();
    console.error(error);

    const getErrorCode = () => {
        if (error?.status) return error.status;
        if (error?.message?.includes('404')) return '404';
        if (error?.message?.includes('500')) return '500';
        return 'ERR';
    };

    const getErrorMessage = () => {
        const status = getErrorCode();
        switch (status) {
            case '404':
                return 'Page Not Found';
            case '500':
                return 'Internal Server Error';
            default:
                return error?.statusText || 'Something went wrong';
        }
    };

    const getErrorDescription = () => {
        const status = getErrorCode();
        switch (status) {
            case '404':
                return 'The requested resource could not be found on this server.';
            case '500':
                return 'The server encountered an internal error and was unable to complete your request.';
            default:
                return 'An unexpected error occurred. Please try again later.';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-green-400 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Terminal Header */}
                <div className="bg-gray-800 rounded-t-lg border border-green-500/20 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-gray-400 font-mono text-sm">
                            error_handler.js - Terminal
                        </span>
                    </div>
                </div>

                {/* Main Error Content */}
                <div className="bg-gray-800 border-x border-green-500/20 p-8 text-center">
                    {/* ASCII Art Style Error Icon */}
                    <div className="mb-8">
                        <pre className="text-green-500 font-mono text-sm leading-tight">
{`     _______________
    /               \\
   /    ERROR ${getErrorCode()}    \\
  /___________________\\
         |       |
         |  ! !  |
         |   o   |
         |  \\_/  |
         |_______|
            |||
            |||
         ___|||___`}
                        </pre>
                    </div>

                    {/* Error Code Display */}
                    <div className="mb-6">
                        <div className="inline-block bg-gray-900 rounded-lg px-6 py-4 border border-green-500/30">
                            <div className="flex items-center gap-3">
                                <FaTerminal className="text-green-500 text-2xl" />
                                <div className="font-mono">
                                    <span className="text-green-500">$ </span>
                                    <span className="text-red-400">error_code: </span>
                                    <span className="text-yellow-400 text-3xl font-bold">
                                        {getErrorCode()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-4xl font-bold text-green-300 mb-4 font-mono">
                        {getErrorMessage()}
                    </h1>

                    {/* Error Description */}
                    <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-green-500/10">
                        <p className="text-gray-300 font-mono text-lg leading-relaxed">
                            <span className="text-green-500"># </span>
                            {getErrorDescription()}
                        </p>
                        
                        {/* Technical Details */}
                        {error?.message && (
                            <div className="mt-4 p-4 bg-gray-800 rounded border border-red-500/20">
                                <p className="text-red-400 font-mono text-sm">
                                    <FaBug className="inline mr-2" />
                                    Debug: {error.message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/"
                            className="group flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-gray-900 font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/25"
                        >
                            <FaHome className="group-hover:animate-bounce" />
                            <span className="font-mono">Go Home</span>
                        </Link>

                        <button
                            onClick={() => window.location.reload()}
                            className="group flex items-center gap-3 px-8 py-4 bg-gray-700 hover:bg-gray-600 text-green-400 font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 border border-green-500/30"
                        >
                            <FaRedo className="group-hover:animate-spin" />
                            <span className="font-mono">Retry</span>
                        </button>
                    </div>

                    {/* Terminal Command Suggestions */}
                    <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-green-500/10">
                        <h3 className="text-green-400 font-mono text-lg mb-4">
                            <FaCode className="inline mr-2" />
                            Suggested Commands:
                        </h3>
                        <div className="space-y-2 text-left">
                            <div className="font-mono text-sm">
                                <span className="text-green-500">$ </span>
                                <span className="text-gray-400">navigate </span>
                                <Link to="/" className="text-green-400 hover:text-green-300 underline">
                                    --home
                                </Link>
                            </div>
                            <div className="font-mono text-sm">
                                <span className="text-green-500">$ </span>
                                <span className="text-gray-400">check </span>
                                <Link to="/announcements" className="text-green-400 hover:text-green-300 underline">
                                    --announcements
                                </Link>
                            </div>
                            <div className="font-mono text-sm">
                                <span className="text-green-500">$ </span>
                                <span className="text-gray-400">contact </span>
                                <Link to="/contact" className="text-green-400 hover:text-green-300 underline">
                                    --support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terminal Footer */}
                <div className="bg-gray-700 rounded-b-lg border border-green-500/20 p-4">
                    <div className="flex items-center justify-between font-mono text-sm">
                        <div className="flex items-center gap-2 text-green-400">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span>Error Handler Active</span>
                        </div>
                        <div className="text-gray-400">
                            Session: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                {/* Fun Developer Message */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 font-mono text-sm">
                        <span className="text-green-500"># </span>
                        Don't worry, even the best developers encounter errors. 
                        <span className="text-green-400"> Keep coding! 🚀</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;