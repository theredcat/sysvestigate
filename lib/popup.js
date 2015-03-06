var blessed = require('blessed');

var Popup = {
	screen: null,
	setScreen: function(screen){
		this.screen = screen;
	},
	pop: function(text){
		var form = blessed.form({
			parent: this.screen,
			keys: true,
			left: "center",
			top: "center",
			width: "40%",
			height: "half",
			border: {
				type: 'line'
			},
			style: {
				bg: 'blue',
				border: {
					fg: 'yellow'
				}
			},
			content: text
		});

		var ok = blessed.button({
			parent: form,
			left: 'center',
			bottom: 1,
			mouse: true,
			keys: true,
			shrink: true,
			name: 'ok',
			content: 'OK',
			border: {
				type: 'line'
			},
			style: {
				bg: 'red',
				focus: {
					bg: 'red'
				},
				border: {
					fg: 'yellow'
				}
			}
		});
		var self = this;
		var eol = function() {
			self.screen.remove(form);
			this.screen.render();
		}

		ok.on('keypress', eol);
		ok.on('click', eol);
		form.focus();
		this.screen.render();
	}
}

module.exports = Popup
