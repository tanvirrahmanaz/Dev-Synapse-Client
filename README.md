# 🚀 Dev-Synapse: A Modern MERN Stack Forum (Client Side)

Welcome to the **client-side repository** of **Dev-Synapse**, a modern and feature-rich developer forum built using the **MERN stack**. It enables real-time interaction, role-based access, and an engaging UI/UX for tech communities.

🌐 **Live Site:** <a href="_https://dev-synapse-404.web.app/ ">Live Link </a> <br>
🛠️ **Server Code:** _[Server Repo URL]_

---

## 🧩 Key Features

### 🟦 General Features

- **🔐 Authentication**: Firebase-powered login (Email/Password + Google)
- **🏠 Dynamic Homepage**: Posts listed with pagination (5 per page), newest first
- **🏷️ Tag-Based Search**: Filter posts by relevant tags
- **🔥 Popularity Sort**: Sort posts based on score (upvotes - downvotes)
- **📄 Post Details**: View post content, votes, and comments
- **👍 Advanced Voting**: Vote once, undo, or switch vote (YouTube-style)
- **💬 Comments**: Authenticated users can comment on any post
- **🚨 Reporting**: Report posts/comments for admin review
- **🔗 Social Sharing**: Share posts via Facebook, WhatsApp, etc.
- **📢 Announcements**: Admin messages shown with navbar badge for unseen ones
- **📱 Responsive UI**: Fully optimized for all screen sizes

---

### 👤 User Dashboard (Private)

- **🧑 My Profile**: Name, image, email, badge (Bronze/Gold), 3 latest posts
- **➕ Add Post**: Rich post form; Bronze: max 5 posts, Gold: unlimited
- **📋 My Posts**: View/delete your posts, see related comments
- **💳 Membership**: Upgrade to Gold with Stripe-powered secure checkout

---

### 🛡 Admin Dashboard (Role-Protected)

- **📊 Analytics**: View total users, posts, and comments (Pie chart)
- **🏷️ Tag Management**: Add or remove site-wide tags
- **👥 Manage Users**: Filter/search by name/email, update roles
- **📢 Make Announcement**: Post updates across the site
- **🧾 Reported Activities**: View all reported content and take action

---

## ⚙️ Technologies Used

| Category              | Tools Used                                                   |
|-----------------------|--------------------------------------------------------------|
| **Frontend Core**     | React, Vite                                                  |
| **Routing**           | React Router DOM                                             |
| **Styling**           | Tailwind CSS, DaisyUI                                        |
| **State Management**  | TanStack Query (React Query)                                 |
| **API Handling**      | Axios (custom hooks for public & private requests)           |
| **Authentication**    | Firebase                                                     |
| **Forms**             | React Hook Form                                              |
| **Notifications**     | React Hot Toast, SweetAlert2                                 |
| **Icons & Charts**    | React Icons, Recharts                                        |
| **Social Sharing**    | React Share                                                  |
| **Payments**          | Stripe.js, React Stripe.js                                   |

---

## 🛠 Local Setup

Follow these steps to run the project locally:

```bash
# 1. Clone the repo
git clone https://github.com/your-username/your-client-repo.git

# 2. Move into project directory
cd your-client-repo

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

App will be live at: http://localhost:5173

🔐 Environment Variables
Create a .env.local file in the root of your project and add the following:
```bash
# Backend URL
VITE_API_URL=http://localhost:5000

# Firebase Config
VITE_APIKEY=your_firebase_apikey
VITE_AUTHDOMAIN=your_firebase_authdomain
VITE_PROJECTID=your_firebase_projectid
VITE_STORAGEBUCKET=your_firebase_storagebucket
VITE_MESSAGINGSENDERID=your_firebase_messagingsenderid
VITE_APPID=your_firebase_appid

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...your_key...

# ImgBB
VITE_IMGBB_API_KEY=your_imgbb_api_key
⚠ Note: This is the client-side app. You must also run the server-side for full functionality.
```
🤝 Contributing
Contributions are welcome!
Please fork the repo, create a feature branch, and submit a pull request.

📄 License
Licensed under the MIT License.
