const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    file: {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

postSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'postNumber',
  start_seq: 1
});

module.exports = mongoose.model("Post", postSchema);