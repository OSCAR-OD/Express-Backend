const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const formSchema = new mongoose.Schema(
    {
        user:
        {  
             type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        amount: Number,
        checkbox1:Boolean,
        checkbox2:Boolean,
        billFirstName: String,
        billLastName: String,
        billAddress1: String,
         billCity: String,
        billState: String,
        billZipCode: String,
        sameAsBilling: Boolean,
        shipFirstName: String,
        shipLastName: String,
        shipAddress1: String,
         shipCity: String,
        shipState: String,
        shipZipCode: String,
        optInNews: Boolean
         }
        )

formSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'formTicketNums',
    start_seq: 1
})

module.exports = mongoose.model('Form', formSchema)