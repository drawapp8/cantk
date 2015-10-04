var CanvasRenderer = (function () {
	var BlendMode = {
		NORMAL: "normal",
		ADD: "add",
		ERASE: "erase",
        ERASE_REVERSE: "eraseReverse"
	};

    function CanvasRenderer(canvas) {
        this.texture_scale_factor = 1;
    }

    var defaultCanvasId = 'x-canvas';
    var defaultCanvasWidth = 1280;
    var defaultCanvasHeight= 800;

	CanvasRenderer.prototype.setScale = function(scaleX, scaleY) {
		this.container.scaleX = scaleX;
		this.container.scaleY = scaleY;
	}

	CanvasRenderer.prototype.setPosition = function(x, y) {
		this.container.x = x;
		this.container.y = y;
	}

	CanvasRenderer.prototype.uninit = function() {
		this.container = null;
		this.canvasContext = null;
	}

    CanvasRenderer.prototype.init = function(canvas) {
//    	if(this.canvasContext) return;
        this.canvasContext = canvas;
        var f = this.canvasContext.setTransform;
        this.bkTransform = f;
        var that = this;

        this.canvasContext.setTransform = function (a, b, c, d, tx, ty) {
            that._matrixA = a;
            that._matrixB = b;
            that._matrixC = c;
            that._matrixD = d;
            that._matrixTx = tx;
            that._matrixTy = ty;
            this.transform(a, b, c ,d, tx, ty);
//            f.call(that.canvasContext, a, b, c, d, tx, ty);
        };
        this._matrixA = 1;
        this._matrixB = 0;
        this._matrixC = 0;
        this._matrixD = 1;
        this._matrixTx = 0;
        this._matrixTy = 0;
        this._transformTx = 0;
        this._transformTy = 0;
        this.initBlendMode();
    }

    CanvasRenderer.prototype.clearScreen = function () {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    CanvasRenderer.prototype.startRender = function () {
        this.canvasContext.save();
    }

    CanvasRenderer.prototype.endRender = function () {
        this.canvasContext.restore();
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.setTransform = this.bkTransform;
        this.bkTransform = null;
    }

    CanvasRenderer.prototype.drawImage = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, renderType) {
        if (renderType === void 0) { renderType = undefined; }
        destX += this._transformTx;
        destY += this._transformTy;
        this.canvasContext.drawImage(texture._bitmapData, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    }

    CanvasRenderer.prototype.setTransform = function (matrix) {
        //在没有旋转缩放斜切的情况下，先不进行矩阵偏移，等下次绘制的时候偏移
        if (matrix.a == 1 && matrix.b == 0 && matrix.c == 0 && matrix.d == 1 && this._matrixA == 1 && this._matrixB == 0 && this._matrixC == 0 && this._matrixD == 1) {
            this._transformTx = matrix.tx - this._matrixTx;
            this._transformTy = matrix.ty - this._matrixTy;
            return;
        }
        this._transformTx = this._transformTy = 0;
        if (this._matrixA != matrix.a || this._matrixB != matrix.b || this._matrixC != matrix.c || this._matrixD != matrix.d || this._matrixTx != matrix.tx || this._matrixTy != matrix.ty) {
            this.canvasContext.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        }
    }

    CanvasRenderer.prototype.setAlpha = function (alpha, blendMode) {
        this.canvasContext.globalAlpha = alpha;
        if (blendMode) {
            this.blendValue = this.blendModes[blendMode];
            this.canvasContext.globalCompositeOperation = this.blendValue;
        }
        else if (this.blendValue != BlendMode.NORMAL) {
            this.blendValue = this.blendModes[BlendMode.NORMAL];
            this.canvasContext.globalCompositeOperation = this.blendValue;
        }
    }

    CanvasRenderer.prototype.initBlendMode = function () {
        this.blendModes = {};
        this.blendModes[BlendMode.NORMAL] = "source-over";
        this.blendModes[BlendMode.ADD] = "lighter";
        this.blendModes[BlendMode.ERASE] = "destination-out";
        this.blendModes[BlendMode.ERASE_REVERSE] = "destination-in";
    }

    return CanvasRenderer;
})();
