/**
 * New node file
 */
var mysql=require('./mysql');
var MongoClient = require('mongodb').MongoClient;

exports.getTaskData=function(req,res){
	var loggedInUser = req.session.user;

	if (loggedInUser == null) {
		res.redirect("/login");
	} else {
		
	var sql="select field_name from model_fields_master where model_type=3";
	mysql.fetchData(function(err,results){
		if(err)
			throw err;
		else
			{
				console.log("waterfall fields");
				var fields=[];
				for(i=0;i<results.length;i++){
					fields.push(results[i].field_name);
				}
				
				var pid=parseInt(req.params.projectid);
				MongoClient.connect("mongodb://varun:varun@ds031862.mongolab.com:31862/multitenant_saas", function(err, db) {
					if(!err) {
						db.collection('projectDetails').find({ _id: pid }).toArray(function(err, docs) {
					
							var sprintData;
							if (err) { 
								console.log(err.message);
								res.send(500, err.message);
							} else if(docs.length <= 0) {
								console.log("Error 404: Project Details not Found...");
								sprintData=[];
								
								console.log(sprintData);
								console.log(pid);
			            		  res.render('waterfall',{sprintFields:fields,sprintsData:sprintData, pid:pid, doc:sprintData});
								//res.send(404);
							} else {
								console.log("@@@@@@@");
								console.log(docs[0].details);
								sprintData=JSON.stringify(docs[0].details);
								console.log(sprintData);
								console.log(sprintData);
								console.log(pid);
			            		  res.render('waterfall',{sprintFields:fields,sprintsData:sprintData, pid:pid, doc:docs[0].details});
							}			            		 
			      		});
					} else {
						console.log("Error in Connection");
					}
				});
			
			}
	},sql);
}
	
}

