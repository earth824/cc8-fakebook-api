const { Friend, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllFriends = async (req, res, next) => {
  try {
    const friends = await Friend.findAll({
      where: {
        [Op.or]: [{ requestToId: req.user.id }, { requestFromId: req.user.id }],
        status: 'FRIEND'
      },
      include: [
        {
          model: User,
          as: 'RequestTo'
        },
        {
          model: User,
          as: 'RequestFrom'
        }
      ]
    });

    const result = friends.map(item => {
      // const userId = item.requestToId === req.user.id ? item.RequestFrom.id : item.RequestTo.id;
      // const firstName = item.requestToId === req.user.id ? item.RequestFrom.firstName : item.RequestTo.firstName;
      // const lastName = item.requestToId === req.user.id ? item.RequestFrom.lastName : item.RequestTo.lastName;

      let userId, firstName, lastName;

      if (item.requestToId === req.user.id) {
        userId = item.RequestFrom.id;
        firstName = item.RequestFrom.firstName;
        lastName = item.RequestFrom.lastName;
      } else {
        userId = item.RequestTo.id;
        firstName = item.RequestTo.firstName;
        lastName = item.RequestTo.lastName;
      }

      return {
        id: item.id,
        userId,
        firstName,
        lastName
      };
    });

    res.status(200).json({ friends: result });
  } catch (err) {
    next(err);
  }
};

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

exports.deleteFriend = async (req, res, next) => {
  try {
    const { id } = req.params;
    const friend = await Friend.findOne({ where: { id } });
    if (!friend) return res.status(400).json({ message: 'this user is not your friend' });
    if (friend.status !== 'FRIEND') return res.status(400).json({ message: 'this user is not your friend' });
    if (friend.requestFromId !== req.user.id && friend.requestToId !== req.user.id)
      return res.status(400).json({ message: `cannot delete other user's friends` });
    await friend.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
