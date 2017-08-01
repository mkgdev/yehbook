var mongoose = require("mongoose");



var buySchema = new mongoose.Schema({
    name : String,         //book Name
    
     condition : String,
     price   : String,
    
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
    
    },
    
    book_id : {
    
    
                id: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref : "Book"
                    
                }
}});


module.exports = mongoose.model('buyData', buySchema);