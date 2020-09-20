const mongoose = require('mongoose');
// import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;
var validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    mobile: {
      type: Number,
      required: [true, 'Mobile Number is required.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    }
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
      mobile: this.mobile
    };
  }
};

module.exports = mongoose.model('User', UserSchema);
