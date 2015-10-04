	root.CanTK = CanTK;

	UIElement.prototype.setsd = function(data) {
		window.statisticsData = data;

		return this;
	}

	UIElement.prototype.sendsd = function(str) {
		window.statisticsStr = str;
		setTimeout(window.sendStatistics, 10);
	}

}).call(this);
