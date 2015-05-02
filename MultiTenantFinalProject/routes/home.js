var mysql = require('./mysql');
var MongoClient = require('mongodb').MongoClient;

exports.showDashboard = function(req, res) {

	var loggedInUser = req.session.user;

	if (loggedInUser == null) {
		res.redirect("/login");
	} else {
		/*res.render('home', {
						title : 'Welcome',
						error : ""
					});
		 */
		res.redirect('/projects/'+loggedInUser);
		
	}

};


exports.addProject = function(req, res) {

	var loggedInUser = req.session.user;

	if (loggedInUser == null) {
		res.redirect("/login");
	} else {
	
		res.render('addProject', { title: 'Express' });
	}

};


exports.createProject = function(req, res) {

	console.log(req);
	var loggedInUser = req.session.user;

	if (loggedInUser == null) {
		res.redirect("/login");
	} else {

		
		var projectName = req.body.projectName;
		var projectDesc = req.body.projectDesc;
		var startDate = new Date(req.body.startDate);
		var endDate =  new Date(req.body.endDate);
		var projectType = req.body.projectType;
		var projectTypeInt;
		

				if (projectType === "Scrum") {
			projectTypeInt = 1;
		} else if (projectType === "Kanban") {
			projectTypeInt = 2;
		} else if (projectType === "Waterfall") {
			projectTypeInt = 3;
		}
			
		startDate = startDate.toISOString().split('T')[0];
		endDate = endDate.toISOString().split('T')[0];
		
		
		var createUser ="INSERT INTO project_master (project_name,project_description,project_type,userid,start_date,end_date) " +
				"VALUES ('"+projectName+"','"+ projectDesc+"','"+ projectTypeInt+"','"+loggedInUser+"','"+startDate+"','"+endDate+"')";
		

				mysql.fetchData(function(err2, result) {
			if (err2) {
				throw err2;
			} else {
				//Insert data to MongoDB
				
				var data = { "_id": result.insertId};
				
				MongoClient.connect("mongodb://varun:varun@ds031862.mongolab.com:31862/multitenant_saas", function(err1, db) {
					if(!err1) {
						
						db.collection('projectDetails').insert(data, function(err, records) {
							if(!err) {
								res.send("OK");
							} else {
								throw err;
							}
						});
					} else {
						throw err1;
					}
				});			
			}
		}, createUser);
	} 
};


