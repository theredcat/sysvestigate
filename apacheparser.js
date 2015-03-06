var fs = require('fs');
var path = require('path');
var dateformat = require('dateformat');
var request = require('request');
var jsdom = require('jsdom');
var exec = require('child_process').exec;
var jquery = fs.readFileSync(path.join(__dirname,"node_modules","jquery","dist","jquery.min.js"));
var os = require("os");

var reqLimit = 45;

try{
	fs.mkdirSync(path.join(__dirname,'reports'));
}catch(e){}

try{
	fs.mkdirSync(path.join(__dirname,'reports',os.hostname()));
}catch(e){}

var refresh = function(){
	jsdom.env({
		url: "http://127.0.0.1/server-status",
		src: [jquery],
		done: function (errors, window) {
			var $ = window.jQuery;
			var reqs = parseInt($("body dl:eq(1) dt:eq(7)").text().split(" ")[0]);
			if(reqs > reqLimit){
				console.log('More than '+reqLimit+' threads running, generating dump');
				var now = new Date();
				var reportPath = path.join(__dirname,'reports',os.hostname(),dateformat(now, "yyyymmdd_HHMMss"));
				fs.mkdirSync(reportPath);
				fs.writeFile(path.join(reportPath,'server-status'),$('html')[0].outerHTML);
				$('body table:eq(0) tr:gt(0)').each(function(i,e){
					var state = $(e).find('td:eq(3)').text().replace("\n",'');
					if(state == "W"){
						var pid = $(e).find('td:eq(1)').text();
						exec('lsof -np '+pid, function (error, stdout, stderr) {
							fs.write(path.join(reportPath,pid.'.lsof');
						})
					}
				});
			}
		}
	});
}

refresh();

