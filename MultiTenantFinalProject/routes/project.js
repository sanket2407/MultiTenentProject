var ejs = require('ejs');
var mysql = require('mysql');

function getConnection() {
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'root',
		database : 'cmpe281',
		multipleStatements : true
	});
	return connection;
}

exports.list = function(req, res) {

	var loggedInUser = req.session.user;

	if (loggedInUser === null) {
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
				res.render('projectlist', {
					error : "",
					data : rows
				});
			} else {
				console.log(rows);
				res.render('projectlist', {
					error : "",
					data : rows
				});
			}
		});
	}
};

exports.edit = function(req, res) {
	
	var loggedInUser = req.session.user;

	if (loggedInUser === null) {
		res.redirect("/login");
	} else 
	{
	
	var userid = req.params.userid;
	var projectid = req.params.projectid;

	var connection = getConnection();
	var sqlQuery = "select project_type from project_master where userid='"+userid+"' and project_id='"+projectid+"'";
			
	connection.query(sqlQuery, function(err, rows, fields) {
		if (err) {
			console.log("Error Selecting : %s", err);
			res.render('editproject', {
				error : "",
				data : "error in fetching data"
			});
		} else {
			if(rows[0].project_type === 1){
				console.log("came at scrum");
				res.redirect('/scrum/'+projectid);
			}
			else if(rows[0].project_type === 2){
				res.redirect('/kanban/'+projectid);
			}
			else if(rows[0].project_type === 3){
				res.redirect('/waterfall/'+projectid);
			}else{
				res.render('error', {
					error : "No model type available"
				});
			}
		}
	});
}
};