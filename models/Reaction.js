const { Schema, Types } = require('mongoose');
const dayjs = require('dayjs');

const reactionSchema = new Schema({
  reactionID: {
    type: Types.ObjectId,
    default: () => new Types.ObjectId()
  },
  reactionBody: {
    type: String,
    required: true,
    matches: [/^.{0,280}$/, 'Please enter your reaction']
  },
  username: {
    type: String,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: () => dayjs(),
    get: (createdAt) => {
      return dayjs(createdAt).format('MM/DD/YYYY');
    }
  }
},{
  toJSON : {
    virtuals: true,
    getters: true
  },
  _id: false
});

module.exports = reactionSchema;