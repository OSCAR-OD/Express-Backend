const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noticeSchema = new mongoose.Schema(
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
    },
    teams: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Team'
  }],
},
  {
    timestamps: true
  }
);

noticeSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'noticeNumber',
  start_seq: 1
})

module.exports = mongoose.model("NoticeOrg", noticeSchema);  