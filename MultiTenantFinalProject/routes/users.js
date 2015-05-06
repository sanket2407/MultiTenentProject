/*
* User CRUD operation - Author: Sanket Patel
*/

/*Login Authentication. */
var mysql=require('./mysql');

exports.loginAuthentication = function(req, res){

 
    var input = JSON.parse(JSON.stringify(req.body));
	var sql="SELECT * FROM user WHERE email ='"+input.email+"';";
	  mysql.fetchData(function(err,rows){
	  
	       	   console.log(rows.length);
            if(err)
            {   console.log("Error Selecting : %s ",err );}
         
            else if(rows.length === 0)
            	{
            	 res.render('login',{page_title:"Customers - Node.js",error:"username or password is not correct"});
            	}
            else
            	{
            	if(rows[0].password === input.password)
            		{

            	 req.session.user = rows[0].userid;
                 res.redirect('/projects/'+rows[0].userid);
            		}
            	else
            		{
            		res.render('login',{page_title:"Customers - Node.js",error:"password is not correct"});
            		}
            	}  
	  },sql);

  
};

/*Signup the user*/

exports.signup = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var sql="INSERT INTO user (firstname,lastname,email,password) values ('"+input.firstname+"','"+input.lastname+"','"+input.email+"','"+input.password+"') ";
	mysql.fetchData(function(err,rows){
	
          if (err)
          {console.log("Error inserting : %s ",err );
          res.render('signup',{error : "user already exist"});
          }
          else{
          res.render('login',{error : "user is successfully created. Please Log in to continue!"});
          }
       
	},sql);
  
};

/*Edit the user*/

exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers - Node.js"});
};

exports.edit = function(req, res){
    
    //var email = req.params.email;
	var loggedInUser = req.session.user;
	var sql="SELECT * FROM user WHERE userid = '"+loggedInUser+"'";
   mysql.fetchData(function(err,rows){
			if(err)
            {   console.log("Error Selecting : %s ",err );
                 res.render('error',{error:err});
            }
            else{
            res.render('edit_user',{page_title:"Edit Customers",data:rows,error:""});
            }
  
   },sql);
            
};

/*Save changes int the user*/

exports.edit_save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var userid = req.params.userid;
    var sql="UPDATE user SET firstname = '"+input.firstname+"', lastname = '"+input.lastname+"', email = '"+input.email+"', password = '"+input.password+"' WHERE userid = '"+userid+"'";
	 mysql.fetchData(function(err,rows){
          if (err)
          {
        	  console.log("Error updating : %s ",err );
        	  var query = connection.query("SELECT * FROM user WHERE userid = '"+userid+"'",function(err,rows)
        		        {
        		            if(err)
        		            {   console.log("Error Selecting : %s ",err );
        		                 res.render('error',{error:err});
        		            }
        		            else{
        		            res.render('edit_user',{page_title:"Edit Customers - Node.js",data:rows,error:"user with this name already exists"});
        		            }
        		           
        		         });
          }
          else{
          res.render('login',{error : "user is successfully Edited. Please Log in to continue!"});
          }
	},sql);
    
};


exports.delete_user = function(req,res){
          
     var email = req.params.email;
	 var sql="DELETE FROM user WHERE email ='"+email+"'";
		 mysql.fetchData(function(err,rows){
		 if(err)
             { console.log("Error deleting : %s ",err );
               res.render('error',{error:err});
             }
             else
             {
            	 res.render('signup',{error : "User"+email+" successfully deleted. Please create new account to continue."});
             }
		 
		 },sql);
    
};



exports.logout = function(req,res){
    
	req.session.user = null;
	
	res.redirect("/login");  
   
   
    
};


