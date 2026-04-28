# HireNova
A full-stack job portal built with the MERN stack where job seekers can find and apply for jobs, and employers can post listings and manage applicants — all in one place.

🌐 **Live Demo:** [https://hirenova-lime.vercel.app](https://hirenova-lime.vercel.app)

---

## What I Built

I wanted to build something real — not just a todo app. HireNova is a complete job portal with two user roles, a custom dark UI, JWT authentication, file uploads, and full deployment. It covers everything from user registration to employers downloading resumes.

---

## Features

**Job Seekers**
- Browse and filter jobs by category, location, and type
- Apply with resume upload and cover letter
- Save jobs, track application status, manage profile

**Employers**
- Create company profile and post job listings
- View applicants, download resumes, update application status

**General**
- JWT authentication with HTTP-only cookies
- Role-based access (Job Seeker / Employer)
- Dark glassmorphism UI with smooth animations
- Fully responsive across all devices

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Tailwind CSS, Zustand, Axios |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| File Upload | Multer |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/SohelTS/HireNova.git
cd HireNova

# Backend setup
cd backend
npm install

# Create .env file with these values
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

npm run dev

# Frontend setup (open new terminal)
cd ../frontend
npm install
npm run dev
```

---

## What I Learned

This project taught me how a real full-stack application comes together — handling auth with cookies, role-based routing, file uploads, connecting everything end-to-end, and finally deploying it live. The hardest part was getting MongoDB SRV DNS to work on a restricted network — ended up switching to a direct connection string which fixed it!

---

## Author

**Sohel Shaikh**
[![GitHub](https://img.shields.io/badge/GitHub-SohelTS-181717?style=flat&logo=github)](https://github.com/SohelTS)

---

<div align="center">
  <p>⭐ Star this repo if you found it useful!</p>
</div>

