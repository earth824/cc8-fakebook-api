const { Post, Friend, User } = require('../models');

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'desc']],
      attributes: ['id', 'text', 'createdAt', 'updatedAt']
    });
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.getAllPostsIncludeFriend = async (req, res, next) => {
  try {
    // SELECT * FROM posts WHERE user_id = ownId OR user_id = friend1_id OR user_id = friend2_id ... ORDER BY created_at
    // SELECT * FROM posts WHERE user_id IN (user_id, friend1_id, friend2_id, ...) ORDER BY created_at
    // const friends = await Friend.findAll({
    //   where: {
    //     [Op.or]: [{ requestToId: req.user.id }, { requestFromId: req.user.id }],
    //     status: 'FRIEND'
    //   }
    // });

    // const friendIncludeMeId = friends.reduce((acc, item) => {
    //   if (!acc.includes(item.requestFromId)) acc.push(requestFromId);
    //   if (!acc.includes(item.requestToId)) acc.push(requestToId);
    //   return acc;
    // }, []);

    const requestToFriendIds = await Friend.findAll({
      where: {
        requestFromId: req.user.id,
        status: 'FRIEND'
      },
      attributes: ['requestToId']
    });

    const toIds = requestToFriendIds.map(item => item.requestToId);

    const requestFromFriendIds = await Friend.findAll({
      where: {
        requestToId: req.user.id,
        status: 'FRIEND'
      },
      attributes: ['requestFromId']
    });

    const fromIds = requestFromFriendIds.map(item => item.requestFromId);

    const friendIncludeMeId = [req.user.id, ...toIds, ...fromIds];

    const posts = await Post.findAll({
      where: { userId: friendIncludeMeId },
      order: [['createdAt', 'desc']],
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'profileImg']
      },
      attributes: ['id', 'text', 'createdAt', 'updatedAt']
    });
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

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

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ where: { id } });
    if (!post) return res.status(400).json({ message: 'post not found' });
    if (post.userId !== req.user.id) return res.status(400).json({ message: `cannot delete other user's post` });
    await post.destroy();
    // await Post.destroy({ where: { id } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
