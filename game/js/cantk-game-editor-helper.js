//////////////////////////////////////////////////////////////////////}-{
function stableSortMerge(array, compare) {
      function merge(a1, a2) {                       
        var l1 = a1.length, l2 = a2.length, l = l1 + l2, r = new Array(l);
        for (var i1 = 0, i2 = 0, i = 0; i < l;) {
          if (i1 === l1)                          
            r[i++] = a2[i2++];                                         
          else if (i2 === l2 || compare(a1[i1], a2[i2]) <= 0)
            r[i++] = a1[i1++];                     
          else  
            r[i++] = a2[i2++];                     
        }       
        return r;
      }         
      function sort(a) {
        var l = a.length, m = Math.ceil(l / 2);                        
        return (l <= 1) ? a : merge(sort(a.slice(0, m)), sort(a.slice(m))); 
      }     
      return sort(array);                   
}



UIFrameAnimation.prototype.getSupportedImageDisplay = function() {
	return ["scale", "incenter", "auto"]; 
}

UIScene.prototype.getSupportedImageDisplay = function() {
	return ["scale", "incenter", "tile", "vtile", "htile", "fit-width", "fit-height"]; 
}

UIScene.prototype.setDebug = function(debug) {
	this.debug = debug;

	return;
}

UIScene.prototype.beforePaintChildren = function(canvas) {
	var x = 0;
	var y = 0;
	var arr = [];
	var color = null;

	if(!this.debug && this.mode != Shape.MODE_EDITING) {
		return;
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(!iter.isUIFootprint) {
			continue;
		}

		arr.push(iter);
	}

	stableSortMerge(arr, function(a, b) {
		if(a.name > b.name) {
			return 1;
		}

		if(a.name < b.name) {
			return -1;
		}
		else {
			return 0;
		}
	});

	canvas.lineCap = "round";
	canvas.lineJoin = "round";
	canvas.lineWidth = 5;
	for(var i = 0; i <arr.length; i++) {
		var iter = arr[i];
		x = iter.x + (iter.w >> 1);
		y = iter.y + (iter.h >> 1);

		if(i === 0 || iter.name != arr[i-1].name) {
			if(i != 0) {
				canvas.strokeStyle = color;
				canvas.stroke();
				canvas.beginPath();
			}

			canvas.moveTo(x, y);
			color = iter.style.fillColor;
		}
		else {
			canvas.lineTo(x, y);
		}
	}
	canvas.strokeStyle = color;
	canvas.stroke();

	return;
}

UICircle.prototype.getEventNames = function() {
	var parent = this.getParent();
	if(parent && (parent.isUISprite || parent.isUISkeletonAnimation || parent.isUITransformAnimation || parent.isUIFrameAnimation)) {
		return [];
	}
	else {
		return UIElement.prototype.getEventNames.call(this);
	}
}

UIBox.prototype.getEventNames = UICircle.prototype.getEventNames;
UIPolygon.prototype.getEventNames = UICircle.prototype.getEventNames;

UISprite.prototype.getMoreSelectMark = RShape.prototype.getRotateSelectMark;
UIBox.prototype.getMoreSelectMark = RShape.prototype.getRotateSelectMark;
UIFrameAnimation.prototype.getMoreSelectMark = RShape.prototype.getRotateSelectMark;

UISoundEffects.prototype.setParent = function(parentShape) {
	Shape.prototype.setParent.call(this, parentShape);

	var wm = this.getWindowManager();
	if(wm && !wm.soundEffectURLs) {
		wm.setSoundEffectURLs("/cantk-game/assets/sound/disappear.mp3");
	}

	return this;
}

UISoundMusic.prototype.setParent = function(parentShape) {
	Shape.prototype.setParent.call(this, parentShape);

	var wm = this.getWindowManager();
	if(wm && !wm.soundMusicURLs) {
		wm.setSoundMusicURLs("/cantk-game/assets/sound/bg.mp3");
	}

	return this;
}
