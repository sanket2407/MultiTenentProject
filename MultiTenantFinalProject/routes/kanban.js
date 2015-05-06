/**
 * New node file
 */
var mysql=require('./mysql');
var MongoClient = require('mongodb').MongoClient;

exports.getCardDara=function(req,res){
		
	var loggedInUser = req.session.user;

	if (loggedInUser == null) {
		res.redirect("/login");
	} else {
		

	var projectId = parseInt(req.params.projectid);
	var sql="select field_name from model_fields_master where model_type=2";
	mysql.fetchData(function(err,results){
		
		if(err)
			throw err;
		else
			{
				console.log("kanban fields");
				console.log(results);
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
							}
							else if(docs.length <= 0) {
								console.log("Error 404: Project Details not Found...");
								sprintData=[];
								 console.log(sprintData);
			            		  res.render('kanban',{sprintFields:fields, sprintsData:sprintData, pid:pid, doc:sprintData});
								//res.send(404);
							} else {
								console.log("@@@@@@@");
								console.log(docs[0].details);
								var x = docs[0].details;
								console.log("it was docs");
								sprintData=JSON.stringify(docs[0].details);
								console.log(sprintData);
								 console.log(sprintData);
			            		  res.render('kanban',{sprintFields:fields, sprintsData:sprintData,pid:pid, doc:docs[0].details});
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

/*exports.newKanban=function(req,res){
	console.log("KANBAN: In Kanban Add...");
	var data = '';
	req.addListener('data', function(chunk) {
		data += chunk;
	});

	var datagot='';
	console.log(data);
	req.addListener('end', function() {
	   datagot = JSON.parse(data);
	   console.log('KANBAN: data got -> '+datagot);

		MongoClient.connect("mongodb://varun:varun@ds031862.mongolab.com:31862/multitenant_saas", function(err_connection, db) {
			if(!err_connection) {
				console.log("KANBAN: Connected to Mongolab");
				db.collection('projectDetails').update({ _id: 7}, { $push: { cards: datagot } }, function(err_insertion, records) {
					if(!err_insertion) {
						console.log("KANBAN: Card Inserted Successfully...");
						res.writeHead(200, {'content-type': 'text/plain'});
						res.send();
					} else {
						console.log("KANBAN: Some Error..."+err_insertion);
						res.send(err_insertion);
					}
				});
			} else {
				console.log("KANBAN: Error in Connection..."+err_connection);
				res.send(err_connection);
			}
		});
	});
}

exports.updateKanban=function(req,res){
	console.log("KANBAN: In Kanban Update...");
    var data = '';
	req.addListener('data', function(chunk) {
		data += chunk;
	});

	var datagot='';
	console.log(data);
	req.addListener('end', function() {
	   datagot = JSON.parse(data);
	   console.log('KANBAN: data got -> '+datagot.CardName +' '+datagot.CardStatus +' '+datagot.CardDescription);

		MongoClient.connect("mongodb://varun:varun@ds031862.mongolab.com:31862/multitenant_saas", function(err_connection, db) {
			if(!err_connection) {
				console.log("KANBAN: Connected to Mongolab");
				db.collection('projectDetails').update({ _id: 7, "cards.CardId" : datagot.CardId}, 
					{ $set: { "cards.$.CardName" : datagot.CardName, 
							"cards.$.CardDescription" : datagot.CardDescription, 
							"cards.$.CardStatus" : datagot.CardStatus, 
							"cards.$.AssignedTo" : datagot.AssignedTo } }, function(err_updation, records) {
					if(!err_updation) {
						console.log("KANBAN: Card Updated Successfully...");
						res.writeHead(200, {'content-type': 'text/plain'});
						res.send();
					} else {
						console.log("KANBAN: Some Error..."+err_updation);
						res.send(err_updation);
					}
				});
			} else {
				console.log("KANBAN: Error in Connection..."+err_connection);
				res.send(err_connection);
			}
		});
	});
}*/