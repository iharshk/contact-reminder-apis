const mongoose = require('mongoose');
// import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;
var validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    mobile: {
      type: Number,
      required: [true, 'Mobile Number is required.'],
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      validate: {
        validator: (email) => {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)
        },
        message: 'Email validation failed'
      }
    },
    is_active: {
      type: Boolean,
      default: false 
    },
  },
  { timestamps: true }
);

// UserSchema.path('password').validate(password =>{
//   console.log(password, "========")
//   return password && password.length === 8;
// }, 'Password must be of atleast 8 characters.');

UserSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      mobile: this.mobile,
      is_active: this.is_active,
      email: this.email
    };
  }
};

module.exports = mongoose.model('User', UserSchema);
