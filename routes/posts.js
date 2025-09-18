const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

const router = express.Router();

// Create a new post
router.post('/', auth, upload.array('media', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      locationName,
      latitude,
      longitude,
      country,
      city,
      startDate,
      endDate,
      tags,
      visibility,
      tripType,
      budget,
      rating
    } = req.body;

    // Upload media files to Cloudinary
    const mediaFiles = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          const result = await uploadToCloudinary(file.buffer, {
            resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
            transformation: file.mimetype.startsWith('video/') ? [] : [
              { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
            ]
          });

          mediaFiles.push({
            type: file.mimetype.startsWith('video/') ? 'video' : 'image',
            url: result.secure_url,
            publicId: result.public_id,
            order: i
          });
        } catch (uploadError) {
          console.error('Media upload error:', uploadError);
          return res.status(400).json({ message: `Failed to upload media file ${i + 1}` });
        }
      }
    }

    // Add coordinates only if they are valid numbers
    const postData = {
      author: req.user._id,
      title,
      description,
      location: {
        name: locationName,
        country,
        city
      },
      tripDate: {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      media: mediaFiles,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      visibility: visibility || 'public',
      tripType,
      budget: budget || 'mid-range',
      rating: parseInt(rating)
    };

    // Add coordinates only if they are provided and valid
    if (latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
      postData.location.coordinates = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    }

    const post = new Post(postData);
    await post.save();

    // Update user's total trips count
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalTrips: 1 } });

    // Populate author info
    await post.populate('author', 'username fullName profilePicture');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error during post creation' });
  }
});

// Get all posts (feed)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    
    // Filter by visibility if user is not authenticated
    if (!req.user) {
      query.visibility = 'public';
    }

    const posts = await Post.find(query)
      .populate('author', 'username fullName profilePicture isVerified')
      .populate('comments.user', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// Get single post
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullName profilePicture isVerified')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('likes.user', 'username fullName profilePicture');

    if (!post || !post.isActive) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check visibility
    if (post.visibility === 'private' && (!req.user || post.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error while fetching post' });
  }
});

// Like/Unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(like => like.user.toString() === req.user._id.toString());

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push({ user: req.user._id });
    }

    await post.save();

    res.json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      likeCount: post.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user._id,
      text: text.trim()
    };

    post.comments.push(comment);
    await post.save();

    // Populate the new comment
    await post.populate('comments.user', 'username fullName profilePicture');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Share post
router.post('/:id/share', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const shareIndex = post.shares.findIndex(share => share.user.toString() === req.user._id.toString());

    if (shareIndex === -1) {
      post.shares.push({ user: req.user._id });
      await post.save();
    }

    res.json({
      message: 'Post shared successfully',
      shareCount: post.shares.length
    });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search posts
router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchQuery = {
      $and: [
        { isActive: true },
        !req.user ? { visibility: 'public' } : {},
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { 'location.name': { $regex: query, $options: 'i' } },
            { 'location.city': { $regex: query, $options: 'i' } },
            { 'location.country': { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        }
      ]
    };

    const posts = await Post.find(searchQuery)
      .populate('author', 'username fullName profilePicture isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(searchQuery);

    res.json({
      posts,
      query,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

module.exports = router;
