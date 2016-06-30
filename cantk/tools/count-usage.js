var stats = {
};

function TDocument() {
}

TDocument.magic = "cantk";
TDocument.prototype.loadString = function(str) {
	try {
		var json = JSON.parse(str.toString());
		this.loadJson(json);
	}catch(e) {
		console.log(str.toString());
		console.log("loadString:" + e.message);
	}

	return this;
}

TDocument.prototype.getEmptyDoc = function() {
	var doc = {};
	doc.version = 2;
	doc.magic = TDocument.magic;

	return doc;
}

TDocument.prototype.getLocales = function() {
	if(!this.doc.locales) {
		this.doc.locales = {
			"default":{}, 
			"en":{}, 
			"zh": {} 
		};
	}

	return this.doc.locales;
}

TDocument.prototype.getAssetsConfig = function() {
	var meta = this.getMeta();

	return meta.assetsConfig || TDocument.getDefaultAssetsConfig();
}

TDocument.prototype.getAssetsConfigStr = function() {
	var config = this.getAssetsConfig();

	return JSON.stringify(config, null, "\t");
}

TDocument.prototype.setAssetsConfigStr = function(str) {
	try {
		var config = JSON.parse(str);
		this.setAssetsConfig(config);
	}catch(e) {
		console.log("setAssetsConfigStr:" + e.message);
	}

	return this;
}

TDocument.prototype.setAssetsConfig = function(config) {
	var meta = this.getMeta();
	meta.assetsConfig = config;

	return this;
}

TDocument.getDefaultAssetsConfig = function() {
	if(!TDocument.defaultAssetsConfig) {
		var c = {};
		c.assets = {};
		c.assets.sizes = ["1280x800", "480x800"];
		c.assets.densities = ["hdpi", "xhdpi"];
		c.assets.languages = ["en", "zh"]

		c.design = {};
		c.design.size = "480x800";
		c.design.density = "hdpi";
		c.design.language = "en";

		c.map = {}
		c.map.size = {
			"1280x720":"480x800",
			"480x800":"480x800"
		};
		c.map.density = {
			"ldpi":"hdpi",
			"mdpi":"hdpi",
			"xhdpi":"hdpi",
			"xxhdpi":"hdpi"
		};
		c.map.language = {
			"en":"en",
			"zh":"en"
		}

		TDocument.defaultAssetsConfig = c;
	}

	return TDocument.defaultAssetsConfig;
}

TDocument.prototype.setLocales = function(locales) {
	this.doc.locales = locales;

	return this;
}

TDocument.prototype.getMetaInfo = TDocument.prototype.getMeta = function() {
	return this.doc.meta;
}

TDocument.prototype.getDocID = function() {
	return this.doc.docid;
}

TDocument.prototype.loadV1 = function(json) {
	if(!json.pages || !json.pages[0].shapes || !json.pages[0].shapes[0].children) {
		return this;
	}

	var doc = this.getEmptyDoc();
	doc.meta = json.meta;
	doc.docid = json.docid;

	var device = json.pages[0].shapes[0];
	function forEach(shape) {

		if(shape.type === "ui-window-manager") {
			doc.wm = shape;

			return;
		}

		if(shape.children) {
			var n = shape.children.length;
			for(var i = 0; i < n; i++) {
				var iter = shape.children[i];
				forEach(iter);
			}
		}
	}

	forEach(device);

	doc.deviceConfig = device.config;
	this.loadV2(doc);

	return ;
}

TDocument.prototype.forEach = function(shape) {
	var type = shape.type;
	var count = stats[type] ? stats[type] + 1: 1;
	stats[type] = count;

	if(!shape.children) {
		return;
	}

	var n = shape.children.length;
	for(var i = 0; i < n; i++) {
		var iter = shape.children[i];
		this.forEach(iter);
	}

	return;
}

TDocument.prototype.loadV2 = function(json) {
	this.forEach(json.wm);

	return;
}

TDocument.prototype.loadJson = function(json) {
	if(!json) return this;

	if(json.magic === "drawapps") {
		this.loadV1(json);
	}
	else if(json.magic === TDocument.magic) {
		this.loadV2(json);	
	}
	else {
		console.log("invalid json");
	}

	return this;
}

var fs = require("fs");
var zlib = require('zlib');
var path = require('path');

function exists(pathName){  
	return fs.existsSync(pathName);
}  

function isFile(pathName){  
	return exists(pathName) && fs.statSync(pathName).isFile();  
} 

function count(fileName, onDone) {
	if(!fs.existsSync(fileName)) {
		if(onDone) {
			onDone();
		}
		return;
	}

	if(fileName.indexOf(".jso") < 0) {
		if(onDone) {
			onDone();
		}
		console.log("Skip Dir " + fileName);
		return;
	}

	var tempFileName = "temp" + fileName.replace(/\//g, "-");
	var tempFile = fs.createWriteStream(tempFileName);
	var inputFile = fs.createReadStream(fileName);
	var unzipStream = zlib.createGunzip();
	inputFile.pipe(unzipStream).pipe(tempFile);
	
	tempFile.on('close', function(){
		console.log("Count " + fileName + "...");
		var str = fs.readFileSync(tempFileName);
		var doc = new TDocument();

		doc.loadString(str);
		
		console.log(JSON.stringify(stats, null, "\t"));
		fs.unlinkSync(tempFileName);
		
		if(onDone) {
			onDone();
		}
	});
	
	unzipStream.on("error", function() {
		console.log("unzip error " + fileName);
		if(onDone) {
			onDone();
		}
	});
	inputFile.on("error", function() {
		console.log("read error " + fileName);
		if(onDone) {
			onDone();
		}
	});
	tempFile.on("error", function() {
		console.log("write error " + fileName);
		if(onDone) {
			onDone();
		}
	});
}

var myArgs = process.argv.slice(2);
var i = 0;
var n = myArgs.length;

function countOne() {
	var fileName = myArgs[i].replace(/"/g, "");
	count(fileName, function() {
		i++;
		if(i < n) {
			countOne();
		}
	});
}

countOne();

