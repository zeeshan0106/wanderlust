# 🌍 Wanderlust — Property Listing Web Application

![Node.js](https://img.shields.io/badge/Node.js-v24.13.1-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-v5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_v9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-v4.0.1-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-v1.41.3-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

> A full-stack property listing platform where users can discover, create, and manage property listings — complete with cloud image uploads, reviews, secure session-based authentication, search functionality, and centralized error handling.

---

## 🔗 Live Demo

**[👉 View Deployed Application](<https://wanderlust-f39o.onrender.com/)**

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [RESTful Routes](#-restful-routes)
- [Environment Variables](#-environment-variables)
- [Local Installation](#-local-installation)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [Learning Outcomes](#-learning-outcomes)
- [Author](#-author)

---

## 🧭 Overview

**Wanderlust** is a full-stack property listing web application built with the **Node.js + Express 5 + MongoDB** stack, following a clean **MVC (Model–View–Controller)** architecture.

The project demonstrates real-world backend development practices including:

- ✅ Secure session-based authentication with **Passport.js** and **MongoDB session store**
- ✅ Cloud image uploads via **Cloudinary + Multer**
- ✅ Server-side validation using **Joi**
- ✅ Centralized async error handling with a custom `ExpressError` class
- ✅ Cascade deletion — reviews are automatically removed when their parent listing is deleted
- ✅ Modular routing with dedicated controllers per resource
- ✅ Search functionality for listings
- ✅ Flash messaging for user feedback

---

## ✨ Key Features

### 🏠 Property Listings
- Browse all available property listings
- Search listings via `/listings/search`
- Create new listings with title, description, price, location, country, and image
- View full details of individual listings
- Edit or delete your own listings (owner-only access enforced server-side)

### 🔐 Authentication & Authorization
- Register (`/signup`) and log in (`/login`) securely
- `passport-local-mongoose` handles password hashing and salting automatically
- Sessions stored in **MongoDB Atlas** via `connect-mongo` (persistent across server restarts)
- Session cookies expire after **7 days** with `httpOnly` flag enabled
- Authorization middleware (`isOwner`, `isReviewAuthor`) guards all protected routes

### 🖼️ Image Uploads
- Images uploaded via **Multer** and stored on **Cloudinary**
- Stored in the `wamderlust_DEV` Cloudinary folder
- Accepts `png`, `jpg`, and `jpeg` formats
- Image `url` and `filename` saved directly in the Listing document

### ⭐ Reviews System
- Authenticated users can post reviews with a **rating (1–5)** and a comment
- Each review stores its `author` as a MongoDB reference to the User
- Review authors can delete only their own reviews (`isReviewAuthor` middleware)
- Reviews are **cascade deleted** when their parent listing is deleted via a Mongoose `post("findOneAndDelete")` hook

### 🔍 Search
- Dedicated search route at `GET /listings/search`
- Allows users to find listings without browsing the entire list

### ⚠️ Centralized Error Handling
- Custom `ExpressError` class for structured errors with `status` and `message`
- `wrapAsync` utility wraps all async route handlers, eliminating repetitive try-catch blocks
- Catch-all `app.all(/(.*)/)` route returns a clean 404 for unmatched URLs
- Single error-rendering middleware serves `listings/error.ejs` with the correct HTTP status

---

## 🛠️ Technology Stack

| Category | Technology | Version |
|---|---|---|
| Runtime | Node.js | v24.13.1 |
| Web Framework | Express.js | ^5.2.1 |
| Database | MongoDB + Mongoose | ^9.2.1 |
| Templating | EJS + EJS-Mate | ^4.0.1 / ^4.0.0 |
| Styling | Bootstrap 5 + Custom CSS | — |
| Authentication | Passport.js + passport-local | ^0.7.0 |
| User Model Plugin | passport-local-mongoose | ^9.0.1 |
| Session Store | connect-mongo | ^6.0.0 |
| Flash Messages | connect-flash | ^0.1.1 |
| Image Storage | Cloudinary + Multer | ^1.41.3 / ^2.0.2 |
| Multer Adapter | multer-storage-cloudinary | ^4.0.0 |
| Validation | Joi | ^18.0.2 |
| HTTP Method Override | method-override | ^3.0.0 |
| Environment Config | dotenv | ^17.3.1 |

---

## 🏗️ Architecture

The application follows the **MVC (Model–View–Controller)** pattern:

```
┌──────────────────────────────────────────────┐
│              Client (Browser)                 │
│           HTTP Request → port 8080            │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│           Middleware Layer                    │
│  session │ passport │ flash │ method-override │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│              Routes Layer                     │
│  /listings  │  /listings/:id/review  │  /     │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│           Controllers Layer                   │
│   listings.js  │  review.js  │  users.js      │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│              Models Layer                     │
│    Listing  │  Review  │  User (Mongoose)     │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│          MongoDB Atlas (Cloud DB)             │
│   Sessions also persisted here via            │
│              connect-mongo                    │
└───────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Wanderlust/
│
├── controllers/                  # Business logic per resource
│   ├── listings.js
│   ├── review.js
│   └── users.js
│
├── init/                         # Database seed scripts
│   ├── data.js
│   └── init.js
│
├── models/                       # Mongoose schemas
│   ├── listing.js                # Cascade deletes reviews on removal
│   ├── review.js                 # Rating 1–5, author ref
│   └── user.js                   # passport-local-mongoose plugin
│
├── public/                       # Static assets served by Express
│   ├── css/
│   └── js/
│
├── routes/                       # Express routers
│   ├── listings.js               # Full CRUD + search
│   ├── reviews.js                # Create & delete reviews
│   └── user.js                   # Signup, login, logout
│
├── utils/                        # Helper utilities
│   ├── ExpressError.js           # Custom error class
│   └── wrapAsync.js              # Async error wrapper
│
├── views/                        # EJS templates
│   ├── includes/                 # Navbar, footer partials
│   ├── layouts/                  # EJS-Mate base layout
│   ├── listings/
│   │   ├── index.ejs
│   │   ├── index2.ejs
│   │   ├── new.ejs
│   │   ├── edit.ejs
│   │   ├── show.ejs
│   │   └── error.ejs
│   └── users/
│
├── .env                          # Environment variables (never commit!)
├── .gitignore
├── cloudConfig.js                # Cloudinary + Multer storage config
├── index.js                      # App entry point (port 8080)
├── middleware.js                 # isLoggedIn, isOwner, validateListing, etc.
├── schema.js                     # Joi validation schemas
├── package.json
└── package-lock.json
```

---

## 🗄️ Database Design

The application uses **MongoDB Atlas** with Mongoose for schema definition and ObjectId references.

### Listing Schema
```js
{
  title:       String (required),
  description: String (required),
  image:       { url: String, filename: String },
  price:       Number,
  location:    String,
  country:     String,
  reviews:     [ObjectId → Review],
  owner:       ObjectId → User
}
// Mongoose post hook: auto-deletes all linked reviews when a listing is deleted
```

### Review Schema
```js
{
  comment:   String,
  rating:    Number (min: 1, max: 5),
  createdAt: Date (default: Date.now),
  author:    ObjectId → User
}
```

### User Schema
```js
{
  email:    String (required),
  // username + hashed password managed automatically by passport-local-mongoose
}
```

### Relationships
```
User ──────< Listing    (one user owns many listings)
Listing ───< Review     (one listing has many reviews)
User ──────< Review     (one user writes many reviews)

Cascade Rule: Listing deleted → all its Reviews are auto-deleted
```

---

## 🔀 RESTful Routes

### Listings (`/listings`)

| Method | Route | Middleware | Description |
|--------|-------|------------|-------------|
| GET | `/listings` | — | View all listings |
| POST | `/listings` | isLoggedIn, validateListing, upload | Create new listing |
| GET | `/listings/new` | isLoggedIn | Render new listing form |
| GET | `/listings/search` | — | Search listings |
| GET | `/listings/:id` | — | View listing details |
| GET | `/listings/:id/edit` | isLoggedIn, isOwner | Render edit form |
| PUT | `/listings/:id` | isLoggedIn, isOwner, upload, validateListing | Update listing |
| DELETE | `/listings/:id` | isLoggedIn, isOwner | Delete listing |

### Reviews (`/listings/:id/review`)

| Method | Route | Middleware | Description |
|--------|-------|------------|-------------|
| POST | `/listings/:id/review` | validateReview, isLoggedIn | Create a review |
| DELETE | `/listings/:id/review/:reviewId` | isLoggedIn, isReviewAuthor | Delete a review |

### Users (`/`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/signup` | Render signup form |
| POST | `/signup` | Register new user |
| GET | `/login` | Render login form |
| POST | `/login` | Authenticate via Passport local strategy |
| GET | `/logout` | Log out current user |

---

## 🔑 Environment Variables

Create a `.env` file in the project root. **Never commit this file.**

```env
# MongoDB Atlas Connection
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust

# Session & Cookie Encryption Secret
SECRET=your_super_secret_key

# Cloudinary Credentials
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

> ⚠️ `.env` is already in `.gitignore`. Only share a `.env.example` with empty values publicly.

---

## 🚀 Local Installation

**1. Clone the repository**
```bash
git clone https://github.com/zeeshan0106/wanderlust.git
cd wanderlust
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
# Create your .env file and fill in the required values
cp .env.example .env
```

**4. (Optional) Seed the database**
```bash
node init/init.js
```

**5. Start the development server**
```bash
node index.js
```

**6. Open in your browser**
```
http://localhost:8080
```

---

## ☁️ Deployment

**Live URL:** `https://wanderlust-f39o.onrender.com`

### Deployment Notes
- Add all `.env` variables to your hosting platform's environment settings
- Ensure `NODE_ENV=production` is set — the app skips `dotenv` in production automatically
- MongoDB sessions persist across restarts via `connect-mongo`
- DNS resolvers are pre-configured to use Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`) for reliable Atlas connectivity

### Recommended Platforms

| Platform | Notes |
|----------|-------|
| [Render](https://render.com) | Free tier, easy Node.js deploys |
| [Railway](https://railway.app) | Git-based, beginner-friendly |
| [Cyclic](https://cyclic.sh) | Serverless Node.js hosting |
| [AWS EC2](https://aws.amazon.com) | Full control, production-grade |

---

## 🔮 Future Improvements

- [ ] 🗺️ Map integration (Mapbox / Google Maps) for property locations
- [ ] 🔍 Advanced filtering by price range, country, and rating
- [ ] 📄 Pagination for listing results
- [ ] ❤️ Favorites / bookmarking system for users
- [ ] 🛠️ Admin dashboard for content moderation
- [ ] 📱 Fully responsive mobile-first UI enhancements
- [ ] 🔒 Rate limiting on authentication routes
- [ ] 🧪 Automated testing with Jest or Mocha

---

## 🎓 Learning Outcomes

Building Wanderlust reinforced practical knowledge of:

- Designing RESTful APIs and modular routing with **Express 5**
- Structuring scalable **MVC** backend architectures
- Integrating cloud storage with **Cloudinary + Multer**
- Persisting sessions in MongoDB with **connect-mongo**
- Implementing secure authentication with **Passport.js + passport-local-mongoose**
- Writing server-side validation schemas with **Joi**
- Building cascade delete logic using **Mongoose middleware hooks**
- Handling all errors centrally using a custom `ExpressError` + `wrapAsync` pattern
- Deploying full-stack Node.js apps to production

---

## 👤 Author

**Zeeshan Quazi**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_PROFILE)

---

<p align="center">Built with ❤️ by <strong>Zeeshan Quazi</strong> — a learning project to master full-stack Node.js development</p>
