var mysql = require('./mysql');

exports.showDashboard = function(req, res) {

	var loggedInUser = req.session.user;

	if (loggedInUser == null) {
		res.redirect("/login");
	} else {
		res.render('home', {
			title : 'Welcome',
			error : ""
		});
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
		var startDate = req.body.startDate;
		var endDate = req.body.endDate;
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
				res.send("OK");
			}
		}, createUser);

	} 
};


