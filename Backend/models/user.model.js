const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'first name must be 3 letters'],
            maxlength:20,
        },
        lastname:{
            type:String,
            minlength:[3,'last name must be 3 letters'],
            maxlength:20,
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Please enter a valid email address'
        }
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    socketId:{
        type:String,
    }
})


userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET, {expiresIn: '10h'});
    return token;
}

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;