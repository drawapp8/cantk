function DisplayObjectContainer() {
    DisplayObject.call(this);
    this.children;
    this.isContainer;
}

__extends(DisplayObjectContainer, DisplayObject);

DisplayObjectContainer.prototype.init = function() {
    DisplayObject.prototype.init.call(this);
    this.children = [];
    this.visible = true;
    this.isContainer = true;
};

DisplayObjectContainer.prototype.getChildCount = function() {
    return this.children.length;
};

DisplayObjectContainer.prototype.addChild = function(child, index) {
    var num;

    num = this.children.length;
    if(child.parent === this) {
        num--;
    }

    return this.addChildAt(child, num);
};

DisplayObjectContainer.prototype.addChildAt = function(child, index) {
    if(child === this) {
        return;
    }

    if(child.parent === this) {
        this.setChildIndex(child, index);
    }
    else {
        if(child.parent) {
            this.parent.removeChild(child);
        }
        this.children.splice(index, 0, child);
        child.setParent(this);
    }

    return child;
};

DisplayObjectContainer.prototype.setChildIndex = function(child, index) {
    var idx;

    idx = this.children.indexOf(child);
    if(idx >= 0) {
        this.children.splice(idx, 1);
        if(index < 0 || this.children.length <= index) {
            this.children.push(child);
        }
        else {
            this.children.splice(index, 0, child);
        }
    }

    return;
};

DisplayObjectContainer.prototype.removeAllChild = function() {
    this.children = [];
};

DisplayObjectContainer.prototype.removeChild = function(child) {
    var index;

    index = this.children.indexOf(child);
    if(index >= 0) {
        return this.removeChildByIndex(index);
    }

    return;
};

DisplayObjectContainer.prototype.removeChildByIndex = function(index) {
    var child;

    child = this.children[index];
    child.setParent(null);
    this.children.splice(index, 1);

    return child;
};

DisplayObjectContainer.prototype.getChildIndex = function(child) {
    return this.children.indexOf(child);
};

DisplayObjectContainer.prototype.updateTransform = function(ctx) {
    if(!this.visible) {
        return;
    }

    this.doTransform(ctx);
    if(this.isContainer && this.children.length) {
        for(var i = 0, len = this.children.length; i < len; i++) {
            var it = this.children[i];
            if(it.isContainer) {
                it.updateTransform(ctx);
            }
            else {
                it.doTransform(ctx);
            }
        }
    }
};

DisplayObjectContainer.prototype.drawSelf = function(ctx) {
    //TODO
};

DisplayObjectContainer.create = function() {
    var container = new DisplayObjectContainer();
    container.init();

    return container;
};
