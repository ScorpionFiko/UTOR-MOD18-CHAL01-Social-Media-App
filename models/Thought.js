const { Schema, Types, model } = require('mongoose');
const { dayjs } = require('dayjs');

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        match: [/^.{1,280}$/, 'Please enter your thoughts']
    },
    createdAt: {
        type: Date,
        default: () => dayjs(),
        get: function (createdAt) {
            return dayjs(createdAt).format("MM/DD/YYYY");
        }
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema]
}, {
    toJSON: {
        virtuals: true,
    },
    id: false,
    collection: 'thought'
});

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const reactionSchema = new Schema({
    reactionID: {
        type: Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        types: String,
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

const Thought = model('thought', thoughtSchema);

module.exports = Thought;