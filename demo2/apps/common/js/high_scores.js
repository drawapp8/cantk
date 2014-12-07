function HighScores() {
	
}

HighScores.sortInc = false;
HighScores.unit = "";
HighScores.gameName = "";

HighScores.setGameName = function(gameName) {
	HighScores.gameName = gameName;

	return;
}

HighScores.makeKey = function(key) {
	return HighScores.gameName + "_high_scores_" + key;
}

HighScores.setUnit = function(unit) {
	HighScores.unit = unit;

	return;
}

HighScores.getUnit = function() {
	return HighScores.unit;
}

HighScores.setSortInc = function(value) {
	HighScores.sortInc = value;

	return;
}

HighScores.add = function(level, user, score) {
	var scores = [];
	var key = HighScores.makeKey(level);
	var value = localStorage[key];

	if(value) {
		scores = JSON.parse(value);
	}
	
	if(!scores) {
		scores = [];
	}

	var item = {};

	item.user = user;
	item.score = score;
	item.time = (new Date()).getTime();

	scores.push(item);
	scores.sort(function(a, b) {
		return HighScores.sortInc ? (a.score-b.score) : (b.score-a.score);
	});

	value = JSON.stringify(scores);

	localStorage[key] = value;

	return;
}

HighScores.remove = function(level, index) {
	var scores = [];
	var key = HighScores.makeKey(level);
	var value = localStorage[key];

	if(value) {
		scores = JSON.parse(value);
	}

	if(scores.length > index) {
		scores.splice(index, 1);
	}

	value = JSON.stringify(scores);
	localStorage[key] = value;

	return;
}

HighScores.query = function(level) {
	var scores = [];
	var key = HighScores.makeKey(level);
	var value = localStorage[key];

	if(value) {
		scores = JSON.parse(value);
	}

	return scores;
}

HighScores.clear = function(level) {
	var key = HighScores.makeKey(level);
	delete localStorage[key];

	return;
}

HighScores.test = function() {
	HighScores.setUnit("seconds");
	HighScores.setSortInc(true);

	HighScores.clear("easy");
	HighScores.add("easy", "jim", 10);
	HighScores.add("easy", "jim", 14);
	HighScores.add("easy", "jim", 20);
	HighScores.add("easy", "jim", 8);

	var scores = HighScores.query("easy");
	console.assert(scores.length == 4);
	HighScores.remove("easy", 0);
	scores = HighScores.query("easy");
	console.assert(scores.length == 3);
	
	HighScores.clear("medium");
	HighScores.add("medium", "jim", 140);
	HighScores.add("medium", "jim", 134);
	HighScores.add("medium", "jim", 220);
	HighScores.add("medium", "jim", 82);
	
	HighScores.clear("hard");
	HighScores.add("hard", "jim", 145);
	HighScores.add("hard", "jim", 133);
	HighScores.add("hard", "jim", 200);
	HighScores.add("hard", "jim", 820);

	return;
}

//HighScores.test();

