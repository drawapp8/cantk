
(function() {
window.webappRunWithURL = function(url) {
	var app = new TWebApp();
	
	return app.runWithURL(url);
}

window.webappRunWithData = function(json) {
	var app = new TWebApp();
	
	return app.runWithData(json);
}

window.webappPreviewWithURL = function(url) {
	var app = new TWebApp(true);
	
	return app.runWithURL(url);
}

window.webappPreviewWithData = function(json) {
	var app = new TWebApp(true);
	
	return app.runWithData(json);
}
})();
