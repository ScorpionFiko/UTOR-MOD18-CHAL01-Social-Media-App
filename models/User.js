const { Schema, Types, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email address!']
    },
    thoughts: [{
        type: Types.ObjectId,
        ref: 'thought'
    }],
    friends: [{
        type: Types.ObjectId,
        ref: 'user'
    }]
}, {
    toJSON: {
        virtuals: true,
    },
    id: false,
    collection: 'user',
});

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

userSchema.virtual('thoughtCount').get(function () {
    return this.thoughts.length;
});

const User = model('user', userSchema);

module.exports = User;