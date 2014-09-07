var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var dragonBones;

(function (dragonBones) {
    (function (display) {
        var GeneralDisplayBridge = (function () {
            function GeneralDisplayBridge() {
            }

            GeneralDisplayBridge.prototype.getVisible = function () {
                return this._display ? this._display.visible : false;
            };
            GeneralDisplayBridge.prototype.setVisible = function (value) {
                if (this._display) {
                    this._display.visible = value;
                }
            };

            GeneralDisplayBridge.prototype.getDisplay = function () {
                return this._display;
            };

            GeneralDisplayBridge.prototype.setDisplay = function (value) {
            	this._display = value;
            };

            GeneralDisplayBridge.prototype.dispose = function () {
                this._display = null;
            };

            GeneralDisplayBridge.prototype.updateTransform = function (matrix, transform) {
                this._display.x = matrix.tx;
                this._display.y = matrix.ty;
                this._display.skewX = transform.skewX * GeneralDisplayBridge.RADIAN_TO_ANGLE;
                this._display.skewY = transform.skewY * GeneralDisplayBridge.RADIAN_TO_ANGLE;
                this._display.scaleX = transform.scaleX;
                this._display.scaleY = transform.scaleY;
            };

            GeneralDisplayBridge.prototype.updateColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier) {
                if (this._display) {
                    this._display.alpha = aMultiplier;
                }
            };

            GeneralDisplayBridge.prototype.addDisplay = function (container, index) {
            };

            GeneralDisplayBridge.prototype.removeDisplay = function () {
            };
            
            GeneralDisplayBridge.RADIAN_TO_ANGLE = 180 / Math.PI;

            return GeneralDisplayBridge;
        })();
        display.GeneralDisplayBridge = GeneralDisplayBridge;
    })(dragonBones.display || (dragonBones.display = {}));
    var display = dragonBones.display;

    (function (textures) {
        var GeneralTextureAtlas = (function () {
            function GeneralTextureAtlas(image, textureAtlasRawData, scale) {
                if (typeof scale === "undefined") { scale = 1; }
                this._regions = {};

                this.image = image;
                this.scale = scale;

                this.parseData(textureAtlasRawData);
            }

            GeneralTextureAtlas.prototype.dispose = function () {
                this.image = null;
                this._regions = null;
            };

            GeneralTextureAtlas.prototype.getRegion = function (subTextureName) {
                return this._regions[subTextureName];
            };

            GeneralTextureAtlas.prototype.parseData = function (textureAtlasRawData) {
                var textureAtlasData = dragonBones.objects.DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
                this.name = textureAtlasData.__name;
                delete textureAtlasData.__name;

                for (var subTextureName in textureAtlasData) {
                    this._regions[subTextureName] = textureAtlasData[subTextureName];
                }
            };
            return GeneralTextureAtlas;
        })();
        textures.GeneralTextureAtlas = GeneralTextureAtlas;
    })(dragonBones.textures || (dragonBones.textures = {}));
    var textures = dragonBones.textures;
	
	function armatureInit(armature) {
		var m = new Matrix();
		
		armature.scale = 1;

		armature.setScale = function(scaleX, scaleY) {
			var display = this.getDisplay();
		
			display.scaleX = scaleX;
			display.scaleY = scaleY;

			return;
		}

		armature.getScaleX = function() {
			return this.getDisplay().scaleX;
		}

		armature.getScaleY = function() {
			return this.getDisplay().scaleY;
		}

		armature.setPosition = function(x, y) {
			var display = this.getDisplay();

			display.x = x;
			display.y = y;

			return;
		}

		armature.getX = function() {
			return this.getDisplay().x;
		}
		
		armature.getY = function() {
			return this.getDisplay().y;
		}

		armature.setSkew = function(skewX, skewY) {
			var display = this.getDisplay();

			display.skewX = skewX;
			display.skewY = skewY;

			return;
		}

		armature.setPosition(0, 0);
		armature.setScale(1, 1);
		armature.setSkew(0, 0);

		function slotDraw(slot, ctx) {
			var display = slot._displayBridge.getDisplay();
			var texture = slot.getDisplay().textureAtlas;

			if(!texture) {
				var armatureDisplay = slot.getDisplay();
				var armature = armatureDisplay.armature;

				if(armature.draw) {
					armature.draw(ctx);
				}

				return;
			}

			var image = texture.image;
			var r = display.textureAtlasRect;

			ctx.save();
			m.identity();
			m.appendTransform(display.x, display.y, display.scaleX, display.scaleY, 0, 
				display.skewX, display.skewY, display.anchorX, display.anchorY);
			ctx.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
			ctx.drawImage(image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
			ctx.restore();
		}

		armature.draw = function(ctx) {
			var slot = null;
			var i = this._slotList.length;
			var display = this.getDisplay();

			ctx.save();
			m.identity();
			m.appendTransform(display.x, display.y, display.scaleX, display.scaleY, 0, 
				display.skewX, display.skewY, 0, 0);
			ctx.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);

			while (i--) {
				slot = this._slotList[i];
				slotDraw(slot, ctx);
			}			
			ctx.restore();
		}

		return armature;
	}


    (function (factorys) {
        var GeneralFactory = (function (_super) {
            __extends(GeneralFactory, _super);
            function GeneralFactory() {
                _super.call(this);
            }
            GeneralFactory.prototype._generateArmature = function () {
            	var display = {};
                var armature = new dragonBones.Armature(display);
				display.armature = armature;

                return armatureInit(armature);
            };

            GeneralFactory.prototype._generateSlot = function () {
            	var bridge = new display.GeneralDisplayBridge();
                var slot = new dragonBones.Slot(bridge);

                return slot;
            };

            GeneralFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
                var shape = {};
                var rect = textureAtlas.getRegion(fullName);

                if (rect) {
                    shape.textureAtlas = textureAtlas;
                    shape.fullName = fullName;
                    shape.anchorX = pivotX;
                    shape.anchorY = pivotY;
                    shape.textureAtlasRect = rect;
                }

                return shape;
            };

            return GeneralFactory;
        })(factorys.BaseFactory);
        factorys.GeneralFactory = GeneralFactory;
    })(dragonBones.factorys || (dragonBones.factorys = {}));
    var factorys = dragonBones.factorys;
})(dragonBones || (dragonBones = {}));

