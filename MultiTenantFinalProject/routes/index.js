
/*
 * GET home page.
 */
var mysql=require('./mysql');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;


exports.index = function(req, res){
  res.render('scrum', { title: 'Express' });
};

exports.getSprintDetails=function(req,res){
	
	var loggedInUser = req.session.user;

	if (loggedInUser == null) {
		res.redirect("/login");
	} else {
	
		var sql="select field_name,parent_field  from model_fields_master where model_type=1;";

		mysql.fetchData(function(err,results){
			
			if(err)
				{
				throw err;
				}
			else
				{
				
				var sprintFields=[];
				var backlogFields=[];
				// var i=0;
				for(var i=0;i<results.length;i++){
					console.log(results[i].parent_field);
					if(results[i].parent_field=="sprint"){
						sprintFields.push(results[i].field_name);
					}
					else if(results[i].parent_field=="story"){
						backlogFields.push(results[i].field_name)
					}
				}
				
				
				var pid = parseInt(req.params.projectid);
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
			            		  res.render('scrum',{sprintFields:sprintFields,backlogFields:backlogFields,sprintsData:sprintData,pid:pid});
								// res.send(404);
							} else {
								console.log("@@@@@@@");
								

							    console.log("@@@@" + req.session.startDate);
							    console.log("@@@@" + req.session.endDate);

								var totalPoints = 0;
								var hoursWorked = 0;
								var isInteger = 0;
								var date1 = new Date(req.session.startDate);		// start
																					// date
								var date2 = new Date(req.session.endDate);          // end
																					// date
								var timeDiff = Math.abs(date2.getTime() - date1.getTime()); 
								var diffDays = (Math.ceil(timeDiff / (1000 * 3600 * 24))) + 1;					
								
								var totalWeeks = Math.ceil(diffDays / 7);								
								var startDateArray  = req.session.startDate.split("-");
								var startDate = startDateArray[1];
								var startMonth = startDateArray[0];

								
								console.log(docs[0].details);
								sprintData=JSON.stringify(docs[0].details);
								
								if(docs[0].details != undefined)
									{
								
								for(var i=0 ; i < docs[0].details.length; i++)
									{
									
									   console.log(docs[0].details[i].TotalPoints);
									   isInteger = parseInt(docs[0].details[i].TotalPoints);
									   
									   if(docs[0].details[i].TotalPoints != undefined && docs[0].details[i].TotalPoints != NaN)
										   {
										   totalPoints = parseInt(totalPoints) + parseInt(docs[0].details[i].TotalPoints);
										   hoursWorked = parseInt(hoursWorked) + parseInt( docs[0].details[i].TotalPoints -  docs[0].details[i].RemainingPoints); 
										   
										   }
									  
									}
								}
								
								
										console.log("total time is "+ totalPoints);
										console.log("hours worked is "+ hoursWorked);
										console.log("start date is " + req.session.startDate);
										console.log("end date is "+  req.session.endDate);				
										
										console.log('total weeks are'  + totalWeeks);
										console.log('start date is ' + startDate);
										console.log('start month is' + startMonth);
										

										var c1 = startMonth+"/"+startDate;								
										var categories = [c1];								
										var originalArray = [totalPoints];
										var definedWork = Math.ceil(totalPoints / diffDays);
										while (totalPoints > 0)
											{
											    totalPoints = totalPoints -  (7 * definedWork);
											   
											    if(totalPoints < 0)
											    	{
											    	totalPoints = 0;
											    	}
											    originalArray.push(totalPoints);
											}
								
								
																
								var cur = new Date().toString().split(" ");
								console.log(cur);
								curDate = cur[2];
								
								console.log('cur date is'  + curDate);
								
								var curWeek = Math.ceil(curDate / 7);							
								var remainingWeeks = totalWeeks - curWeek;								
								var remainingWork = originalArray[0] - hoursWorked;								
								var remainingPerDay = remainingWork / (remainingWeeks * 7);								
								var remainArray = [];

								console.log('remianing weeks are'+ remainingWeeks);
								console.log('remaining work is' + remainingWork);
								console.log('remainingi per day is' + remainingPerDay);
								console.log('cur week is' + curWeek);
							    remainArray.push(originalArray[0]);
								
								for(var j=0 ; j < curWeek ; j++)
									{
									
									   var workDone = originalArray[0] -  (hoursWorked / curWeek);
									   remainArray.push(workDone);
									}
							
								if(hoursWorked > 0)
									{
								while (remainingWork > 0)
								{
									remainingWork = remainingWork -  (1 * hoursWorked);
								   
								    if(remainingWork < 0)
								    	{
								    	remainingWork = 0;
								    	}
								    remainArray.push(remainingWork);
								    
								}
									}
								
								
								console.log(remainArray);								
								console.log(categories);
								console.log(originalArray);
							
								}
															
			            		  res.render('scrum',{sprintFields:sprintFields,backlogFields:backlogFields,sprintsData:sprintData,pid:pid,
			            			  categories: categories, originalArray: originalArray , remainingWork : remainArray});
							});
			            		  
			      		
					}

					 else {
						console.log("Error in Connection");
					}
				});

				
				}
		},sql);
			
	}
};

exports.getSprintData=function(req,res){
	// mongo code to get sprint data
	// var data='{sprintData:[ { "Sprint Id":"1";"Sprint No":"2";"Sprint
	// Description":"testing data" }]}';
	// res.send(JSON.parse(data));
};

