const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const notiSchema = new mongoose.Schema(
    {
        user: [
             {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

notiSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNotiNums',
    start_seq: 500
})

module.exports = mongoose.model('Noti', notiSchema)