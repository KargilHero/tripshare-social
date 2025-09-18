# TripShare - Social Media Platform for Travel Experiences

A modern social media web application focused exclusively on sharing trip experiences, locations, images, and videos. Built with Node.js, Express, MongoDB, and React.

## Features

### 🌍 Trip-Focused Social Platform
- Share detailed trip experiences with photos and videos
- Location-based posts with coordinates and place information
- Trip categorization (solo, couple, family, friends, business, adventure, relaxation)
- Budget tracking (budget, mid-range, luxury)
- Trip ratings and reviews

### 👥 Social Features
- User authentication and profiles
- Follow/unfollow system
- Like, comment, and share posts
- User search and discovery
- Profile customization with bio and location

### 📱 Modern UI/UX
- Responsive design for all devices
- Material-UI components
- Image and video galleries
- Real-time interactions
- Beautiful animations and transitions

### 🔍 Search & Discovery
- Search posts by location, title, description, or tags
- Search users by name, username, or location
- Popular tags and trending content
- Advanced filtering options

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image/video storage
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Dropzone** - File uploads
- **Date-fns** - Date formatting

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trip-social
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/trip-social

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here_change_in_production

   # Cloudinary (for image/video uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Server
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the application**
   
   **Development mode (both frontend and backend):**
   ```bash
   # Terminal 1 - Backend
   npm run dev

   # Terminal 2 - Frontend
   npm run client
   ```

   **Production mode:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment
- `POST /api/posts/:id/share` - Share post
- `GET /api/posts/search/:query` - Search posts

### Users
- `GET /api/users/:username` - Get user profile
- `POST /api/users/:userId/follow` - Follow/unfollow user
- `GET /api/users/search/:query` - Search users
- `GET /api/users/:userId/followers` - Get followers
- `GET /api/users/:userId/following` - Get following

## Project Structure

```
trip-social/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js
│   └── package.json
├── middleware/             # Express middleware
├── models/                 # Mongoose models
├── routes/                 # API routes
├── .env                    # Environment variables
├── server.js              # Express server
└── package.json
```

## Features in Detail

### Post Creation
- Rich text descriptions
- Multiple image/video uploads
- Location selection with coordinates
- Trip date ranges
- Trip categorization and budget
- Rating system (1-5 stars)
- Tag system for better discovery
- Privacy settings (public, followers, private)

### User Profiles
- Profile pictures and bio
- Trip statistics
- Follower/following counts
- Post history
- Location information

### Social Interactions
- Real-time like/unlike functionality
- Commenting system
- Post sharing
- User following system
- Activity feeds

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## Deployment

### Environment Variables for Production
Update your `.env` file with production values:
- Use a strong JWT secret
- Configure production MongoDB URI
- Set up Cloudinary for media storage
- Configure proper CORS origins

### Build for Production
```bash
npm run build
```

This creates an optimized build of the React app in the `client/build` folder.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy Traveling! 🌍✈️**
