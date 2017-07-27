var mongoose                = require("mongoose");
var passpoortLocalMongoose  = require("passport-local-mongoose");    


var UserSchema    =  new mongoose.Schema({
     local :{
     username: String,
     email : String,
     password: String
     },
    
    facebook : {
    id :String,
    token:String,
    email: String,
    name:String,
    username:String
    
},
    
    
    google : {
         id: String,
        token: String,
        email: String,
        name: String   
    }
}); 
UserSchema.plugin(passpoortLocalMongoose)

module.exports = mongoose.model("User", UserSchema);