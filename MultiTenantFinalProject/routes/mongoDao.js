/**
 * mongoDao.js File
 */
var MongoClient = require('mongodb').MongoClient;

/**
 * Function to ADD data in the MongoDB projectDetails collection
 */
exports.newData = function(req,res) {
	console.log("In Add Function...");

	var data = '';
	var dataGot = '';

	//getting JSON object from GUI
	req.addListener('data', function(chunk) {
		data += chunk;
	});
	console.log(data);
	
	req.addListener('end', function() {
		dataGot = JSON.parse(data);

		//MongoDB Connection
		MongoClient.connect("mongodb://varun:varun@ds031862.mongolab.com:31862/multitenant_saas", function(err_connection, db) {
			if(!err_connection) {
				console.log("Connected to Mongolab");
				db.collection('projectDetails').update({ _id: 6}, { $push: { details: dataGot } }, function(err_insertion, records) {
					if(!err_insertion) {
						console.log("Data Inserted Successfully...");
						db.close();
						res.writeHead(200, {'content-type': 'text/plain'});
						res.send();
					} else {
						console.log("Some Error..."+err_insertion);
						db.close();
						res.send(err_insertion);
					}
				});
			} else {
				console.log("Error in Connection..."+err_connection);
				res.send(err_connection);
			}
		});
	});
}

/**
 * Function to UPDATE data in the MongoDB projectDetails collection
 */
exports.updateData = function(req,res) {
	console.log("In Update Function...");

    var tenant = '';
	var data = '';
	var dataGot = '';
	var updateVal = {};
	var updateCriteria = {};
   		
	//getting tenant type to store its data in the MongoDB
	tenant = 'scrum';//req.session.projectType;
	console.log(tenant);

	//getting JSON object from GUI
	req.addListener('data', function(chunk) {
		data += chunk;
	});
	console.log(data);

	req.addListener('end', function() {
		dataGot = JSON.parse(data);

		//adding data in projectDetails 
		if (tenant.toString() === 'scrum') {
			updateCriteria['StoryId'] = dataGot.StoryId;
		} else if (tenant.toString() === 'kanban') { 
			updateCriteria['CardId'] = dataGot.CardId;
		} else {
			updateCriteria['TaskId'] = dataGot.TaskId;
		}
		updateVal["details"] = updateCriteria;

		//MongoDB Connection
		MongoClient.connect("mongodb://varun:varun@ds031862.mongolab.com:31862/multitenant_saas", function(err_connection, db) {
			if(!err_connection) {
				console.log("Connected to Mongolab");
				db.collection("projectDetails", function(err, collection) {
					collection.update({ _id: 6 }, { $pull: updateVal }, function(err_updation, records) {
						if(!err_updation) {
							console.log("Sprint Pulled Successfully...");
							collection.update({ _id: 6 }, { $addToSet: { details: dataGot } }, function(err_AddToSet, records) {
								if(!err_AddToSet) {
									console.log("Sprint Updated Successfully...");
									db.close();
									res.writeHead(200, {'content-type': 'text/plain'});
									res.send("OK");
								} else {
									console.log("Some Error updating..."+err_AddToSet);
									db.close();
									res.send(err_AddToSet);
								}
							});
						} else {
							console.log("Some Error pulling..."+err_updation);
							res.send(err_updation);
						}
					});
				});
			} else {
				console.log("Error in Connection..."+err_connection);
				res.send(err_connection);
			}
		});
	});
}