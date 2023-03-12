const {User} = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const dbUserData = await User.find({});
            res.status(200).json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleUser(req, res) {
        try {
            const dbUserData = await User.findById({_id: req.params.userId});
            (dbUserData) ? res.status(200).json(dbUserData) : res.status(404).json({message: `User: ${req.params.userId} is not found!`})
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const dbUserData = await User.create(req.body)
            res.status(201).json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const dbUserData = await User.findByIdAndUpdate({_id: req.params.userId}, 
                { $set: req.body}, { new: true });
            res.status(202).json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    }, 

    async deleteUser(req, res) {
        try {
            const dbUserData = await User.findByIdAndDelete({_id: req.params.userId});
            // delete user thoughts and reactions
            res.status(202).json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const dbUserData = await User.findById({_id: req.params.userId});
            const dbFriendData = await User.findById({_id: req.params.friendId});
            if (!dbUserData || !dbFriendData) {
                return res.status(404).json({message: "User(s) not found!"});
            }
            const updatedUser = await User.findByIdAndUpdate({
                _id: req.params.userId
            }, {
                $addToSet: { friends: dbFriendData._id}
            },{
                new: true,
            });
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteFriend(req, res) {
        try {
            const dbUserData = await User.findById({_id: req.params.userId});
            const dbFriendData = await User.findById({_id: req.params.friendId});
            if (!dbUserData || !dbFriendData) {
                return res.status(404).json({message: "User(s) not found!"});
            }
            const updatedUser = await User.findByIdAndUpdate({
                _id: req.params.userId
            }, {
                $pull: { friends: dbFriendData._id}
            },{
                new: true,
            });
            res.status(200).json(updatedUser);

        } catch(err) {
            res.status(500).json(err);

        }
    }
}