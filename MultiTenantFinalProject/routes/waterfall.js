/**
 * New node file
 */
var mysql=require('./mysql');
var MongoClient = require('mongodb').MongoClient;

exports.getTaskData=function(req,res){
	
	var projectId=1;
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
				res.render('waterfall',{sprintFields:fields})
			}
	},sql);
	
	
}

exports.newTask=function(req,res){
	
	console.log("WATERFALL: In Waterfall Add...");
	var data = '';
	req.addListener('data', function(chunk) {
		data += chunk;
	});

	var datagot='';
	console.log(data);
	req.addListener('end', function() {
	   datagot = JSON.parse(data);
	   console.log('WATERFALL: data got -> '+datagot);

		MongoClient.connect("mongodb://varun:varun@ds031862.mongolab.com:31862/multitenant_saas", function(err_connection, db) {
			if(!err_connection) {
				console.log("WATERFALL: Connected to Mongolab");
				db.collection('projectDetails').update({ _id: 8}, { $push: { tasks: datagot } }, function(err_insertion, records) {
					if(!err_insertion) {
						console.log("WATERFALL: Task Inserted Successfully...");
						res.writeHead(200, {'content-type': 'text/plain'});
						res.send();
					} else {
						console.log("WATERFALL: Some Error..."+err_insertion);
						res.send(err_insertion);
					}
				});
			} else {
				console.log("WATERFALL: Error in Connection..."+err_connection);
				res.send(err_connection);
			}
		});
	});
	
}

exports.updateTask=function(req,res){
	console.log("WATERFALL: In Kanban Update...");
    var data = '';
	req.addListener('data', function(chunk) {
		data += chunk;
	});

	var datagot='';
	console.log(data);
	req.addListener('end', function() {
	   datagot = JSON.parse(data);
	   console.log('WATERFALL: data got -> '+datagot.TaskName +' '+datagot.TaskDescription +' '+datagot.EndDate);

		MongoClient.connect("mongodb://varun:varun@ds031862.mongolab.com:31862/multitenant_saas", function(err_connection, db) {
			if(!err_connection) {
				console.log("WATERFALL: Connected to Mongolab");
				db.collection('projectDetails').update({ _id: 8, "tasks.TaskId" : datagot.TaskId}, 
					{ $set: { "tasks.$.TaskName" : datagot.TaskName, 
							"tasks.$.TaskDescription" : datagot.TaskDescription, 
							"tasks.$.StartDate" : datagot.StartDate, 
							"tasks.$.EndDate" : datagot.EndDate,
							"tasks.$.AssignedTo" : datagot.AssignedTo } }, function(err_updation, records) {
					if(!err_updation) {
						console.log("WATERFALL: Card Updated Successfully...");
						res.writeHead(200, {'content-type': 'text/plain'});
						res.send();
					} else {
						console.log("WATERFALL: Some Error..."+err_updation);
						res.send(err_updation);
					}
				});
			} else {
				console.log("WATERFALL: Error in Connection..."+err_connection);
				res.send(err_connection);
			}
		});
	});
}