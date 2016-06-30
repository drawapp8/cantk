function DisplayObject() {
    this.visible;
    this.parent;
    this.name;
    this.x;
    this.y;
    this.width;
    this.height;
    this.scaleX;
    this.scaleY;
    this.anchorX;
    this.anchorY;
    this.anchorOffsetX;
    this.anchorOffsetY;
    this.rotation;
    this.alpha;
    this.worldAlpha;
    this.blendMode;
    this.needDraw;

    this.localMatrix;
    this.worldTransform;
}

DisplayObject.create = function() {
    var obj = new DisplayObject();
    obj.init();
    return obj;
};

var BlendMode = {
	NORMAL: "normal",
	ADD: "add",
	ERASE: "erase",
    ERASE_REVERSE: "eraseReverse"
};

DisplayObject.prototype.blendModes = {};
DisplayObject.prototype.blendModes[BlendMode.NORMAL] = "source-over";
DisplayObject.prototype.blendModes[BlendMode.ADD] = "lighter";
DisplayObject.prototype.blendModes[BlendMode.ERASE] = "destination-out";
DisplayObject.prototype.blendModes[BlendMode.ERASE_REVERSE] = "destination-in";

DisplayObject.prototype.init = function() {
    this.scaleX = 1;
    this.scaleY = 1;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.anchorOffsetX = 0;
    this.anchorOffsetY = 0;
    this.anchorX = 0;
    this.anchorY = 0;
    this.skewX = 0;
    this.skewY = 0;
    this.name = "";
    this.rotation = 0;
    this.alpha = 1;
    this.worldAlpha = 1;
    this.blendMode = null;
    this.parent = null;
    this.visible = true;
    this.needDraw = false;
    this.localMatrix = null;
    this.worldTransform = new Matrix();
};

DisplayObject.prototype.setParent = function(parent) {
    this.parent = parent;
    return this;
};

DisplayObject.prototype.getParent = function() {
    return this.parent;
};

DisplayObject.prototype.setScale = function(scaleX, scaleY) {
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    return this;
};

DisplayObject.prototype.setAnchorOffset = function(ox, oy) {
    this.anchorOffsetX = ox;
    this.anchorOffsetY = oy;
    return this;
};

DisplayObject.prototype.setAnchor = function(x, y) {
    this.anchorX = x;
    this.anchorY = y;
    return this;
};

DisplayObject.prototype.isVisible = function() {
    return this.visible;
};

DisplayObject.prototype.setVisible = function(v) {
    this.visible = v;
    return this;
};

DisplayObject.prototype.setRotation = function(r) {
    this.rotation = r;
    return this;
};

DisplayObject.prototype.setAlpha = function(alpha) {
    this.alpha = alpha;
    return this;
};

DisplayObject.prototype.setSkewX = function(kx) {
    this.skewX = kx;
    return this;
};

DisplayObject.prototype.setSkewY = function(ky) {
    this.skewY = ky;
    return this;
};

DisplayObject.prototype.setBlend = function(b) {
    this.blendMode = b;
    return this;
};

DisplayObject.prototype.getBlend = function(b) {
    return this.blendMode;
};

DisplayObject.prototype.setWidth = function(w) {
    this.width = w;
    return this;
};

DisplayObject.prototype.getWidth = function() {
    return this.width;
};

DisplayObject.prototype.setHeight = function(h) {
    this.height = h;
    return this;
};

DisplayObject.prototype.getHeight = function() {
    return this.height;
};

DisplayObject.prototype.setWorldAlpha = function(alpha) {
    this.worldAlpha = alpha;
    return this;
};

DisplayObject.prototype.getWorldAlpha = function() {
    return this.worldAlpha;
};

DisplayObject.prototype.needDraw = function() {
    return !!this.needDraw;
};

DisplayObject.prototype.setNeedDraw = function(b) {
    this.needDraw = b;
    return this;
};

DisplayObject.prototype.setTransform = function(matrix) {
    this.localMatrix = matrix;
    return this;
};

DisplayObject.prototype.draw = function(ctx) {
    var matrix,
        blendMode;

    if(!this.visible) {
        return;
    }

    if(this.blendMode) {
        blendMode =  this.blendModes[this.blendMode];
    }
    else {
        blendMode = this.blendModes[BlendMode.NORMAL];
    }

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.globalCompositeOperation = blendMode;
    matrix = this.worldTransform;
    ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    this.drawSelf(ctx);
    ctx.restore();

    return;
};

DisplayObject.prototype.getOffsetPoint = function() {
    var regX = this.anchorOffsetX;
    var regY = this.anchorOffsetY;

    return {x: regX, y: regY};
};


DisplayObject.prototype.calcWorldTransform = function() {
    var parent;
    var transform;
    var localMatrix;

    parent = this.parent;
    localMatrix = this.localMatrix;
    transform = this.worldTransform;
    if(parent) {
        transform.identityMatrix(parent.worldTransform);
    }
    else {
        transform.identityMatrix(new Matrix);
    }
    var offset = this.getOffsetPoint();
    var anchorX = offset.x;
    var anchorY = offset.y;

    if(localMatrix) {
        transform.append(localMatrix.a, localMatrix.b,
            localMatrix.c, localMatrix.d, localMatrix.tx, localMatrix.ty);
        transform.append(1, 0, 0, 1, -anchorX, -anchorY);
    }
    else {
        transform.appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, anchorX, anchorY);
    }

    if(parent) {
        this.worldAlpha = parent.worldAlpha * this.alpha;
    }
    else {
        this.worldAlpha = this.alpha;
    }

    return;
};

DisplayObject.prototype.doTransform = function(ctx) {
    if(!this.visible) {
        return;
    }

    this.calcWorldTransform();

    if(this.needDraw) {
        this.draw(ctx);
    }

    return;
};
