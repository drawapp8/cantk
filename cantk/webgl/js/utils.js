
Math.normalize = function(x, y, r)
{
    var d = Math.sqrt(x*x+y*y);
    if (d > 0.000001) {
        var id = 1.0 / d;
        r.x = x * id;
        r.y = y * id;
    }
	r.d = d;

    return r;
}

Math.cross = function(dx0, dy0, dx1, dy1) 
{ 
	return dx1*dy0 - dx0*dy1; 
}

Math.ptEquals = function(x1, y1, x2, y2, tol)
{
	var dx = x2 - x1;
	var dy = y2 - y1;
	return dx*dx + dy*dy < tol*tol;
}

Math.distPtSeg = function(x, y, px, py, qx, qy)
{
	var pqx, pqy, dx, dy, d, t;
	pqx = qx-px;
	pqy = qy-py;
	dx = x-px;
	dy = y-py;
	d = pqx*pqx + pqy*pqy;
	t = pqx*dx + pqy*dy;
	if (d > 0) t /= d;
	if (t < 0) t = 0;
	else if (t > 1) t = 1;
	dx = px + t*pqx - x;
	dy = py + t*pqy - y;
	return dx*dx + dy*dy;
}

function parseFontSize(font) {
	var fontSize = 12;
	var arr = font.match(/\d+pt|\d+px/g);
	if(arr) {
		var size = arr[0];
		fontSize = parseInt(size);
		if(size.indexOf("pt") > 0) {
			fontSize = Math.round(fontSize * 1.2);
		}
	}

	return fontSize;
}

