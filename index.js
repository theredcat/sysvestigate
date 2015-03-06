global.__rootdir = __dirname;

var path = require('path');

var blessed = require('blessed');
var contrib = require('blessed-contrib');

var SVPopup = require(path.join(__dirname ,'lib','popup.js'))

var screen = blessed.screen();
screen.title = 'Sysvestigate';

SVPopup.setScreen(screen);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0);
});

var gridGlobal = new contrib.grid({rows: 1, cols: 2});
var gridWorkspace = new contrib.grid({rows: 3, cols: 3});
var gridTools = new contrib.grid({rows: 1, cols: 2});


gridTools.set(0, 0, 1, 1, contrib.table, { keys: true, fg: 'white', label: 'Plugins', columnSpacing: [0] } );
//gridTools.set(0, 1, 1, 1, contrib.table, { keys: false, fg: 'white', label: 'Tools', columnSpacing: [0] } );
gridGlobal.set(0, 0, 1, 1, gridTools);
gridGlobal.set(0, 1, 1, 1, gridWorkspace);
gridGlobal.applyLayout(screen);

var pluginTable = gridTools.get(0,0);

var pluginsList = [
	"apache",
	"system"
];
var plugins = {};

for(var i = 0; i <  pluginsList.length; i++){
	try{
		var plugin = plugins[pluginsList[i]] = require(path.join(__rootdir,'plugins',pluginsList[i]));
	}catch(e){
		console.error(e);
	}
}
var showHidePluginTools = function(data){
	var i = 0;
	var item;
	while(item = pluginTable.rows.getItem(i)){
		console.log(item.content,item.type,item.focused);
		i++;
	}
	var pluginsDisplay = {
		headers: [''],
		data: []
	};
	for(plugin in plugins){
		pluginsDisplay.data.push(["+ "+plugins[plugin].get('name')])
	}
	pluginTable.focus();
	pluginTable.setData(pluginsDisplay);
	
	screen.render();
}
pluginTable = gridTools.get(0,0);
pluginTable.rows.key(['right','+','space'],showHidePluginTools);
pluginTable.rows.select(function(e){console.log(1,e);});
showHidePluginTools();
