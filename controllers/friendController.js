const { Friend, User } = require('../models');
const { Op } = require('sequelize');

exports.requestFriend = async (req, res, next) => {
  try {
    const { requestToId } = req.body;
    if (req.user.id === +requestToId) return res.status(400).json({ message: 'cannot request yourself as friend' });
    // SELECT * FROM friends WHERE (request_to_id = requestTO AND request_from_id = req.user.id)
    // OR  (request_to_id = req.user.id AND request_from_id = requestTO)
    const friend = await Friend.findOne({
      where: {
        [Op.or]: [
          {
            requestToId,
            requestFromId: req.user.id
          },
          {
            requestToId: req.user.id,
            requestFromId: requestToId
          }
        ]
      }
    });
    if (friend) return res.status(400).json({ message: 'you cannot request existed friend' });

    await Friend.create({
      requestToId,
      requestFromId: req.user.id,
      status: 'PENDING'
    });
    res.status(201).json({ message: 'request has been sent' });
  } catch (err) {
    next(err);
  }
};

exports.requestList = async (req, res, next) => {
  try {
    const friends = await Friend.findAll({
      where: {
        status: 'PENDING',
        requestToId: req.user.id
      },
      include: {
        model: User,
        as: 'RequestFrom',
        attributes: ['id', 'firstName', 'lastName', 'profileImg']
      },
      attributes: []
    });

    const result = friends.map(el => el.RequestFrom);
    res.status(200).json({ friends: result });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id, req.user.id);
    const friend = await Friend.findOne({ where: { requestFromId: id, requestToId: req.user.id } });
    if (!friend) return res.status(400).json({ message: 'this user cannot update status with this friend id' });
    friend.status = status;
    await friend.save();
    // await Friend.update({ status }, { where: { id } });
    res.status(200).json({ message: 'update friend success' });
  } catch (err) {
    next(err);
  }
};
