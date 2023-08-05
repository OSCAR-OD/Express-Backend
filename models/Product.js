const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
       required: true 
      },
    brand: { 
      type: String, 
      required: true
     },
    desc: {
       type: String,
        required: true 
      },
    price: { 
      type: Number, 
     required: true
     },
    //  image: { 
    // type: Object,
    //  required: true
    //   // type: Object,
    //   //default: {},   
    // },
    // image: { 
    //   // type: Object,
    //   //  required: true
    //   type: Object,
    //   default: {},   
    // },
  /////////
    image: {
      public_id: {
          type: String,
          required: true
      },
      url: {
          type: String,
          required: true
      }
  },
/////////
  },
  {
     timestamps: true 
    }
);
module.exports = mongoose.model('Product', productSchema);
