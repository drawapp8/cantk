var gApp = null;

var userLoadApp = function(deviceData) {
	return false;
}

window.onload = function() 
{
	var loading = document.getElementById("loading");
	loading.style.display = "none";
	
	cantkInitViewPort();
	window.setTimeout(function(){	
		if(!gApp)
		{
			var uiData = guiData ? guiData : gDeviceData;

			if(!userLoadApp(uiData)) {
				if(CanTK.isMobile()) {
					gApp= webappRunWithDeviceData(uiData);
				}
				else {
					gApp= webappPreviewWithDeviceData(uiData);
				}
			}
		}
	}, 50);

	return;
};

