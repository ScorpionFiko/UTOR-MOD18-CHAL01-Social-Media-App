const {User, Thought} = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const dbThoughtData = await Thought.find({});
            res.status(200).json(dbThoughtData);

        } catch(err) {
            res.status(500).json(err);
        }

    },

    async createThought(req, res) {
        try {
            const dbThoughtData = await Thought.create(req.body);
            if (dbThoughtData) {
                const dbUserData = await User.findByIdAndUpdate({
                    _id: req.body.userId
                },{
                    $addToSet: {thoughts: dbThoughtData._id}
                }, {
                    new: true
                });
            }
            res.status(200).json(dbThoughtData);

        } catch(err) {
            res.status(500).json(err);
        }

    },
}