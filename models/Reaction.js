const { Schema, Types, model } = require('mongoose');
const { dayjs } = require('dayjs');

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
    createdAt: {
        type: Date,
        default: () => dayjs(),
        get: function (createdAt) {
            return dayjs(createdAt).format("MM/DD/YYYY");
        }
    }
});

module.exports = reactionSchema;