const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email: {
        type: "string",
        required: [true,'Please enter an email'],
        unique: [true,'Please enter unique email_id'],
        lowercase: true,
        validate:[isEmail,'Please enter a valid email']
    },
    password: {
        type: "string",
        required: [true,'Please enter a password'],
        minlength: [7, 'Minimum chracter count is 7']
    }
});

//fire a function before doc gets saved to db
userSchema.pre('save', async function (next) { //no doc as doc is not yet saved.
    console.log('User about to be created and saved:',this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//fire a function after doc gets saved to db
userSchema.post('save', function (doc, next) { 
    console.log('New user was created and saved:', doc);
    next();
});

//Static method to login user

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email:email });
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        } else {
            throw new Error('Incorrect Password');
        }
    } else {
        throw new Error('Incorrect Email');
    }
}
const User = mongoose.model('user', userSchema);

module.exports = User;