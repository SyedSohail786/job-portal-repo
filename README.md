# 🧑‍💼 Job Portal – Full Stack MERN Application

This is a **Full Stack Job Portal** built using **MongoDB**, **Express.js**, **React**, and **Node.js**. It allows users to search and apply for jobs, while admins can post jobs and manage applicants.

---

## 📁 Project Structure

job-portal/

├── client/ # User-facing frontend (React + Vite)

├── admin/ # Admin dashboard frontend

├── server/ # Express backend

├── uploads/ # Uploaded company logos, resumes, etc.

└── README.md


---

## 🚀 Getting Started

Follow the steps below to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/job-portal.git
cd job-portal
```

## 🔧 Environment Variables

⚠️ Don’t forget to create .env files in each of the following folders: client/, admin/, and server/

 ✅ .env for server/

DATABASE_URI='mongodb://127.0.0.1:27017/'

DATABASE_NAME="jobs-portal"

PORTNUMBER=8000


CLERK_WEBHOOK_KEY=""

MONGO_ATLAS="YOUR_MONGO_ATLAS_URL"

SECRET_KEY="YOUR_SECRET_KEY_FOR_JWT"

📧 Mailing Credentials

MAILING_HOST="YOUR_MAIL_HOST"

NODEMAILING_EMAIL="YOUR_EMAIL@example.com"

NODEMAILING_PASSWORD="YOUR_EMAIL_PASSWORD"


 🔍 Sentry (Optional Monitoring)
SENTRY_DSN="YOUR_SENTRY_URL"

 ✅ .env for client/
 
VITE_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_KEY"

VITE_WEBSITE_API_BASE_URL="http://localhost:8000"


 ✅ .env for admin/
 
VITE_ADMIN_PATH="http://localhost:8000/admin/"

VITE_WEBSITE_PATH="http://localhost:8000/website/"

VITE_STATIC_PATH="http://localhost:8000/"


## 🛠️ Run the Project

1. Start the Backend
cd server
npm install
npm run dev OR nodemon index.js

2. Start the Client (User Side)
cd admin
npm install
npm run dev

3. Start the Admin Panel
cd admin
npm install
npm run dev

## 💡 Features
🔐 JWT Authentication with Clerk Integration

📄 Job Listings & Applications

👨‍💼 Admin Dashboard to Manage Jobs & Users

📤 Resume Uploads

📧 Email Notifications (via Nodemailer)

🎯 Action Tracking (Applied, Shortlisted, etc.)

## 🤝 Contributing
Feel free to fork the repo and submit a pull request with improvements or bug fixes!

## 📄 License
This project is licensed under the MIT License.

## ✨ Author

 Syed Sohail

 📧 sohailsyed7867123@gmail.com

