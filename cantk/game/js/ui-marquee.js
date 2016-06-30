function UIMarquee() {
	return;
}

UIMarquee.prototype = new UILabel();
UIMarquee.isUIMarquee = true;

UIMarquee.prototype.saveProps = ["direction", "behavior", "scrollamount", "scrolldelay", "loop", "autoPlay"];
//direction
UIMarquee.DIR_UP   = 'up';
UIMarquee.DIR_DOWN = 'down';
UIMarquee.DIR_LEFT = 'left';
UIMarquee.DIR_RIGHT= 'right';

//behavior
UIMarquee.BEHAVIOR_SCROLL = 'scroll';
UIMarquee.BEHAVIOR_SLIDE  = 'slide';
UIMarquee.BEHAVIOR_ALTERNATE = 'alternate';

//loop
UIMarquee.LOOP_INFINITE = 'infinite';

//scrollamount
UIMarquee.DEFAULT_SCROLL_AMOUNT = 1;//px

//scrolldelay
UIMarquee.DEFAULT_SCROLL_DELAY  = 20;//ms

UIMarquee.prototype.initUIMarquee = function(type, initText, bg) {
	this.initUIElement(type);	

	this.setText(initText);
	this.setDefSize(200, 200);
	this.setMargin(5, 5);
	this.running = false;
	this.scrollCounter = 0;
	this.timeScale = 1;
	this.autoPlay = false;
	this.setTextType(Shape.TEXT_TEXTAREA);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.addEventNames(["onChanged", "onUpdateTransform", "onPlayStepDone", "onPlayDone"]);

	return this;
}

var configLeftResolve = {
	onScroll: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.rect(0, 0, 0, 0);
			canvas.clip();
			return;
		}
		scrollDis = scrollDis%(w+textLen);
		if(scrollDis <= textLen) {
			canvas.rect(w - textLen, 0, textLen, h);	
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
			if(this.done) {
				this.backText = this.text;
				this.text = "";
			}
		}
		else if(scrollDis >= w) {
			canvas.rect(0, 0, textLen, h);
			canvas.clip();
			this.needStep = true;
		}
		canvas.translate(w - scrollDis, 0);
	},
	onSlide: function(canvas, scrollDis, textLen, textHeight, w, h) {	
		if(this.done) return;
		scrollDis%=w;
		if(scrollDis <= textLen) {
			canvas.rect(w-textLen, 0, textLen, h);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
		}
		else {
			this.needStep = true;
		}
		canvas.translate(w - scrollDis, 0);
	},
	onAlternate: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.translate(w-textLen, 0);
			return;
		}
		var odd = parseInt(scrollDis/(w-textLen), 10)%2 > 0;
		var dis = parseInt(scrollDis%(w-textLen), 10);
			dis = odd ? w-textLen-dis : dis;
		if(odd) {
			this.needStep = true;
		}
		else if(!odd && this.needStep){
			this.callOnStep();
		}

		canvas.translate(w - textLen - dis, 0);
	}
};

var configUpResolve = {
	onScroll: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.rect(0, 0, 0, 0);
			canvas.clip();
			return;
		}
		scrollDis = scrollDis%(h+textHeight);
		if(scrollDis <= textHeight) {
			canvas.rect(0, h - textHeight, w, textHeight);	
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
			if(this.done) {
				this.backText = this.text;
				this.text = "";
			}
		}
		else if(scrollDis >= h) {
			canvas.rect(0, 0, w, h);
			canvas.clip();
			this.needStep = true;
		}
		canvas.translate(0, h - scrollDis);
	},
	onSlide: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			return;
		}
		scrollDis%=h;
		if(scrollDis <= textHeight) {
			canvas.rect(0, h-textHeight, w, textHeight);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
		}
		else {
			this.needStep = true;
		}
		canvas.translate(0, h - scrollDis);
	},
	onAlternate: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.translate(0, h - textHeight);
			return;
		}
		var odd = parseInt(scrollDis/(h-textHeight), 10)%2 > 0;
		var dis = parseInt(scrollDis%(h-textHeight), 10);
			dis = odd ? h-textHeight-dis : dis;
		if(odd) {
			this.needStep = true;
		}
		else if(!odd && this.needStep) {
			this.callOnStep();
		}

		canvas.translate(0, h - textHeight - dis);
	}
};

var configRightResolve = {
	onScroll: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.rect(0, 0, 0, 0);
			canvas.clip();
			return;
		}
		scrollDis%=(w+textLen);
		if(scrollDis >= w) {
			this.needStep = true;
			canvas.rect(w-textLen, 0, textLen, h);
			canvas.clip();
		}
		else if(scrollDis <= textLen) {
			canvas.rect(0, 0, textLen, h);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
			if(this.done) {
				this.backText = this.text;
				this.text = "";
			}
		}
		canvas.translate(scrollDis - textLen, 0);
	},
	onSlide: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.translate(w - textLen, 0);	
			return;
		}
		scrollDis%=w;
		if(scrollDis <= textLen) {
			canvas.rect(0, 0, textLen, h);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
		}
		else {
			this.needStep = true;
		}
		canvas.translate(scrollDis - textLen, 0);
	},
	onAlternate: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			return;
		}
		var odd = parseInt(scrollDis/(w-textLen), 10)%2 > 0;
		var dis = parseInt(scrollDis%(w-textLen), 10);
			dis = odd ? w-textLen-dis : dis;

		if(odd) {
			this.needStep = true;
		}
		if(!odd && this.needStep) {
			this.callOnStep();
		}

		canvas.translate(dis, 0);
	}
};

var configDownResolve = {
	onScroll: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.rect(0, 0, 0, 0);	
			canvas.clip();
			return;
		}
		scrollDis%=(h+textHeight);
		if(scrollDis <= textHeight) {
			canvas.rect(0, 0, w, textHeight + scrollDis);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
			if(this.done) {
				this.backText = this.text;
				this.text = "";
			}
		}
		else if(scrollDis >= h) {
			canvas.rect(0, h - textHeight, w, textHeight);	
			canvas.clip();
			this.needStep = true;
		}
		canvas.translate(0, scrollDis - textHeight);
	},
	onSlide: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			canvas.translate(0, h - textHeight);	
			return;
		}
		scrollDis%=h;
		if(scrollDis <= textHeight) {
			canvas.rect(0, 0, w, textHeight);
			canvas.clip();
			if(this.needStep) {
				this.callOnStep();
			}
		}
		else {
			this.needStep = true;
		}
		canvas.translate(0, scrollDis - textHeight);
	},
	onAlternate: function(canvas, scrollDis, textLen, textHeight, w, h) {
		if(this.done) {
			return;
		}
		var odd = parseInt(scrollDis/(h-textHeight), 10)%2 > 0;
		var dis = parseInt(scrollDis%(h-textHeight), 10);
			dis = odd ? h-textHeight-dis : dis;
		if(odd) {
			this.needStep = true;
		}
		else if(this.needStep && !odd) {
			this.callOnStep();
		}
		canvas.translate(0, dis);
	}
};


UIMarquee.makeResolve = function(hAlign, vAlign, handlers) {
	return function(canvas) {
		var w = this.getWidth(true),
			h = this.getHeight(true),
			timeStep = canvas.timeStep;

		var scrollDis = parseInt(this.scrollCounter*this.scrollamount/this.scrolldelay, 10);

		canvas.font = this.style.getFont();
		var text = this.getLocaleText(this.text);
		var textLen = canvas.measureText(text).width;
		var textHeight = parseInt(canvas.font);

		this.hTextAlign = hAlign;
		this.vTextAlign = vAlign;

		var args = [canvas, scrollDis, textLen, textHeight, w, h];
		switch(this.behavior) {
			case UIMarquee.BEHAVIOR_SCROLL: {
				handlers.onScroll.apply(this, args);
				break;
			}
			case UIMarquee.BEHAVIOR_SLIDE: {
				handlers.onSlide.apply(this, args);
				break;
			}
			case UIMarquee.BEHAVIOR_ALTERNATE: {
				handlers.onAlternate.apply(this, args);
				break;
			}
			default: {
				throw new Error('unknow behavior');
			}
		}
	};
}

UIMarquee.prototype.leftResolve = UIMarquee.makeResolve('left', 'middle', configLeftResolve); 
UIMarquee.prototype.rightResolve = UIMarquee.makeResolve('left', 'middle', configRightResolve); 
UIMarquee.prototype.upResolve = UIMarquee.makeResolve('center', 'up', configUpResolve); 
UIMarquee.prototype.downResolve = UIMarquee.makeResolve('center', 'up', configDownResolve); 

UIMarquee.prototype.update = function(canvas) {
	var timeStep = canvas.timeStep;

	if(timeStep < this.scrolldelay) timeStep = this.scrolldelay;

	this.scrollCounter += (this.timeScale*timeStep);

	switch(this.direction) {
		case UIMarquee.DIR_RIGHT: {
			this.rightResolve(canvas);
			break;
		}
		case UIMarquee.DIR_LEFT: {
			this.leftResolve(canvas);
			break;
		}
		case UIMarquee.DIR_UP: {
			this.upResolve(canvas);
			break;
		}
		case UIMarquee.DIR_DOWN: {
			this.downResolve(canvas);
			break;
		}
		default: {
			throw new Error("unknow UIMarquee.direction:" + this.direction);
		}
	}
}

UIMarquee.prototype.onInit = function() {
	if(this.autoPlay) {
		this.play();
	}

	return;
}

UIMarquee.prototype.drawText = function(canvas) {
	this.layoutText(canvas);
	if((this.running || this.done) && !this.isInDesignMode()) {
		this.update(canvas);
		this.defaultDrawText(canvas);
	}

	if(this.isInDesignMode()) {
		this.defaultDrawText(canvas);
	}

	return;
}

UIMarquee.prototype.initOpts = function(config, onDone, onStep) {
	if(typeof config === 'function') {
		onStep = onDone;
		onDone = config;
		config = {};
	}

	this.onStep = onStep || config.onStep;
	this.onDone = onDone || config.onDone;
	this.direction = config.direction || this.direction || UIMarquee.DIR_RIGHT;
	this.behavior = config.behavior || this.behavior || UIMarquee.BEHAVIOR_SCROLL;
	this.loop = config.loop > 0 ? config.loop : (this.loop ? this.loop : UIMarquee.LOOP_INFINITE);
	this.backloop = this.loop;
	this.scrolldelay = config.scrolldelay || this.scrolldelay || UIMarquee.DEFAULT_SCROLL_DELAY;
	this.scrollamount = config.scrollamount || this.scrollamount || UIMarquee.DEFAULT_SCROLL_AMOUNT;

	return this;
}

UIMarquee.prototype.play = function(config, onStep, onDone) {
	config = config || {};
	this.initOpts(config, onStep, onDone);
	this.reset();
	this.started = true;
	this.running = true;
	this.done = false;
	this.text = this.backText ? this.backText : this.text;

	return this;
}

UIMarquee.prototype.reset = function() {
	this.timeScale = 1;
	this.scrollCounter = 0;
	this.needStep = false;
	this.loop = this.backloop;
}

UIMarquee.prototype.restart = function() {
	if(!this.started) return;
	this.running = true;
	this.done = false;
	this.text = this.backText ? this.backText : this.text;
	this.reset();
	return this;
}

UIMarquee.prototype.stop = function() {
	this.reset();
	this.running = false;
	return this;
}

UIMarquee.prototype.pause = function() {
	if(!this.running) return;

	this.timeScale = 0;
	return this;
}

UIMarquee.prototype.resume = function() {
	if(!this.running) return;

	this.timeScale = 1;
	return this;
}

UIMarquee.prototype.callOnStep = function() {
	this.needStep = false;
	if(this.loop !== UIMarquee.LOOP_INFINITE) {
		--this.loop;
		if(this.loop === 0) {
			this.callOnDone();
			return;
		}
	}

	if(typeof this.onStep === 'function') {
		if(!this.onStep()) {
			this.callOnDone();
			return;
		}
	}

	return this;
}

UIMarquee.prototype.callOnDone = function() {
	if(typeof this.onDone === 'function') {
		this.onDone();
	}

	this.done = true;
	this.stop();

	return this;
}

function UIMarqueeCreator() {
	var args = ["ui-marquee", "ui-marquee", null, 1];	

	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMarquee();
		return g.initUIMarquee(this.type, dappGetText("Text"), null);
	}
}

ShapeFactoryGet().addShapeCreator(new UIMarqueeCreator());
