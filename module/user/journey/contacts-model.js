var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var contactsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String
    },
    contact_list: [
      {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    ],
    mobile: {
      type: Number 
    },
    updatedDate: { 
      type: Date, 
      default: new Date() 
    },
  },
  { timestamps: true }
);

contactsSchema.methods = {
    toJSON() {
      return {
        _id: this._id,
        mobile: this.mobile,
        user_id: this.user_id,
        contact_list: this.contact_list
      };
    }
  };

module.exports = mongoose.model('Contacts', contactsSchema);