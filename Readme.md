# BookClub

A full-stack web application for book lovers to explore genres, manage a personal bookshelf, and connect with reading communities.

**Live:** [bookclub-d5y4.onrender.com](https://bookclub-d5y4.onrender.com)

---

## Features

- Browse curated books across 8 genres via Open Library API
- Personal bookshelf with reading status tracking (Want to Read / Reading / Finished)
- Add notes, reviews, ratings, and quotes to any book
- Create and join genre-based reading communities with group chat
- User profiles with reading stats and favourite genres
- Admin dashboard for managing users and communities
- Secure authentication with hashed passwords

## Tech Stack

Node.js · Express.js · MongoDB · Mongoose · EJS · Tailwind CSS · Passport.js · Multer · Axios

## Getting Started

```bash
git clone https://github.com/Saxshii/bookclub.git
cd bookclub
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_secret
PORT=3000
NODE_ENV=development
```

```bash
npm run dev   # development
npm start     # production
```

## Deployment

Deployed on Render with MongoDB Atlas.

| Variable | Value |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `SESSION_SECRET` | Strong random string |
| `NODE_ENV` | `production` |

Build: `npm install` · Start: `node app.js`

---

Developed by [Sakshi](https://github.com/Saxshii)