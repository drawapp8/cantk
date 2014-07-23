
function WinMainController(win) {
	var me = this;
	var viewPager = win.findChildByName("ui-view-pager", true);
	var expr = win.findChildByName("ui-label-expr", true);

	this.appendText = function(text) {
		var viewPager = win.findChildByName("ui-view-pager", true);

		viewPager.switchTo(0);
		win.setValueOf("ui-button-advance", "π...");

		expr.setText(expr.getText() + text);

		return;
	}

	this.onAdvanceButtonClicked = function() {
		if(viewPager.current) {
			viewPager.switchTo(0);
			this.setText("π...");
		}
		else {
			viewPager.switchTo(1);
			this.setText("123...");
		}
	}

	this.fixExpr = function(str) {
		var left = 0;
		var right = 0;

		str = str.replace(/π/g, "PI");
		for(var i = 0; i < str.length; i++) {
			var c = str[i];

			if(c == '(') {
				left++;
			}
			if(c == ')') {
				right++;
			}
		}

		for(var i = right; i < left; i++) {
			str += ')';
		}

		return str;
	}

	this.onComputeButtonClicked = function() {
		try {
			var str = expr.getText();
		
			str = this.fixExpr(str);
			str = Parser.evaluate(str).toString();

			var n = str.indexOf('.');
			if(n >= 0) {
				n = n + 9;
				n = Math.min(n, str.length);
				str = str.substr(0, n);
			}
			expr.setText(str);
		}catch(e) {
			alert(e.message);
		}

		return;
	}

	this.onClearButtonClicked = function() {
		expr.setText("");

		return;
	}
	
	this.onBackspaceButtonClicked = function() {
		var text = expr.getText();
		if(text) {
			text = text.substr(0, text.length-1);
			expr.setText(text);
		}

		return;
	}

	this.onNormalButtonClick = function(button) {
		var text = button.getText();

		switch(text) {
			case '0': 
			case '1': 
			case '2': 
			case '3': 
			case '4': 
			case '5': 
			case '6': 
			case '7': 
			case '8': 
			case '9': 
			case '*': 
			case '/': 
			case '+': 
			case '-': 
			case '.': 
			case '(': 
			case ')': 
			case '^': 
			case 'π': {
				this.appendText(text);
				break;
			}
			default: {
				this.appendText(text + "(");
				break;
			};
		}

		return;
	}
}

function createWinMainController(win) {
	win.controller = new WinMainController(win);

	return win.controller;
}
