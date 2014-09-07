/*
 * File:   ui-image-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Button
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageButton() {
	return;
}

UIImageButton.prototype = new UIButton();
UIImageButton.prototype.isUIImageButton = true;

UIImageButton.prototype.initUIImageButton = function(type, w, h) {
	this.initUIButton(type, w, h);
	this.noTextAlignment = true;
	this.setImage(CANTK_IMAGE_NORMAL_FG, null);
	this.setImage(CANTK_IMAGE_ACTIVE_FG, null);
	this.setImage(CANTK_IMAGE_DISABLE_FG, null);

	return this;
}

UIImageButton.prototype.drawText = function(canvas) {
	return;
}

UIImageButton.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIImageButton.prototype.drawFgImage = function(canvas) {
	var bgImage = this.getBgImage();
	var gapBetweenTextImage = 2;
	var imageActive = this.getHtmlImageByType(CANTK_IMAGE_ACTIVE_FG);
	var imageNormal = this.getHtmlImageByType(CANTK_IMAGE_NORMAL_FG);
	var imageDisable = this.getHtmlImageByType(CANTK_IMAGE_DISABLE_FG);
	var str = this.getLocaleText(this.text);
	var fontSize = this.style.fontSize;

	var x = 0;
	var y = 0;
	var w = this.w;
	var h = this.h;

	var image = null;
	if(this.enable) {
		image = this.pointerDown ? imageActive : imageNormal;
		if(this.pointerDown) {
			if(!bgImage) {
				canvas.fillStyle = this.style.fillColor;
				canvas.fillRect(0, 0, w, h);
			}
			if(!image) {
				image = imageNormal;
				canvas.translate(1, 2);
			}
		}
	}
	else {
		image = imageDisable;
	}

	canvas.font = this.style.getFont();
	canvas.fillStyle = this.enable ? this.style.textColor : "#CCCCCC";
	if(image) {
		var imageW = image.width;
		var imageH = image.height;
		var hMargin = this.hMargin;

		if(str) {
			var textW = canvas.measureText(str).width + 4;
			if(textW > w) {
				var fontSize = Math.round((w/textW) * this.style.fontSize);
				this.style.setFontSize(fontSize)
				canvas.font = this.style.getFont();
			}
			
			if(this.w > 6 * this.h) {
				var dx = x + hMargin;
				var dy = Math.floor(y + (h-imageH)/2);
				canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);

				dy = Math.floor(y + h/2);
				dx = Math.floor(x + (w-imageW)/2 + imageW);
				canvas.textAlign = "center";
				canvas.textBaseline = "middle";
				canvas.fillText(str, dx, dy);
			}
			else {
				var size = this.h - fontSize;
				var dw = Math.min(size, imageW);
				var dh = Math.min(size, imageH);
				var dx = Math.floor(x + (w-dw)/2);
				var dy = Math.floor(y + (h-dh-6)/2);
				var rect = {x:0, y:0, w:imageW, h:imageH};

				if(dy > 0 && size < imageH) {
					dy = 0;
				}

				this.drawImageAt(canvas, image, CANTK_IMAGE_DISPLAY_CENTER, dx, dy, dw, dh, rect);

				dx = Math.floor(x + w/2);
				dy = dy + dh + gapBetweenTextImage;
				if((dy + fontSize + 3) > this.h) {
					dy = this.h - fontSize - 3;
				}
				canvas.textAlign = "center";
				canvas.textBaseline = "top";
				canvas.fillText(str, dx, dy);
			}
		}
		else {
			this.drawImageAt(canvas, image, this.images.display, x, y, this.w, this.h);
		}
	}
	else {
		if(str) {
			canvas.textAlign = "center";
			canvas.textBaseline = "middle";
			canvas.fillText(str, Math.floor(x+w/2), Math.floor(y+h/2));
		}
	}

	return;
}

function UIImageButtonCreator(w, h) {
	var args = ["ui-image-button", "ui-image-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageButton();
		return g.initUIImageButton(this.type, w, h);
	}
	
	return;
}

