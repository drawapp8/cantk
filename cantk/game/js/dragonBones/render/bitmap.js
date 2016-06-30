function Bitmap() {
    DisplayObject.call(this);
    this.texture;
    this.needDraw;
}

__extends(Bitmap, DisplayObject);

Bitmap.prototype.init = function() {
    DisplayObject.prototype.init.call(this);
    this.needDraw = true;
};

Bitmap.prototype.setTexture = function(texture) {
    this.texture = texture;
    if(texture) {
        this.setWidth(texture.dw);
        this.setHeight(texture.dh);
    }
    return this;
};

Bitmap.prototype.getTexture = function() {
    return this.texture;
};

Bitmap.prototype.drawSelf = function(ctx) {
    var dw;
    var dh;
    var dx;
    var dy;
    var sx;
    var sy;
    var sw;
    var sh;
    var texure;

    if(!this.texture) {
        return;
    }

    texture = this.texture;
    dw = texture.dw;
    dh = texture.dh;
    dx = texture.dx;
    dy = texture.dy;
    sx = texture.sx;
    sy = texture.sy;
    sw = texture.sw;
    sh = texture.sh;

    ctx.drawImage(texture.texture, sx, sy, sw, sh, dx, dy, dw, dh);

    return;
};

Bitmap.create = function(name) {
    var bitmap = new Bitmap();
    bitmap.xname = name;
    bitmap.init();
    return bitmap;
};
