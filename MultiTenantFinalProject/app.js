
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var connection  = require('express-myconnection'); 
var mysql = require('mysql'),
  index=require('./routes/index'),
  kanban=require('./routes/kanban'),
  user = require('./routes/user'),
  waterfall=require('./routes/waterfall'),
  mongoDao = require('./routes/mongoDao');
  

//load customers routes
var users = require('./routes/users');  
var signup = require('./routes/signup');
var login = require('./routes/login');
var home = require('./routes/home');

//load project routes
var project = require('./routes/project');

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

// all environments
app.set('port', process.env.PORT || 4303);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://10.189.177.48:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    
    connection(mysql,{
    	
        host: 'localhost',
        user: 'root',
        password : 'welcome1',
        port : 3306, //port mysql
        database:'cmpe281'
    },'pool') //or single

);

//user crud and index
app.get('/', login.login);
app.get('/login', login.login);
app.get('/signup', signup.signup);
app.post('/users/signup',users.signup);
app.post('/users/login',users.loginAuthentication);
app.get('/users/edit',users.edit);
app.post('/users/edit_save/:userid',users.edit_save);
app.post('/users/delete/:email',users.delete_user);
app.get('/home', home.showDashboard);
app.post('/createProject', home.createProject);
app.get('/logout', users.logout);
//project
app.get('/projects/:userid',project.list);
app.get('/projects/edit/:userid/:projectid',project.edit);
app.get('/addProject',home.addProject);


app.get('/scrum/:projectid', index.getSprintDetails);
app.get('/users', user.list);
app.get('/sprint',routes.getSprintData);
app.get('/kanban/:projectid',kanban.getCardDara);
app.get('/waterfall/:projectid',waterfall.getTaskData);

/*app.post('/scrum/newSprint',routes.newSprint);
app.post('/scrum/updateSprint',routes.updateSprint);

app.post('/kanban/newKanban',kanban.newKanban);
app.post('/kanban/updateKanban',kanban.updateKanban);

app.post('/waterfall/newTask',waterfall.newTask);
app.post('/waterfall/updateTask',waterfall.updateTask);*/

app.post('/newData', mongoDao.newData);
app.post('/updateData', mongoDao.updateData);


app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
