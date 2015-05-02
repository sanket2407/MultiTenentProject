var ejs = require('ejs');
var mysql = require('mysql');

function getConnection() {
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'welcome1',
		database : 'cmpe281',
		multipleStatements : true
	});
	return connection;
}

exports.list = function(req, res) {

	var loggedInUser = req.session.user;

	if (loggedInUser == null) {
		res.redirect("/login");
	} else {

		var userid = req.params.userid;
		console.log("comming");
		var connection = getConnection();
		var sqlQuery = "select p1.project_id, p1.project_name, p1.project_description, p2.model_name, p1.userid, p1.start_date, p1.end_date from project_master p1 join project_models p2 on p2.model_id = p1.project_type where userid = '"
				+ userid + "' ";
		connection.query(sqlQuery, function(err, rows, fields) {
			if (err) {
				console.log("Error Selecting : %s", err);
				res.render('projectlist', {
					error : "",
					data : "error in fetching data"
				});
			} else if (rows.length === 0) {
				res.render('projectlist1', {
					error : "",
					data : rows
				});
			} else {
				console.log(rows);
				res.render('projectlist1', {
					error : "",
					data : rows
				});
			}
		});
	}
};

exports.edit = function(req, res) {
	
	var loggedInUser = req.session.user;

	if (loggedInUser == null) {
		res.redirect("/login");
	} else {
	
	
	var userid = req.params.userid;
	var projectid = req.params.projectid;
	res.render('editproject', {
		error : "",
		userid : userid,
		projectid : projectid
	});
	}
};
