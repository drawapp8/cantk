UIElement.prototype.getScence= function() {
	return this.getWindow();
}

UIElement.prototype.getFootprints = function(name) {
	var x = 0;
	var y = 0;
	var footPrints = [];
	var arr = this.isUIWindow ? this : this.getParent().children;

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(!iter.isUIFootprint) {
			continue;
		}

		if(name && name != iter.name) {
			continue;
		}

		x = iter.x + (iter.w >> 1);
		y = iter.y + (iter.h >> 1);

		footPrints.push({x:x, y:y});
	}

	return footPrints;
}

UIElement.prototype.moveAlongPath = function(name, duration, onDone) {
	var d = 0;
	var dx = 0;
	var dy = 0;
	var moveInfo = {};
	var distances = [];
	var totalDistance = 0;
	var footPrints = this.getFootprints(name);

	if(!footPrints.length) {
		console.log("no footprint found.");
	}

	for(var i = 0; i < footPrints.length; i++) {
		var iter = footPrints[i];
		if(i) {
			dx = footPrints[i].x - footPrints[i-1].x;
			dy = footPrints[i].y - footPrints[i-1].y;

			d = Math.sqrt(dx*dx+dy*dy);
			distances.push(d);
			totalDistance += d;
		}
	}

	moveInfo.onDone = onDone;
	moveInfo.duration = duration;
	moveInfo.distances = distances;
	moveInfo.footPrints = footPrints;
	moveInfo.totalDistance = totalDistance;

	this.startMove(moveInfo);

	return;
}

UIElement.prototype.startMove = function(moveInfo) {
	var x = 0;
	var y = 0;
	var index = 0;
	var me = this;
	var hw = this.w >> 1;
	var hh = this.h >> 1;

	var duration = moveInfo.duration;
	var distances = moveInfo.distances;
	var footPrints = moveInfo.footPrints;
	var totalDistance = moveInfo.totalDistance;

	function moveToNext() {
		if((index+1) >= moveInfo.footPrints.length) {
			if(moveInfo.onDone) {
				moveInfo.onDone();
			}

			return;
		}

		var start = Date.now();
		var endPoint = footPrints[index+1];
		var startPoint = footPrints[index];
		var dt = duration * (distances[index]/totalDistance);
		var dx = endPoint.x - startPoint.x;
		var dy = endPoint.y - startPoint.y;

		var angle = Math.asin(Math.abs(dy)/Math.sqrt(dx * dx + dy * dy));

		if(dy <= 0 && dx < 0 ) {
			angle = Math.PI - angle;
		}
		
		if(dy > 0 && dx < 0 ) {
			angle = Math.PI + angle;
		}
		
		if(dy > 0 && dx >= 0 ) {
			angle = 2 * Math.PI - angle;
		}

		angle = -angle;
		function step() {
			var percent = (Date.now() - start)/dt;
			if(percent < 1) {
				x = startPoint.x + dx * percent - hw;
				y = startPoint.y + dy * percent - hh;

				me.setPosition(x, y);
				me.setRotation(angle);
				me.postRedraw();

				UIElement.setAnimTimer(step);
			}
			else {
				index++;
				x = endPoint.x - hw;
				y = endPoint.y - hh;

				me.setPosition(x, y);
				me.postRedraw();
				moveToNext();
			}
		}

		step();
	}

	moveToNext();

	return;
}

UIElement.prototype.callOnBeginContact = function(body) {
	if(this.onBeginContact) {
		this.onBeginContact(body);

		return;
	}

	if(!this.handleOnBeginContact || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onBeginContact"];
		if(sourceCode) {
			sourceCode = "this.handleOnBeginContact = function(body) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnBeginContact) {
		try {
			this.handleOnBeginContact(body);
		}catch(e) {
			console.log("this.handleOnBeginContact:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnEndContact = function(body) {
	if(this.onEndContact) {
		this.onEndContact(body);

		return;
	}

	if(!this.handleOnEndContact || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onEndContact"];
		if(sourceCode) {
			sourceCode = "this.handleOnEndContact = function(body) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnEndContact) {
		try {
			this.handleOnEndContact(body);
		}catch(e) {
			console.log("this.handleOnEndContact:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;

	if(this.body) {
		var p = {};

		p.x = Physics.toMeter(x); 
		p.y = Physics.toMeter(y); 
		this.body.SetPosition(p);
	}

	return;
}

UIElement.prototype.setPositionByBody = function(x, y) {
	this.x = x;
	this.y = y;

	return;
}
