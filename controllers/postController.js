const { Post } = require('../models');

exports.createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const post = await Post.create({
      text,
      userId: req.user.id
    });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};
