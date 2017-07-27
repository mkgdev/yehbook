var router = require('express').Router();

var Contact = require('../models/contact.js');

router.post('/contact',function(req, res){
 
  var contact = req.body.data;
    console.log(req.body);
    console.log(contact);
         

    Contact.create(contact, function(err, contact)
    {
        if(err)
            {
               return console.log(err);
            }
        
        console.log('Message received successfully');
        console.log(contact);
        res.redirect('/');
                
    }
                  
                  
    );
        
    
    
});


module.exports = router;