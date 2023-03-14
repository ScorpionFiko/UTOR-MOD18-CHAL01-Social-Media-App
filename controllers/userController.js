const { User, Thought } = require('../models');
// when deleting a user attempt to remove any remaining reactions that have the userId
// const {ObjectId} = require('mongoose');

module.exports = {
  // gets all users from the database
  async getUsers(req, res) {
    try {
      const dbUserData = await User.find({});
      res.status(200).json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // gets a single user from the database and displays the thoughts and friends
  async getSingleUser(req, res) {
    try {
      const dbUserData = await User.findById({ _id: req.params.userId }).populate('thoughts').populate('friends');
      (dbUserData) ? res.status(200).json(dbUserData) : res.status(404).json({ message: `User with ID ${req.params.userId} is not found!` });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // adds user to the database
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.status(201).json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // updates a user in the database
  async updateUser(req, res) {
    try {
      const dbUserData = await User.findByIdAndUpdate({ _id: req.params.userId },
        { $set: req.body }, { new: true });
      (dbUserData) ? res.status(200).json(dbUserData) : res.status(404).json({ message: `User with ID ${req.params.userId} is not found!` });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      let dbThoughtData = [], dbReactionData = [];
      const dbUserData = await User.findByIdAndDelete({ _id: req.params.userId });
      // delete user thoughts and reactions
      if (dbUserData) {
        dbThoughtData = await Thought.deleteMany({ userId: req.params.userId });
        // when deleting a user attempt to remove any remaining reactions that have the userId
        // dbReactionData = await Thought.findByIdAndUpdate(
        //   {reactions : {userId: ObjectId(req.params.userId)}},
        //   {$pull: { reactions: { userId: req.params.userId } }},
        //   {new:true}
        // );
      } else {
        return res.status(404).json({message: `User with ID ${req.params.userId} is not found!` });
      }
      const deletedUser = {
        user: dbUserData,
        thought: dbThoughtData,
        reaction: dbReactionData
      };
      res.status(202).json(deletedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // adds a friend to the frient array
  async addFriend(req, res) {
    try {
      const dbUserData = await User.findById({ _id: req.params.userId });
      const dbFriendData = await User.findById({ _id: req.params.friendId });
      if (!dbUserData || !dbFriendData) {
        return res.status(404).json({ message: 'User(s) not found!' });
      }
      const updatedUser = await User.findByIdAndUpdate({
        _id: req.params.userId
      }, {
        $addToSet: { friends: dbFriendData._id }
      }, {
        new: true,
      });
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // removes a friend from the friend array
  async deleteFriend(req, res) {
    try {
      const dbUserData = await User.findById({ _id: req.params.userId });
      const dbFriendData = await User.findById({ _id: req.params.friendId });
      if (!dbUserData || !dbFriendData) {
        return res.status(404).json({ message: 'User(s) not found!' });
      }
      const updatedUser = await User.findByIdAndUpdate({
        _id: req.params.userId
      }, {
        $pull: { friends: dbFriendData._id }
      }, {
        new: true,
      });
      res.status(200).json(updatedUser);

    } catch (err) {
      res.status(500).json(err);

    }
  }
};