var mongoose = require('mongoose');


var requestSchema = new mongoose.Schema(
{
    
    
    
    name:String,
    author:String,
    condition: String,
    info: String
    
}



);

module.exports = mongoose.model("RequestBook", requestSchema);


