/**
 * New node file
 */
var mongoClient=require('mongodb');

exports.showProject=function(req,res){
	
	var pid = req.param('pid');
	req.session.user=1;
	var userid=req.session.user;
	
	
	var sql="select project_type from projects where userid="+userid+" and project_id="+pid;
	mysql.fetchData(function(err,results){
		console.log(results);
		console.log(results[0].project_type);
	});
	MongoClient.connect("mongodb://varun:varun@ds031862.mongolab.com:31862/multitenant_saas", function(err, db) {
		if(!err) {
			db.collection('projectDetails').find({ _id: pid }).toArray(function(err, docs) {
				if (err) { 
					console.log(err.message);
					res.send(500, err.message);
				} else if(docs.length <= 0) {
					console.log("Error 404: Project Details not Found...");
					res.send(404);
				} else {
					console.log("@@@@@@@");
					console.log(docs[0].sprint);
					var sprintData=JSON.stringify(docs[0].sprint);
					console.log(sprintData);
            		//console.log('data got... -> '+JSON.stringify(docs).sprint);
            		//sprintData=JSON.stringify(docs.sprint);
					
            		  res.render('scrum',{sprintFields:sprintFields,backlogFields:backlogFields,sprintsData:sprintData});
            		//res.send(docs);
          			/*if(docs != null) {
          				res.send(docs);
          			} else {
          				console.log("No Project Details found");
          			}*/
            	}
      		});
		} else {
			console.log("Error in Connection");
		}
	});
	
	
}