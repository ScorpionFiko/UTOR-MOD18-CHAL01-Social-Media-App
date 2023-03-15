const { User, Thought } = require('../models');

module.exports = {
  // gets all thoughts present in mongoDB.
  async getThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find({});
      res.status(200).json(dbThoughtData);

    } catch (err) {
      res.status(500).json(err);
    }

  },
  // creates thought: first check to see if user exists and if so, created the thought. Otherwise returns 404 error
  async createThought(req, res) {
    try {
      const userExists = await User.findById({ _id: req.body.userId });
      if (!userExists) {
        return res.status(404).json({ message: `User wtih ID ${req.body.userId} does not exist! No thought was created!` });
      }
      let dbResponse = {};
      const dbThoughtData = await Thought.create(req.body);
      dbResponse.thoughtData = dbThoughtData;
      if (dbThoughtData) {
        const dbUserData = await User.findByIdAndUpdate({
          _id: req.body.userId
        }, {
          $addToSet: { thoughts: dbThoughtData._id }
        }, {
          new: true
        });
        dbResponse.userData = dbUserData;
      }

      res.status(200).json(dbResponse);
    } catch (err) {
      res.status(500).json(err);
    }

  },
  // gets a single thought based on thoughtId (_id field) and returns the full data including the body of all reactions
  async getSingleThought(req, res) {
    try {
      const dbThoughtData = await Thought.findById({ _id: req.params.thoughtId }).populate('reactions');
      if (dbThoughtData) {
        res.status(200).json(dbThoughtData);
      } else {
        res.status(404).json({ message: `Thought with ID: ${req.params.thoughtId} not found!` });
      }

    } catch (err) {
      res.status(500).json(err);
    }

  },
  // updates the thought body. Does not update userId associated with the thought
  async updateThought(req, res) {
    try {
      const dbThoughtData = await Thought.findByIdAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { new: true });
      if (dbThoughtData) {
        res.status(200).json(dbThoughtData);
      } else {
        res.status(404).json({ message: `Thought with ID: ${req.params.thoughtId} not found!` });
      }

    } catch (err) {
      res.status(500).json(err);
    }
  },
  // deletes a thought based on the _id
  async deleteThought(req, res) {
    try {
      const dbThoughtData = await Thought.findByIdAndDelete({ _id: req.params.thoughtId });
      if (dbThoughtData) {
        await User.findByIdAndUpdate({
          _id: dbThoughtData.userId
        }, {
          $pull: { thoughts: req.params.thoughtId }
        }, {
          new: true
        });
        res.status(201).json({ message: `Thought with ID: ${req.params.thoughtId}  was deleted!` });
      } else {
        res.status(404).json({ message: `Thought with ID: ${req.params.thoughtId} not found! Nothing was deleted!` });
      }

    } catch (err) {
      res.status(500).json(err);
    }

  },
  // adds reaction to thought with given _id
  async addReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (dbThoughtData) {
        res.status(201).json(dbThoughtData);
      } else {
        res.status(404).json({ message: `Thought with ID: ${req.params.thoughtId} not found! Reacton was not added!` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // removes a reaction from a thought. Checks if reaction exists and then proceeds with removal
  async deleteReaction(req, res) {
    try {
      const reactionExists = await Thought.find({ 'reactions.reactionID': req.params.reactionId });
      if (reactionExists.length === 0) {
        return res.status(404).json({ message: `Reaction with ID: ${req.params.reactionId} not found. Nothing was deleted.` });
      }
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionID: req.params.reactionId } } },
        { new: true }
      );
      if (dbThoughtData) {
        res.status(200).json({ message: `Reaction with ID: ${req.params.reactionId} was deleted!` });
      } else {
        res.status(404).json({ message: `Though with ID: ${req.params.thoughtId} not found! No reactions were deleted!` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
};