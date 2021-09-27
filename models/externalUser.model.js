const mongoose = require("mongoose")

const Schema = mongoose.Schema;


require('mongoose-type-email');

const ExternalUserSchema = new Schema ({

    name:{
        type: String
    },
    description:{
        type:String
    },
    gender:{
        type: String

    },
    email:
         mongoose.SchemaTypes.Email,
  
    phone:{
        type:String
    },
   
    state:{
        type:String,
        default: "Requested"
    },
  
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
  
},
 {
    timestamps: true
});



const ExternalUser = mongoose.model('ExternalUser', ExternalUserSchema)
module.exports = ExternalUser
