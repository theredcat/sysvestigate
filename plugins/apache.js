var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var jsdom = require('jsdom');
var jquery = fs.readFileSync(path.join(__rootdir,'node_modules','jquery','dist','jquery.min.js'));

var SVPlugin = require(path.join(__rootdir,'lib','plugin'));
var SVPluginTable = require(path.join(__rootdir,'lib','pluginTable'));

var filter = function(text){
	return text.replace('\n','').trim();
}

var apache = new SVPlugin({
	name: 'Apache',
	desc: 'List request handled by apache',
	collector: {
		main: function(callback){
			jsdom.env({
				url: 'http://127.0.0.1/server-status',
				src: [jquery],
				done: function (errors, window) {

					var $ = window.jQuery;
					processes = {
						columnsFull: [
							'Id',
							'Number of restart',
							'Current PID',
							'Number of accesses this connection',
							'Number of accesses this child',
							'Number of accesses this slot',
							'Mode of operation',
							'CPU usage in seconds',
							'Seconds since beginning of most recent request',
							'Milliseconds required to process most recent request',
							'Kilobytes transferred this connection',
							'Megabytes transferred this child',
							'Megabytes transferred this slot',
							'Client IP',
							'VHost',
							'Request'
						],
						columns: [
							'Id',
							'# of Restart',
							'PID',
							'Open connection',
							'# of access (conn)',
							'# of access (child)',
							'# of access (slot)',
							'Mode',
							'CPU',
							'SS',
							'Req',
							'Conn',
							'Child',
							'Slot',
							'Client',
							'VHost',
							'Request'
						],
						data: {}
					};

					$('body table:eq(0) tr:gt(0)').each(function(i,tr){

						var process = [];

						$(tr).find('td').each(function(j,td){
							switch(j){
								case 0:
									var child = filter(td.text()).split('-');
									proccess.push(child[0]);
									proccess.push(child[1]);
								break;

								case 2:
									var acc = filter(td.text().split('/'));
									proccess.push(acc[0]);
									proccess.push(acc[1]);
									proccess.push(acc[2]);
								break;

								case 1:
								case 3:
								case 4:
								case 5:
								case 6:
								case 7:
								case 8:
								case 9:
								case 10:
								case 11:
								case 12:
									proccess.push(filter(td.text()));
								break;
							}
						})

						processes.data[process[0]] = process;
					});
					callback(processes);
				}
			});
		}
	},
	exports: {
		'Worker PID': {
			type: 'pid',
			collector: 'main',
			extractor: function(data,callback){
				
				var pids = {};
				for(var i in data){
					pids[i] = data[i][2];
				}
				callback(pids);
			}
		}
	},
	menu: {
		"Server Status" : new SVPluginTable({
			collector: 'main'
		})
	}
});
module.exports = apache;
