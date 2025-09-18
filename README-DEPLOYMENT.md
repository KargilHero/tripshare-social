# TripShare Deployment Guide

## Backend Deployment (Render)

1. **Create Render Account**: Sign up at https://render.com
2. **Connect GitHub**: Link your GitHub account and create a repository for this project
3. **Create Web Service**:
   - Choose "Web Service"
   - Connect your repository
   - Use these settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

4. **Environment Variables** (Add in Render dashboard):
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLIENT_URL=https://your-netlify-app.netlify.app
   ```

## Frontend Deployment (Netlify)

1. **Build the React App**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `client/build` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=client/build`

3. **Environment Variables** (Add in Netlify dashboard):
   ```
   REACT_APP_API_URL=https://your-render-app.onrender.com
   ```

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**: https://cloud.mongodb.com
2. **Create Cluster**: Choose free tier
3. **Create Database User**: Add username/password
4. **Network Access**: Add `0.0.0.0/0` for production access
5. **Get Connection String**: Use in MONGODB_URI environment variable

## Cloudinary Setup

1. **Create Cloudinary Account**: https://cloudinary.com
2. **Get API Credentials**: From dashboard
3. **Add to Environment Variables**: Cloud name, API key, and secret

## Final Steps

1. Update CORS origins in server.js with your production URLs
2. Test all functionality on production
3. Monitor logs for any issues

## Production URLs

- **Backend**: https://tripshare-backend.onrender.com
- **Frontend**: https://tripshare-app.netlify.app
