import React from 'react';

const Banner = ({ onSearch }) => {
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const tag = e.target.search.value;
        onSearch(tag);
    };

    return (
        <div className="hero min-h-[400px]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop)' }}>
            <div className="hero-overlay bg-opacity-70"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">Welcome to Dev-Synapse</h1>
                    <p className="mb-5">Connect, Share, and Grow with a community of developers.</p>
                    
                    <form onSubmit={handleFormSubmit} className="flex gap-2">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by tags (e.g., react, js)"
                            className="input input-bordered w-full text-gray-800"
                        />
                        <button type="submit" className="btn btn-primary bg-green-500 hover:bg-green-600 border-none">
                            Search
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Banner;