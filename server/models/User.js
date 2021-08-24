const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    firstName: {
        type: String,
        require: false
    },
    lastName: {
        type: String, 
        require: false
    }
},
{
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

UserSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.changePassword = async function (newPassword) {
    this.password = newPassword;
}

module.exports = mongoose.model('User', UserSchema);