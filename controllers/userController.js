const User = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }

    },


    async createUser(req, res) {
        try {
            const dbUserData = await User.create(req.body)
            res.status(200).json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}