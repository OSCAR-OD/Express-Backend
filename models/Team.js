const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const teamSchema = new mongoose.Schema(
    {
        teamManager:
            {  
                 type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Employee'
            },
             
        title:{
                type: String,
                required: true
            }, 
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Employee'
        }],
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

teamSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'teamNumber',
    start_seq: 1
})

module.exports = mongoose.model('Team', teamSchema)