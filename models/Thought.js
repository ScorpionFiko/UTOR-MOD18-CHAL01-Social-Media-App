const { Schema, Types, model } = require('mongoose');
const reaction = require('./Reaction');
const dayjs = require('dayjs');

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    match: [/^.{1,280}$/, 'Please enter your thoughts']
  },
  createdAt: {
    type: Date,
    default: dayjs(),
    get: (createdAt) => {
      return dayjs(createdAt).format('MM/DD/YYYY');
    }
  },
  username: {
    type: String,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: 'user'
  },
  reactions: [reaction]
}, {
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false,
  collection: 'thought'
});

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});



const Thought = model('thought', thoughtSchema);

module.exports = Thought;