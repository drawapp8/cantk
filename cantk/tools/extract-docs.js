
var fs = require("fs");
var path = require("path");

var myArgs = process.argv.slice(2);
var node = process.argv[0];
var cmd = process.argv[1];

if(myArgs.length < 2) {
	console.log("usage: "+node + " "+cmd+" inputfile ouputdir\n");
	process.exit(0);
}
else {
	inputFile = myArgs[0];
	outputDir = myArgs[1];

	console.log("input file:" + inputFile);
	console.log("output dir:" + outputDir);
	console.log("----------------------------------------------------");
}

var source = fs.readFileSync(inputFile).toString('utf8');
var arr = source.match(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm);

var str = "";
for(var i = 0; i < arr.length; i++) {
	var comment = arr[i];
	if(comment.indexOf("@class") > 0 || comment.indexOf("@property") > 0 
			|| comment.indexOf("@method") > 0 || comment.indexOf("@event") > 0) {
		str += comment + "\n\n";
	}
}

if(str) {
	var fileName = outputDir + "/" + path.basename(inputFile);
	fs.writeFileSync(fileName, str);
}
