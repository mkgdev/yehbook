var mongoose = require("mongoose");



var buySchema = new mongoose.Schema({
    shipping : String,
    pincode : String,
    city    :  String,
    phone_no : String,
    
    user : {
                id :{
                    
                      type: mongoose.Schema.Types.ObjectId,
                    ref:  "User"
                },
         username :  String
    
    }
});