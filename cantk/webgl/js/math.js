(function () {
var sinTable = [];
for(var i = 0; i < 360; i++) {
	var rad = i/57.2957;
	sinTable.push(Math.sin(rad) + 0.000001);
}

Math.sinFast = function(rad) {
	var index = ((rad * 57.2957)>>0)%360;
	if(index < 0) {
		index += 360;
	}

	return sinTable[index];
}

Math.cosFast = function(rad) {
	return Math.sinFast(rad + Math.PI*0.5);
}

}());

