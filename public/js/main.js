//===================================================================
//   Sliding effect
//==================================================================

function sliding_effect()
{
window.sr = ScrollReveal();
        sr.reveal('.navbar', {
         
         duration:   2000,
         origin:    'bottom'

        });

        sr.reveal('.showcase-left', {
         
         duration:   2000,
     //  delay:      500,
         origin:    'top',
         distance: '300px'

        });

        sr.reveal('.showcase-right', {
         
         duration:   2000,
   //    delay:      2000,
         origin:    'right',
         distance: '300px'

        });

        sr.reveal('.showcase-btn', {
         
         duration:   2000,
         delay:      700,
         origin:    'right',
         distance: '300px'

        });

        sr.reveal('#testimonial div', {
         
         duration:   2000,
   //    delay:      2000,
         origin:    'bottom'

        });
  

         sr.reveal('.info-left', {
         
         duration:   2000,
   //    delay:      2000,
         origin:    'left',
         distance: '300px',
         viewFactor: 0.2

        });


        
         sr.reveal('.info-right', {
         
         duration:   2000,
   //    delay:      2000,
         origin:    'right',
         distance: '300px',
         viewFactor: 0.2

        }); 
}

//-------------------------------------------------------------------------

function smooth_scroll()
{
    $(function() {
      // Smooth Scrolling
      $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
      });
    });
}

//Sending Post request for contact information

$('.submit-contact').on('click', function()
{
   
   var data = {
       
       name : $('[name="contact[name]"]').val(),
       email: $('[name="contact[email]"]').val(),
       phone_no : $('[name="contact[phone_no]"]').val(),
       message: $('[name="contact[message]"]').val()
   }
   $.post('/contact',{data},
         function(){
       $('[name="contact[name]"]').val(""),
       $('[name="contact[email]"]').val(""),
       $('[name="contact[phone_no]"]').val(""),
       $('[name="contact[message]"]').val("")
       
   });

}
                      
                      
                      
);

//---------------------------------------------------------

//make image height equal

function resizeImage()

{
     var imgmaxht = 0;  // maximum image height
    $('.thumbnail-book img').each(function()
                                    
    {
    
        if($(this).height()>imgmaxht)
            {
                imgmaxht= $(this).height();
            }
    }
                                    
    );


     console.log(imgmaxht);

      $('.thumbnail-book img').height(imgmaxht+imgmaxht*0.3);
    
    
    
}

   

//make same  height of caption

function resizeCaption()
{
    
    var capmaxht = 0;  // maximum image height
    $('.thumbnail-book .caption').each(function()
                                    
    {
    
        if($(this).height()>capmaxht)
            {
                capmaxht= $(this).height();
            }
    }
                                    
    );




      $('.thumbnail-book .caption').height(capmaxht);
    
}

//-----------------------------------------------------------------------


//getFromStrorage function to get and set value in localstorage


function getFromStorage()  // required to save the current radio button checked which will be extracted after reload of page
{
    
    return {
        
        set : function(key ,value)
        {
            localStorage.setItem(key, value);
        },
        
        get : function(key)
        
         {
             return localStorage.getItem(key);
         }
    };
    
}

$.when($('[name="optionsRadios"]').on('change', function()
{
    console.log('changed');
    
    getFromStorage().set("Cur_radio", $(this)[0].value);   //gettting value and storing the selected option to 
                                                        //localStorage
    console.log($(this));
    
    var radioValue= $('.radio-form').serializeArray()[0].value;
    
    $.post('/books/condition',{
        optionsRadios:radioValue
        
    },function()
          {
           console.log('successfully posted');
        
           $('.book-grid').animate({opacity:'0'},1000,function()
            {
               
               var htmlData;
        
                    $.ajax({
                   method:'GET',
                   url : '/books',
                   
                   success: function(data)
                   {
                       
                       htmlData=$($.parseHTML(data)).find('.book-grid')[0].innerHTML;

                   }   
                   
               });
               
               
                setTimeout(function()     //cant use this because it will be out of scope as setTimeout is used
               {
                
               
                 $('.book-grid').html(htmlData);

                    
                     $(window).ready(function()       // window.load function not wokring
                    
                    {
                        
                        console.log('done');
                         
                          resizeImage(); //resizing the image again
                          resizeCaption();   //resizing the caption
                         
                         $('.book-grid').animate({opacity:'1.0'},1000);
                    }
                        );       
                    
          

                         
                                           
                
                }, 2000);
               
            }
                                           
                                           
            );
           
    
    });
    

}

                              
                              
) 
).then(function()
      
      {
     
    var value=getFromStorage().get('Cur_radio'); //value extracted from localStorage
   
    
  $('[value="'+value+'"]').prop('checked','true');  //set the current radio button checked
});


//----------------------------------------------------------------------------------------------


//animate window

$(window).on('load', function()
{
   $('body').animate({
       opacity:'1.0'
   },500, function()
   {

      resizeImage();
    resizeCaption();
  
       
   }

);

  
  sliding_effect();
 smooth_scroll();

}
         
);

        
       

