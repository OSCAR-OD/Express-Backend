const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
         type: String,
        required: true
     },
     email: {
        type: String,
        required: true
    },
    password: { 
        type: String,
         required: true,
          minlength: 5 
        },
        roles: {
            type: [String],
            default: ["User"]
        },
        active: {
            type: Boolean,
            default: true
        },
        image: {
            public_id: {
              type: String,
             // required: true
            },
            url: {
              type: String,
             // required: true
            }
          }, 
            
         
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);