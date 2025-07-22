Dev-Synapse: A Modern MERN Stack Forum (Client Side)
Welcome to the client-side repository for Dev-Synapse, a dynamic and feature-rich online forum built for developers to connect, share knowledge, and engage in technical discussions. This application is built with the MERN stack, featuring real-time updates, role-based access control, and a rich user experience.

Live Site URL | Server Side Code

Key Features
This platform is packed with features for both regular users and administrators to ensure a seamless and engaging community experience.

General Features
User Authentication: Secure user registration and login system using Firebase, including email/password and Google social login.

Dynamic Homepage: Displays all posts with pagination (5 posts per page), sorted by newest first.

Tag-Based Search: A powerful search functionality allowing users to find posts based on relevant tags.

Popularity Sort: Users can sort the posts based on a popularity score calculated from upvotes and downvotes.

Post Details Page: A dedicated page for each post showing detailed information, comments, and interaction options.

Advanced Voting System: YouTube-style upvote/downvote system where a user can vote only once, undo their vote, or switch their vote.

Interactive Commenting: Logged-in users can add comments to any post.

Content Reporting: Users can report both posts and comments with specific feedback for admin review.

Social Sharing: Posts can be easily shared on platforms like Facebook and WhatsApp.

Announcements: Admins can create announcements that are displayed on the homepage with a notification badge on the navbar for unseen announcements.

Fully Responsive Design: The UI is optimized for desktop, tablet, and mobile devices.

User Dashboard (Private)
My Profile: Displays user's name, image, email, and membership badge (Bronze/Gold), along with their 3 most recent posts.

Add Post: A feature-rich form for creating new posts. Normal users are limited to 5 posts, while Gold members have unlimited access.

My Posts: A table view of all posts created by the user, with options to view comments and delete the post.

Membership Page: A secure page with a Stripe-powered checkout form for users to upgrade to a Gold membership.

Admin Dashboard (Private & Role-Protected)
Admin Profile: An analytics dashboard showing site-wide statistics (total users, posts, comments) visualized with a pie chart.

Tag Management: Admins can add and remove tags for the entire site.

Manage Users: A comprehensive user management table with server-side search by name/email and filtering by membership status. Admins can promote other users to an admin role or revoke admin status.

Make Announcement: A dedicated form for admins to create and publish site-wide announcements.

Reported Activities: A centralized page to view all user-submitted reports on posts and comments, with options for the admin to take action (e.g., delete the offending content).

Technologies Used
This project leverages a modern and powerful stack to deliver a high-performance user experience.

Frontend:

Core: React, Vite

Routing: React Router DOM

Styling: Tailwind CSS, DaisyUI

State Management & Data Fetching: Tanstack Query (React Query)

API Calls: Axios (with custom hooks for public and secure instances)

Authentication: Firebase

Forms: React Hook Form

Notifications: React Hot Toast, SweetAlert2

Icons: React Icons

Charts: Recharts

Social Sharing: React Share

Payments: Stripe.js, React Stripe.js

Setup and Installation
To run this project locally, follow these steps:

Clone the repository:

Bash

git clone https://github.com/your-username/your-client-repo.git
Navigate to the project directory:

Bash

cd your-client-repo
Install dependencies:

Bash

npm install
Create a .env.local file in the root of the project and add your environment variables. See the template below.

Start the development server:

Bash

npm run dev
The application should now be running on http://localhost:5173.

Environment Variables
You need to create a .env.local file in the root of the client directory and add the following variables:

Code snippet

# Your Backend Server URL
VITE_API_URL=http://localhost:5000

# Your Firebase Project Configuration
VITE_APIKEY=your_firebase_apikey
VITE_AUTHDOMAIN=your_firebase_authdomain
VITE_PROJECTID=your_firebase_projectid
VITE_STORAGEBUCKET=your_firebase_storagebucket
VITE_MESSAGINGSENDERID=your_firebase_messagingsenderid
VITE_APPID=your_firebase_appid

# Your Stripe Publishable Key (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...your_stripe_publishable_key...

# Your ImgBB API Key (for image uploads)
VITE_IMGBB_API_KEY=your_imgbb_api_key
Note: This is the client-side application. For full functionality, the corresponding server-side application must also be running.