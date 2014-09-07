////////////////////////////////////////////////////////////////////////////////////

function DeviceLocalFileSystem() {
	this.rootEntry = null;
	this.fileSystem = null;
	
	this.setContentType = function(contentType) {
		this.contentType = contentType;

		return;
	}
	
	this.setInitPath = function(path) {
		return path;
	}
	
	this.setVirtualRoot = function(path) {
		return path;
	}

	this.init = function() {
		var me = this;	

		function gotFS(fileSystem) {
			console.log("gotFS");
			me.fileSystem = fileSystem;
			me.rootEntry = fileSystem.root;
			
			return;
		}

		function getFsFail(error) {
			console.log("requestFileSystem failed: " + error);

			return;
		}

		console.log("init");

		window.requestFileSystem(1, 2*1024*1024, gotFS, getFsFail);
	}

	this.list = function (path, onItems) {
		var onGetDirectoryOK = function(dirEntry) {
			function onReadEntriesOK(entries) {
				var items = [];
				for (var i=0; i<entries.length; i++) {
					var item = {};
					var iter = entries[i];
					
					if(iter.name.indexOf(".") === 0) {
						continue;
					}

					item.size = 0;
					item.mtime = 0;
					item.name = iter.name;
					item.type = iter.isDirectory ? "folder" : "file";
					
					iter.getMetadata(function(metadata) {
						item.mtime = metadata.modificationTime;
					}, function(error) {
					});
					items.push(item);
				}
				onItems(items);
				
				console.log("onReadEntriesOK");
			}

			function readEntriesFail(error) {
				onItems(null);
			}

			var directoryReader = dirEntry.createReader();
			directoryReader.readEntries(onReadEntriesOK, readEntriesFail);
			console.log("onGetDirectoryOK");

			return;
		}
		
		function onGetDirectoryFail(error) {
			console.log("error getting dir:" + path)
		}

		console.log("list");
		this.fileSystem.root.getDirectory(path, {create: true, exclusive: false}, onGetDirectoryOK, onGetDirectoryFail);
		return;
	}

	this.read = function(filename, onContent) {
		function gotFile(file) {
        	var reader = new FileReader();
        	reader.onloadend = function(evt) {
        		onContent(filename, evt.target.result);
        	};
        	reader.readAsText(file);

        	return;
		}

		function getFileFail(error) {
			console.log("getFile Failed: " + filename);
		}
		
		function gotFileEntry(fileEntry) {
			fileEntry.file(gotFile, getFileFail);

			return;
		}

		this.fileSystem.root.getFile(filename, {create: false, exclusive: false}, gotFileEntry, getFileFail);

		return;
	}
	
	this.remove = function(filename, onDone) {
		function onError(e) {
			onDone(false);
			console.log('Remove File Fail:' + filename);
			return;
		}

		this.fileSystem.root.getFile(filename, {create: false}, function(fileEntry) {
			fileEntry.remove(function() {
				onDone(true);
				console.log('File removed:' + filename);
			}, onError);
		}, onError);

		return;
	}

	this.save = function(filename, content, onDone) {
		function win(writer) {
			writer.onerror = function(evt) {
				console.log("write failed:" + filename);
				onDone(false, filename);
			};

			if(writer.length) {
				writer.truncate(0);
				console.log("truncate " + filename);
				writer.onwriteend = function(evt) {
					console.log("writer.truncate done");

					writer.onwriteend = function(evt) {
						console.log("write success:" + filename);
						onDone(true, filename);
					}
					writer.write(content);
				}
			}
			else {
				writer.onwriteend = function(evt) {
					console.log("write success:" + filename);
					onDone(true, filename);
				}
				writer.write(content);
			}

			return;
		}

		function fail(error) {
			alert(dappGetText("Write File Failed: " + filename));
			console.log("getFile Failed: " + filename + " code:" + error.code);
		}
		
		function gotFileEntry(fileEntry) {
			fileEntry.createWriter(win, fail);
			return;
		}
	
		this.fileSystem.root.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);

		return;
	}

	this.init();

	return;
}

////////////////////////////////////////////////////////////////////////////////////

function WebStorageFileSystem() {
	this.setContentType = function(contentType) {
		this.contentType = contentType;

		return;
	}

	this.setInitPath = function(cwd) {
		return "/";
	}
	
	this.setVirtualRoot = function(path) {
		return "/";
	}

	this.fileNameToName = function(fileName) {
		var arr = fileName.split("/");
		return arr.pop();
	}
	
	this.makeKey = function(name) {
		return "fs-" + name;
	}

	this.getMetaInfos = function() {
		var str = localStorage.fsMetaInfos;
		var metaInfos = str ? JSON.parse(str) : null;

		if(!metaInfos) {
			metaInfos = [];
		}

		return metaInfos;
	}
	
	this.removeMetaInfo = function(name) {
		var metaInfos = this.getMetaInfos();

		for(var i = 0; i < metaInfos.length; i++) {
			var iter = metaInfos[i];
			if(iter.name == name) {
				metaInfos.splice(i, 1);
				break;
			}
		}

		localStorage.fsMetaInfos = JSON.stringify(metaInfos);

		return;
	}

	this.addMetaInfo = function(name, time, size) {
		var metaInfos = this.getMetaInfos();

		for(var i = 0; i < metaInfos.length; i++) {
			var iter = metaInfos[i];
			if(iter.name == name) {
				metaInfos.splice(i, 1);
				break;
			}
		}

		var metaInfo = {};
		metaInfo.name = name;
		metaInfo.size = size;
		metaInfo.mtime = time;
		metaInfos.push(metaInfo);

		localStorage.fsMetaInfos = JSON.stringify(metaInfos);

		return;
	}

	this.list = function (path, onItems) {
		var items = [];
		var metaInfos = this.getMetaInfos();

		for(var i = 0; i < metaInfos.length; i++) {
			var iter = metaInfos[i];
			var item = {};					

			item.type = "file";
			item.name = iter.name;
			item.size = iter.size;
			item.mtime = iter.mtime;

			items.push(item);					
		}		
		onItems(items);
		
		return;
	}

	this.read = function(filename, onContent) {
		var name = this.fileNameToName(filename);
		var content = localStorage[this.makeKey(name)];

		onContent(filename, content);

		return;
	}
	
	this.remove = function(filename, onDone) {
		var name = this.fileNameToName(filename);
		
		delete localStorage[this.makeKey(name)];
		this.removeMetaInfo(name);

		onDone(true, filename);

		return;
	}

	this.save = function(filename, content, onWriteDone) {
		var name = this.fileNameToName(filename);
		var now = (new Date()).getTime();
		var size = content ? content.length : 0;

		this.addMetaInfo(name, now, size);
		localStorage[this.makeKey(name)] = content;

		onWriteDone(true, filename);

		return;
	}
}

///////////////////////////////////////////////////////////////////////////////////////////

var gDefaultFileSystem = null;

function getDefaultFileSystem() {
	if(!gDefaultFileSystem) {
		appInitFilesystem();
	}

	return gDefaultFileSystem;
}

function appInitFilesystem() {
	if(gDefaultFileSystem) {
		return;
	}

	if(window.tizen) {
		tizenFsInit();
		gDefaultFileSystem = new TizenFileSystem();
	}
	else if(window.requestFileSystem) {
		gDefaultFileSystem = new DeviceLocalFileSystem();	
	}
	else {
		gDefaultFileSystem = new WebStorageFileSystem();
	}

	console.log("window.requestFileSystem: " + window.requestFileSystem);

	return;
}

///////////////////////////////////////////////////////////////////////////////////////////
var tizenStockDirs = {};
var tizenStockDirNames = ["documents", "downloads", "images", "music", "removable", "videos"];

function tizenFsInit() {
	function onTizenFsError(e) {
		console.log("tizen.filesystem.resolve Error: " + e.message);
	}

	function resolveOne(name) {
		console.log("resolve: " + name);
		tizen.filesystem.resolve(name, function(dir) {
			dir.name = dir.name ? dir.name : name;
			tizenStockDirs[name] = dir;
			console.log("tizen.filesystem.resolve done:" + name + ":" + dir);
		}, onTizenFsError, 'rw');
	}
	
	for(var i = 0; i < tizenStockDirNames.length; i++) {
		var iter = tizenStockDirNames[i];
		try {
			resolveOne(iter);
		}catch(e) {
			console.log(e.message);
		}
	}
	
	console.log("tizenFsInit");

	return;
}

function TizenFileSystem() {
	this.contentType = "String";

	this.setContentType = function(contentType) {
		this.contentType = contentType;

		return;
	}

	this.setInitPath = function(path) {
		return path;
	}
	
	this.setVirtualRoot = function(path) {
		return path
	}

	this.getDirHandle = function(path, onDone) {
		var index = 1;
		var arr = path.split("/");
		arr.remove("");
		arr.remove("");
		
		var rootDirName = arr.length > 0 ? arr[0] :  "/";
		var rootDir = tizenStockDirs[rootDirName];
		var currentDir = rootDir;
	
		if(!rootDir) {
			onDone(rootDir);

			return;
		}

		if(arr.length < 2) {
			onDone(rootDir);

			return;
		}

		function onFail(e) {
			console.log(e.message);
		}
				
		function onListFiles(items) {
			var found = false;
			var name = arr[index];
			
			for(var i = 0; i < items.length; i++) {
				var iter = items[i];
				if(iter.name == arr[index]) {
					if(!iter.isDirectory) {
						currentDir = null;
						onDone(null);
						return;
					}
					found = true;
					
					index += 1;
					currentDir = iter;
					if(index < arr.length) {
						currentDir.listFiles(onListFiles, onFail);
					}
					else {
						onDone(currentDir);
					}
				}
			}
			
			if(!found) {
				currentDir = currentDir.createDirectory(name);
				index += 1;
				if(index < arr.length) {
					currentDir.listFiles(onListFiles, onFail);
				}
				else {
					onDone(currentDir);
				}
			}
		}

		rootDir.listFiles(onListFiles, onFail);
	}

	this.list = function (path, onItems) {
		if(!path || path === "/") {
			var items = [];
			
			for(var i = 0; i < tizenStockDirNames.length; i++) {
				var iter = tizenStockDirNames[i];
				var dir = tizenStockDirs[iter];
				
				if(dir) {
					var item = {};					
					item.type = "folder";
					item.name = iter;
					item.size = dir.length;
					item.userData = dir;
					items.push(item);					
					
					console.log(i + ": " + item.name + " " + item.type);
				}
			}		
			onItems(items);
			
			return;
		}
		
		function onDone(dir) {
			function onListFiles(arr) {
				var items = []
				
				for(var i = 0; i < arr.length; i++) {
					var item = {};
					var iter = arr[i];
					
					item.type = iter.isFile ? "file" : "folder";
					item.name = iter.name;
					item.size = iter.isFile ? iter.fileSize : iter.length;
					item.userData = iter;
					
					console.log(i + ": " + item.name + " " + item.type);
					items.push(item);
				}
				
				onItems(items);
			}
			
			function onFail(e) {
				onItems(null);
			}
			dir.listFiles(onListFiles, onFail);
		}
		
		this.getDirHandle(path, onDone);

		return;
	}

	this.read = function(filename, onContent) {
		var me = this;
		var arr = filename.split("/");
		var name = arr.pop();
		var path = arr.join("/");
		
		function onDone(dir) {
			function onOpenStream(fs) {
				var content = null;

				if(me.contentType == "ArrayBytes") {
					content = fs.readBytes(fs.bytesAvailable);
				}
				else if(me.contentType == "ArrayBuffer") {
					var data = fs.readBytes(fs.bytesAvailable);
					var n = data.length;

					content = new Uint8Array(n); 
					for(var i = 0; i < n; i++) {
						content[i] = data[i];
					}

					console.log("Read As ArrayBuffer: length=" + n);
				}
				else {
					content = fs.read(fs.bytesAvailable);
					console.log("Read As String: length=" + content.length);
				}

				onContent(filename, content);
				fs.close();
			}
			
			function onFail(e) {
				onContent(filename, null);
			}
			
			function onListFiles(arr) {		
				for(var i = 0; i < arr.length; i++) {
					var iter = arr[i];
					
					if(iter.name == name) {
						if(iter.isFile) {
							iter.openStream("r", onOpenStream, onFail,"UTF-8");
						}
						else {
							onContent(filename, null);
						}
						
						return;
					}
				}
				
				onContent(filename, null);
			}
	
			dir.listFiles(onListFiles, onFail);
		}
		
		this.getDirHandle(path, onDone);
		
		return;
	}
	
	this.remove = function(filename, onDone) {
		var arr = filename.split("/");
		var rootDirName = arr.shift();

		while(!rootDirName && arr.length) {
			rootDirName = arr.shift();
		}
		filename = arr.join("/");

		function onSuccess(e) {
			onDone(true);
			console.log("deleteFile OK:" + filename);
		}
		
		function onFailed(e) {
			onDone(false);
			console.log("deleteFile Failed:" + e.message);
		}
		
		var rootDir = tizenStockDirs[rootDirName];
		if(rootDir) {
			try {
				rootDir.deleteFile(rootDir.fullPath + "/" +filename, onSuccess, onFailed);
			}catch(e) {
				console.log("deleteFile Failed: " + e.message);
			}
		}
		else {
			onDone(false);
		}

		return;
	}

	this.save = function(filename, content, onWriteDone) {
		var me = this;
		var arr = filename.split("/");
		var name = arr.pop();
		var path = arr.join("/");
		
		function onDone(dir) {
			if(!dir) {
				alert("Save File Failed.");
				onWriteDone(false, filename);
				return;
			}

			function onOpenStream(fs) {
				try {
					if(me.contentType == "base64") {
						if(content.indexOf("data:") >= 0 && content.indexOf(";base64,") > 0) {
							var offset = content.indexOf(";base64,") + 8;
							fs.writeBase64(content.substr(offset));
						}
						else {
							fs.writeBase64(content);
						}
					}
					else if(me.contentType == "ArrayBytes") {
						fs.writeBytes(content);
					}
					else if(me.contentType == "ArrayBuffer") {
						var data = [];
						var n = content.byteLength; 
						var arr = new Uint8Array(content);

						for(var i = 0; i < n; i++) {
							data.push(arr[i]);
						}

						fs.writeBytes(data);
					}
					else {
						fs.write(content);
					}
					fs.close();
					onWriteDone(true, filename);
				}
				catch(e) {
					onWriteDone(false, filename);
				}
			}
			
			function onFail(e) {
				alert("Save File Failed.");
				onWriteDone(false, filename);
			}
			
			function onListFiles(arr) {		
				for(var i = 0; i < arr.length; i++) {
					var iter = arr[i];
					
					if(iter.name == name) {
						if(iter.isFile) {
							iter.openStream("w", onOpenStream, onFail,"UTF-8");
						}
						else {
							onWriteDone(false, filename);
						}
						
						return;
					}
				}
				
				var file = dir.createFile(name);
				file.openStream("w", onOpenStream, onFail,"UTF-8");
			}
	
			dir.listFiles(onListFiles, onFail);
		}
		
		this.getDirHandle(path, onDone);

		return;
	}
}
////////////////////////////////////////////////////////////////////////////////////

function FileBrowser() {
	this.cwd = "/";
	this.cacheEntries = {};

	this.fs = getDefaultFileSystem();

	this.normalizePath = function(path) {
		var str = path ? path : "";
		var arr = str.split("/");
		arr.remove("");
		arr.remove("");
		arr.remove("");
		
		str = arr.length ? ("/" + arr.join("/") + "/") : "/";
		
		return str;
	}

	this.setVirtualRoot = function(virtualRoot) {
		this.virtualRoot = this.fs.setVirtualRoot(this.normalizePath(virtualRoot));

		return;
	}

	this.initForSave = function(initPath, initFileName, content, onDone, fs) {
		if(fs) {
			this.fs = fs;
		}

		this.content = content;
		this.cwd = this.fs.setInitPath(this.normalizePath(initPath));
		this.initFileName = initFileName;
		this.onDone = onDone;

		this.cacheEntries = {};

		return;
	}

	this.initForOpen = function(initPath, onContent, fs) {
		if(fs) {
			this.fs = fs;
		}

		this.cwd = this.fs.setInitPath(this.normalizePath(initPath));
		this.onContent = onContent;
		this.cacheEntries = {};

		return;
	}

	this.filteItemByExtNames = function(extNames) {
		function filter(item) {
			for(var i = 0; i < extNames.length; i++) {
				var ext = extNames[i];
				if(item.name.indexOf(ext) > 0) {
					return true;
				}
			}

			return false;
		}

		if(extNames) {
			this.setItemFilter(filter);
		}
		else {
			this.setItemFilter(null);
		}
	}
	
	this.setItemFilter = function(filter) {
		this.filter = filter;

		return;
	}

	this.getSizeStr = function(item) {
		var str = "";
		var sizeStr = "";
		var size = item.size;

		if(item.type === "file") {
			if(size > 1024 * 1024) {
				size = size/(1024*1024);
				sizeStr = size + "";
				sizeStr = sizeStr.substr(0, 4);
				sizeStr = sizeStr + "MB";
			}
			else if(size > 1024) {
				size = size >> 10;
				sizeStr = size + "";
				sizeStr = sizeStr.substr(0, 4);
				sizeStr = sizeStr + "KB";
			}
			else {
				sizeStr = size + "Bytes";
			}

			str = sizeStr;
		}
		else {
			if(item.items) {
				sizeStr = item.items.length + " Items";
			}
			else {
				sizeStr = 0 + " Items";
			}
			str = sizeStr;
		}

		return str;
	}

	this.getDateInfo = function(item) {
		var dateStr = "";
		var date = item.mtime ? new Date(item.mtime) : new Date();
		dateStr = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " 
			+ date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

		return dateStr;
	}

	this.getMimeIcon = function(item) {
		var url = "";
		var filename = item.name;
		var path = 'drawapp8/images/common/mimetypes/';

		if(item.type === "folder") {
			if(filename === "..") {
				url = path + "goback.png";
			}
			else {
				url = path + "folder.png";
			}
		}
		else 
		{
			if(filename.indexOf(".png") >= 0 || filename.indexOf(".jpg") >= 0) {
				url = path + "image.png";	
			}
			else {
				url = path + "text.png";	
			}
		}

		return url
	}

	this.createItem = function(iter, icon, name, dateStr) {
		var item = {children:[]};
		item.userData = iter;
		item.children.push({children:[]});
		item.children[0].children.push({image:icon});
		item.children[0].children.push({children:[]});
		item.children[0].children[1].children.push({text:name});
		item.children[0].children[1].children.push({text:dateStr});

		return item;
	}

	this.list = function(win) {
		var me = this;
		win.setValueOf("ui-label-cwd", this.cwd);
		console.log("list: " + this.cwd);

		var list = win.findChildByName("ui-list-view", true);

		if(this.cacheEntries[this.cwd]) {
			list.bindData(this.cacheEntries[this.cwd], null, true);
			console.log("list: found cached entries.");
			return;
		}
		
		list.setEnable(false);
		this.fs.list(this.cwd, function(items) {
			var iter = {};
			var icon = null;
			var data = {children:[]};
			var item = {type:"folder", name: "..", children:[]};
		
			if(me.canUp()) {
				iter.name = "..";
				iter.type = "folder";

				icon = me.getMimeIcon(iter);
				item = me.createItem(iter, icon, "Up", "Return To Parent");
				item.userData = null;

				data.children.push(item);
			}

			if(items) {
				items.sort(function(a, b) {
					if(a.name < b.name) {
						return -1;
					}
					else if(a.name > b.name) {
						return 1;
					}
					else {
						return 0;
					}
				});

				for(var i = 0; i < items.length; i++) {
					iter = items[i];

					if(iter.type === "file") {
						continue;
					}
					
					var dateStr = me.getDateInfo(iter);
					icon = me.getMimeIcon(iter);
					item = me.createItem(iter, icon, iter.name, dateStr);
					data.children.push(item);
				}
				
				for(var i = 0; i < items.length; i++) {
					iter = items[i];
			
					if(iter.name.indexOf(".") === 0) {
						continue;
					}

					if(iter.type !== "file") {
						continue;
					}

					if(me.filter && !me.filter(iter)) {
						continue;
					}
					
					var dateStr = me.getDateInfo(iter);
					icon = me.getMimeIcon(iter);
					item = me.createItem(iter, icon, iter.name, dateStr);
					data.children.push(item);
				}
			}

			list.bindData(data, null, true);

			me.cacheEntries[me.cwd] = data;
			list.setEnable(true);
		});

		return;
	}

	this.canUp = function() {
		if(this.virtualRoot && this.virtualRoot == this.cwd) {
			return false;
		}

		if(!this.cwd || this.cwd == "/") {
			return false;
		}
		else {
			return true;
		}
	}

	this.up = function(win) {
		var items = this.cwd.split("/");

		items.remove("", true);
		if(items.length) {
			items.length = items.length - 1;
		}

		if(items.length) {
			this.cwd = "/" + items.join("/") + "/";
		}
		else {
			this.cwd = "/";
		}
		this.list(win);

		return;
	}
	
	this.enter = function(win, item) {
		this.cwd = this.cwd + item.name + "/";
		this.list(win);

		return;
	}

	this.read = function(win, item) {
		var onContent = this.onContent;
		var filename = this.cwd + item.name;
		if(onContent) {
			this.fs.read(filename, 
				function(filename, content) {
					onContent(filename, content);
					win.closeWindow(content);
				});
		}

		return;
	}
	
	this.remove = function(win, item) {
		if(item.type != "file") {
			alert("You Cannot Remove Directory At Here!");
			return;
		}

		var filename = this.cwd + item.name;
		this.fs.remove(filename, function(result, filename) {
			if(!result) {
				alert("Remove File Failed!");
			}
		});

		return;
	}

	this.save = function(win, item) {
		var onDone = this.onDone;
		var filename = this.cwd + item.name;

		if(this.initFileName) {
			var arr = this.initFileName.split(".");
			var extName = arr.pop();

			if(extName && filename.indexOf(extName) < 0) {
				filename = filename + "." + extName;
			}
		}

		this.fs.save(filename, this.content, 
			function(result, filename) {
				if(onDone) {
					onDone(result, filename);
					win.closeWindow(result);
				}
			});
		this.content = null;

		return;
	}
}


var gFileBrowser = null;
function FileBrowserGet() {
	if(!gFileBrowser) {
		cantkPreloadImage("drawapp8/images/common/mimetypes/goback.png");
		cantkPreloadImage("drawapp8/images/common/mimetypes/folder.png");
		cantkPreloadImage("drawapp8/images/common/mimetypes/image.png");
		cantkPreloadImage("drawapp8/images/common/mimetypes/text.png");
		gFileBrowser = new FileBrowser();
	}

	return gFileBrowser;
}

