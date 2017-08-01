var express    = require("express");
var router     = express.Router();
var rn         = require('random-number');
var client     = require('twilio')('ACa51208a494fa6858d2aa458e6393d2bd','3c79701ca13405a3cff0dadba4d4e48c');
var Book       = require("../models/book");
var RequestBook = require("../models/request");
var buyData     = require('../models/buy');
var middleware = require("../middleware");  // similar to var middleware = require("../middleware/index.js");  "it will take index.js file itself"

var bookCondition ='All';


//=========================================================
//  Request Routes
//========================================================

router.get('/request/new', function(req,res)
{
 res.render('../views/books/request');


}
          
          
          
);

router.get('/request', function(req, res)
{
    console.log('hello');

res.render('../views/books/request_show');

}
          
);

router.post('/request', function(req,res)
{

console.log('book', req.body.book);
    
    RequestBook.create(req.body.book, function(err,request)
                      
    {
    
    if(err)
        {
            return console.log(err);
        }
        
        console.log('request submitted : ', request);
        
        res.redirect('/books/request');
    
    }
                      
    );
    


}           
           
);

//------------------------------------------------------------

router.post('/condition', function(req, res)  //Getting the value of Cateogries from Radios buttons
{

     
    bookCondition = req.body.optionsRadios;
    
    
    
    
    res.redirect('/books');

}
           
           
);


//===================================================
// SMS verfication
//===================================================
 var  randomOTP;
router.post('/:id/buy/otp',middleware.isLoggedIn, function(req, res)
{


    var mobile_no = req.body.mobile_no;
    
    var options = {
     
     min : 11000,
     max : 99999,
     integer : true
 }
    randomOTP = rn(options);

client.messages.create({
    
     body: 'Your yehbOok otp is '+randomOTP,
    to: mobile_no,  // Text this number
    from: '+18564153674' // From a valid Twilio number
}).then((message)=> {console.log(message.body)});

}
          
);

router.post('/:id/buy/otp/verify', middleware.isLoggedIn,function(req, res)
{

  var data = req.body.buy;
    console.log(data);
    
    if(data.otp ===String(randomOTP))
        {
            console.log('otp');
            Book.findById(req.params.id, function(err, book)
                          {
                         if(err){
                           return console.log(err);
                            }
                          
                          res.render('../views/books/buyconfirm',{book:book, data: data});
                         
            } );
            
        }


}                     
);






//-------------------------------------------------------------------

//==========================================================
//  Book buy Routes
//=========================================================

router.get('/:id/buy', middleware.isLoggedIn, function(req,res)
{

        Book.findById(req.params.id, function(err, book)
        {
           if(err)
               return console.log(err);
            
            res.render('../views/books/buyform', {book:book});
        
        
        }
                             
        );


}
   
);


router.post('/:id/buy', middleware.isLoggedIn, function(req,res)
{

    var data = {
        name: req.body.buy.name,
        condition : req.body.buy.condition,
         price : req.body.buy.price,
        shipping: req.body.buy.shipping,
        pincode : req.body.buy.pincode,
        city : req.body.buy.city,
        phone_no : req.body.buy.phone_no, 
    }
    
    var user = {
        id : req.user._id,
        username : req.user.username
    }
    data.user = user;
  
  var book_id = {
      
      id : req.params.id
  }
    data.book_id = book_id;
    
    console.log('new data', data);
    

    
      buyData.create(data, function(err, buydetails)
    {
               if(err)
                   return console.log(err);
          
          console.log('buydetails', buydetails);
          
          res.render('../views/books/thankyou', {data: buydetails});
                     
                     
                     
   }
                    
                    
                    
    );
    
       



}
);




//----------------------------------------------------------



//INDEX-ROUTE  where we can se all books 
router.get("/", function(req, res){
    //Geting data from from mongodb 

    if(bookCondition=='All')
        {
    Book.find({}, function(err, allBooks){
         
        if(err){
        	console.log(err);  
        } else {
           
           res.render("books/index", {booksNAME:allBooks, currentUser: req.user}); // [books= it is arry or data we are passing]. ,
                                                                                   // [booksNAME= it is nothing but the name of our data
            }

    });
        }
    else{
        Book.find({condition:bookCondition}, function(err, allBooks)
         {
            if(err){
                console.log(err);
            }else {
                res.render("books/index", {booksNAME:allBooks, currentUser: req.user});
            }
            
            
         }
                 
                 
                 );
        
    }
  
});

//CREATE- ROUTE adding data DB to "/books" route of new books
router.post("/", middleware.isLoggedIn, function(req, res){
//get data from form and add to books array
       
       var name        = req.body.name;
       var writer      = req.body.writer;
       var image       = req.body.image;
       var condition   = req.body.condition;
       var desc        = req.body.description;
       var price       = req.body.price;
       var format      = req.body.format;
       var pages       = req.body.pages;
       var publisher   = req.body.publisher;
       var language    = req.body.language;
       var edition     = req.body.edition;
       var author = {
        id: req.user._id,
        username: req.user.username
       }

       var newBooks    =                       //creating an object  "newBooks" for data coming from "new.ejs" templete 
                  
                  {
                         name        : name,
                         writer      : writer,
                         image       : image,
                         condition   : condition,
                         description : desc,
                        author        : author,
                        price         : price,
                        format         : format,
                        language        : language,
                        publisher       : publisher,
                        edition         : edition,
                        pages           : pages
                  }                              
    
       //create a new Book_detail and save it to DB
   Book.create(newBooks, function(err, newlyCreated){
            
            if(err){
            	console.log(err);
            } else {
                //redirect back to books page
              	res.redirect("/books");
        	
            }
    });    

        //books.push(newBooks);                //here we are pushing data in "books" array which is stored in "newBooks" object  
	});
//NEW-ROUTE creating details of new books
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("books/new");
});


//SHOW-ROUTE where we can see details of perticular book
router.get("/:id", function(req, res){
	//find the book with provided ID
Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){  // "FindById()"  this function is inbult function in mongos we can easly use it to find Id of our data
	                                                                                //render show templete with that book
    if(err){
    	console.log(err);
    } else {
    	     //render show template with that perticular book
            res.render("books/show.ejs", {book: foundBook});
      }

   }); 

});

//EDIT BOOK ROUTE
router.get("/:id/edit", middleware.checkBookOwnership, function(req, res){
        
           Book.findById(req.params.id, function(err, foundBook){
           
            res.render("books/edit", {book: foundBook});


   });      
});


//UPDATE BOOK ROUTE

router.put("/:id", middleware.checkBookOwnership, function(req, res){
  // find and update the correct book
    
   Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){       // findByIdAndUpdate() is a function from mongoose

     if(err) {
      res.redirect("/books");
     } else {
      // redirect somewhere(show page)
      
      res.redirect("/books/" + req.params.id);

     }

   });  

});

//DESTROY BOOK ROUTE..

router.delete("/:id", middleware.checkBookOwnership, function(req, res){

  Book.findByIdAndRemove(req.params.id, function(err){
     if(err){
      res.redirect("/books");
      
     } else {
      
      req.flash("success", "comment deleted");
      res.redirect("/books");
     }

  });
});



module.exports  =  router;