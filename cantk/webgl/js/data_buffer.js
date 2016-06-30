function Int16DataBuffer(initSize) {
	this.size = 0;
	this.capacity = initSize;

	this.buffer = new ArrayBuffer(initSize * 2);
	this.init16Buffer = new Int16Array(this.buffer);
}

Int16DataBuffer.prototype.extendTo = function(size) {
	var buffer = new ArrayBuffer(size * 2);
	var init16Buffer = new Int16Array(buffer);

	init16Buffer.set(this.init16Buffer, 0);

	this.capacity = size; 
	this.buffer = buffer;
	this.init16Buffer = init16Buffer;
}

Int16DataBuffer.prototype.extendIfFull = function(n) {
	if((this.size + n) > this.capacity) {
		this.extendTo(Math.round(this.capacity * 1.2) + n);
	}
}

Int16DataBuffer.prototype.pushX = function() {
	var arr = arguments;
	var n = arr.length;
	var offset = this.size;
	this.extendIfFull(n);

	this.size += n;
	var buffer = this.init16Buffer;
	for(var i = 0; i < n; i++, offset++) {
		buffer[offset] = arr[i];
	}

	return this;
}

Int16DataBuffer.prototype.push1 = function(a) {
	this.extendIfFull(1);
	this.init16Buffer[this.size++] = a;

	return this;
}

Int16DataBuffer.prototype.push2 = function(a, b) {
	this.extendIfFull(2);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;

	return this;
}

Int16DataBuffer.prototype.push3 = function(a, b, c) {
	this.extendIfFull(3);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;
	this.init16Buffer[this.size++] = c;

	return this;
}

Int16DataBuffer.prototype.push4 = function(a, b, c, d) {
	this.extendIfFull(4);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;
	this.init16Buffer[this.size++] = c;
	this.init16Buffer[this.size++] = d;

	return this;
}

Int16DataBuffer.prototype.push5 = function(a, b, c, d, e) {
	this.extendIfFull(5);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;
	this.init16Buffer[this.size++] = c;
	this.init16Buffer[this.size++] = d;
	this.init16Buffer[this.size++] = e;

	return this;
}

Int16DataBuffer.prototype.push6 = function(a, b, c, d, e, f) {
	this.extendIfFull(6);
	this.init16Buffer[this.size++] = a;
	this.init16Buffer[this.size++] = b;
	this.init16Buffer[this.size++] = c;
	this.init16Buffer[this.size++] = d;
	this.init16Buffer[this.size++] = e;
	this.init16Buffer[this.size++] = f;

	return this;
}

Int16DataBuffer.prototype.reset = function() {
	this.size = 0;
}

Int16DataBuffer.prototype.getReadBuffer = function() {
	var buffer = new Int16Array(this.buffer, 0, this.size);
	buffer.size = this.size;

	return buffer;
}

Int16DataBuffer.prototype.getWriteBuffer = function(n) {
	this.extendIfFull(n);
	var buffer = this.init16Buffer;

	return buffer;
}

Int16DataBuffer.prototype.getBufferType = function() {
	return "init16";
}

Int16DataBuffer.prototype.getElementBytes = function() {
	return 2;
}

Int16DataBuffer.prototype.dup = function() {
	var db = Int16DataBuffer.create(this.size);

	var n = this.size;
	db.size = this.size;
	var src = this.init16Buffer;
	var dst = db.init16Buffer;

	for(var i = 0; i < n; i++) {
		dst[i] = src[i];
	}

	return db;
}

Int16DataBuffer.create = function(initSize) {
	var db = new Int16DataBuffer(initSize);

	return db;
}

Int16DataBuffer.prototype.dump = function() {
	var n = this.size;
	var buffer = this.init16Buffer;

	console.log(this.size + " " + this.capacity + " " + this.getBufferType() + " " + this.getElementBytes());

	console.log(Array.prototype.join.call(buffer, ","));
}

Int16DataBuffer.test = function() {
	var db = Int16DataBuffer.create(4);
	db.pushX(1, 2, 3, 3, 5, 6, 7, 8, 9, 10, 11);
	db.dump();

	var buffer = db.getReadBuffer();
	console.log("buffer(" + buffer.length + ")["+ Array.prototype.join.call(buffer, ",") + "]");
}

Int16DataBuffer.test();
