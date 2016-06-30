window.getQuery = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getURL() {
    var search = location.search;
    if(search.indexOf("user_id") >= 0 && search.indexOf("game_key") >= 0) {
        return url = "/getgzip.php" + search;   
    }

	var url = "/getgzip.php?filename=demo.jso";
	var appid = getQuery('appid');
	var id = getQuery('id');
	var urlStr = getQuery('url');

	if(appid) {
		url = '/getgzip.php?appid=' + appid;
	}
	else if(urlStr) {
		if(urlStr.indexOf("://") > 0) {
			url = urlStr;
		}
		else {
			url = '/getgzip.php?filename=' + urlStr;
		}
	}
	else if(id) {
		url = '/getgzip.php?id=' + id;
	}

	return url;
}

function getAction() {
	var action = getQuery('action');

	if(!action) {
		action = CanTK.isMobile() ? "run" : "preview";
	}

	return action;
}

function webappRun(action, jsonStr) {
	if(action === "run") {
		gApp= webappRunWithData(jsonStr);
	}
	else {
		gApp= webappPreviewWithData(jsonStr);
	}
}

var gApp = null;
function onDeviceReady() {
	var url = getURL();

	CanTK.initViewPort();
	CanTK.httpGetURL(url, function onDone(result, xhr, jsonStr) {
		var action = getAction();
		webappRun(action, jsonStr);	
		var loading = document.getElementById("loading");
		if(loading) {
			loading.style.display = "none";
		}
	});

	return;
};

CantkRT.init(onDeviceReady);
