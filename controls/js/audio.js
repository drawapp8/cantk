/*
 * File: audio.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: html5 audio support.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function MusicPlayer() {
	this.songs = [];
	this.volume = 1;
	this.current = 0;
	this.state = MusicPlayer.STATE_STOPPED;

	var player = this;

	function notifyTimeEllapsed() {
		if(player.isPlaying()) {
			player.notify("time-ellapsed", player.getPercent());
		}

		setTimeout(notifyTimeEllapsed, 1000);
	}

	setTimeout(notifyTimeEllapsed, 1000);

	return;
}

MusicPlayer.STATE_STOPPED = 0;
MusicPlayer.STATE_PLAYING = 1;
MusicPlayer.STATE_PAUSED  = 2;

MusicPlayer.prototype.clear = function() {
	this.stop();
	this.setCurrent(0);
	this.songs.clear();

	return;
}

MusicPlayer.prototype.setState = function(state) {
	if(this.state != state) {
		this.notify("state-changed", state);
	}

	this.state = state;

	return;
}

MusicPlayer.prototype.isPlaying = function() {
	return this.state === MusicPlayer.STATE_PLAYING;
}

MusicPlayer.prototype.isPaused = function() {
	return this.state === MusicPlayer.STATE_PAUSED;
}

MusicPlayer.prototype.isStopped = function() {
	return this.state === MusicPlayer.STATE_STOPPED;
}

MusicPlayer.prototype.setEventListener = function(onNotify) {
	this.onNotify = onNotify;

	return;
}

MusicPlayer.prototype.notify = function(eventName, eventParam) {
	if(this.onNotify) {
		this.notifying = true;
		var onNotify = this.onNotify;
		try {
			onNotify(eventName, eventParam);
		}catch(e) {
			console.log("notify error: " + e.message);
		}
		delete this.notifying;
	}

	return;
}

MusicPlayer.prototype.addSong = function(url, preload) {
	var player = this;
	var song = new Audio();
	
	console.log("addSong: " + this.songs.length + " " + url);
	song.addEventListener('ended',function(e){
		player.next(true);
		console.log("song end");

		return;
	});
	
	song.addEventListener('error', function(e){
		player.songs.remove(song);
		console.log("error:" + song.src);

		return;
	});

	song.addEventListener('playing',function(e){
		console.log("playing:" + song.src);
		return;
	});

	song.addEventListener('progress',function(e){
		console.log("progress:" + song.src);
		return;
	});
	
	if(preload) {
		song.src = url;
		song.load();
	}
	else {
		song.realSrc = url;
	}

	this.songs.push(song);

	return;
}

MusicPlayer.prototype.addSongs = function(urls, preload) {
	for(var i = 0; i < urls.length; i++) {
		this.addSong(url[i], preload);
	}

	return;
}

MusicPlayer.prototype.removeSong = function(song) {
	var index = this.songs.indexOf(song);

	return this.removeSongByIndex(index);
}

MusicPlayer.prototype.removeSongByUrl = function(url) {
	for(var i = 0; i < this.songs.length; i++) {
		var iter = this.songs[i];
		if(iter.src.indexOf(url) >= 0) {
			this.removeSongByIndex(i);
			break;
		}
	}

	return;
}

MusicPlayer.prototype.removeSongByIndex = function(index) {
	if(index >= 0 && index < this.songs.length) {
		if(index === this.current) {
			if(this.state === MusicPlayer.STATE_PLAYING) {
				this.stop();
			}

			this.songs.remove(this.songs[index]);
			this.setCurrent(this.current);
		}
		else {
			this.songs.remove(this.songs[index]);
		}
	}

	return;
}

MusicPlayer.prototype.getSongsNr = function() {
	return this.songs.length;
}

MusicPlayer.prototype.getSongByIndex = function(index) {
	return (index >= 0 && index < this.songs.length) ? this.songs[index] : null;
}

MusicPlayer.prototype.setCurrent = function(index) {
	if(index >= 0 && this.songs.length > 0) {
		this.current = index % this.songs.length;
	}

	return;
}

MusicPlayer.prototype.getCurrent = function() {
	return this.current;
}

MusicPlayer.prototype.setVolume = function(value) {
	this.volume = (value <= 1 && value >= 0) ? value : 1;

	return;
}

MusicPlayer.prototype.getVolume = function() {
	return this.volume;
}

MusicPlayer.prototype.next = function(autoPlay) {
	var n = this.songs.length;
	if(n > 1) {
		this.stop();
		this.current = (this.current + 1)%n;
		if(autoPlay) {
			this.play();
		}
	}

	return;
}

MusicPlayer.prototype.prev = function(autoPlay) {
	var n = this.songs.length;
	if(n > 1) {
		this.stop();
		this.current = (this.current + n - 1)%n;
		if(autoPlay) {
			this.play();
		}
	}

	return;
}

MusicPlayer.prototype.playOrPause = function() {
	if(this.isPlaying()) {
		this.pause();
	}
	else {
		this.play();
	}

	return;
}

MusicPlayer.prototype.play = function() {
	if(this.state === MusicPlayer.STATE_PLAYING) {
		return;
	}

	var n = this.songs.length;
	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];
		song.volume = this.volume;

		if(!song.src && song.realSrc) {
			song.src = song.realSrc;
			song.load();
		}

		song.play();
		var player = this;
		this.setState(MusicPlayer.STATE_PLAYING);
	}

	return;
}

MusicPlayer.prototype.stop = function() {
	if(this.state === MusicPlayer.STATE_STOPPED) {
		return;
	}
	
	var n = this.songs.length;
	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];
		if(!song.paused) {
			song.pause();
		}
		this.setState(MusicPlayer.STATE_STOPPED);
	}

	return;
}

MusicPlayer.prototype.pause = function() {
	if(this.state !== MusicPlayer.STATE_PLAYING) {
		return;
	}
	
	var n = this.songs.length;
	if(n > 0 && this.current < n) {
		this.songs[this.current].pause();
		this.setState(MusicPlayer.STATE_PAUSED);
	}

	return;
}

MusicPlayer.prototype.seekTo = function(percent) {
	var n = this.songs.length;
	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];
		song.currentTime = song.duration * percent/100;
	}

	console.log("seekTo:" +  percent + " " + this.getPercent());

	return;
}

MusicPlayer.prototype.getPercent = function() {
	var n = this.songs.length;

	if(this.state === MusicPlayer.STATE_STOPPED) {
		return 0;
	}

	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];

		return song.currentTime * 100/song.duration;
	}

	return 0;
}

MusicPlayer.prototype.getEllapsedTime = function() {
	var n = this.songs.length;

	if(this.state === MusicPlayer.STATE_STOPPED) {
		return 0;
	}

	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];

		return song.currentTime;
	}

	return 0;
}

MusicPlayer.prototype.getDuration = function() {
	var n = this.songs.length;

	if(this.state === MusicPlayer.STATE_STOPPED) {
		return 0;
	}

	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];

		return song.duration;
	}

	return 0;
}

var gMusicPlayer = new MusicPlayer();

function getMusicPlayer() {
	return gMusicPlayer;
}

///////////////////////////////////////////////////////////

function EffectsPlayer() {
	this.effects = {};
}

EffectsPlayer.prototype.load = function(name, url) {
	var effect = this.effects[name];

	if(!effect) {
		effect = {};
		effect.name = name;
		effect.state = MusicPlayer.STATE_STOPPED;
	}

	effect.audio = new Audio();

	effect.audio.addEventListener('ended',function(e){
		console.log("effect.audio end:" + effect.name);
		effect.state = MusicPlayer.STATE_STOPPED;

		return;
	});
	
	effect.audio.addEventListener('error', function(e){
		console.log("error:" + effect.audio.src);
		effect.state = MusicPlayer.STATE_STOPPED;

		return;
	});

	effect.audio.src = url;
	effect.audio.load();

	this.effects[name] = effect;

	return;
}

EffectsPlayer.prototype.loadTone = function(name, freq, duration, volume) {
	var cfg = {
		seconds: (duration > 100) ? duration/1000 : duration,
		volume: (volume < 1) ? volume*32767 : volume,
		freq: freq
	}

    var url = window.makeToneDataURI(cfg);

	this.load(name, url);

	return;
}

EffectsPlayer.prototype.play = function(name) {
	var effect = this.effects[name];

	if(effect) {
		effect.state = MusicPlayer.STATE_PLAYING;
		effect.audio.currentTime = 0;
		effect.audio.play();
	}

	return;
}

var gEffectsPlayer = new EffectsPlayer();

function getEffectsPlayer() {
	return gEffectsPlayer;
}

//from: http://mrcoles.com/piano

(function() {
	myextend = function() {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// extend jQuery itself if only one argument is passed
		if ( length === i ) {
			target = this;
			--i;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

    // test if we can use blobs
    var canBlob = false;
    if (window.webkitURL && window.Blob) {
        try {
            new Blob();
            canBlob = true;
        } catch(e) {}
    }

    function asBytes(value, bytes) {
        // Convert value into little endian hex bytes
        // value - the number as a decimal integer (representing bytes)
        // bytes - the number of bytes that this value takes up in a string

        // Example:
        // asBytes(2835, 4)
        // > '\x13\x0b\x00\x00'
        var result = [];
        for (; bytes>0; bytes--) {
            result.push(String.fromCharCode(value & 255));
            value >>= 8;
        }
        return result.join('');
    }

    function attack(i) {
        return i < 200 ? (i/200) : 1;
    }

    var DataGenerator = myextend(function(styleFn, volumeFn, cfg) {
        cfg = myextend({
            freq: 440,
            volume: 32767,
            sampleRate: 11025, // Hz
            seconds: .5,
            channels: 1
        }, cfg);

        var data = [];
        var maxI = cfg.sampleRate * cfg.seconds;
        for (var i=0; i < maxI; i++) {
            for (var j=0; j < cfg.channels; j++) {
                data.push(
                    asBytes(
                        volumeFn(
                            styleFn(cfg.freq, cfg.volume, i, cfg.sampleRate, cfg.seconds, maxI),
                            cfg.freq, cfg.volume, i, cfg.sampleRate, cfg.seconds, maxI
                        ) * attack(i), 2
                    )
                );
            }
        }
        return data;
    }, {
        style: {
            wave: function(freq, volume, i, sampleRate, seconds) {
                // wave
                // i = 0 -> 0
                // i = (sampleRate/freq)/4 -> 1
                // i = (sampleRate/freq)/2 -> 0
                // i = (sampleRate/freq)*3/4 -> -1
                // i = (sampleRate/freq) -> 0
                return Math.sin((2 * Math.PI) * (i / sampleRate) * freq);
            },
            squareWave: function(freq, volume, i, sampleRate, seconds, maxI) {
                // square
                // i = 0 -> 1
                // i = (sampleRate/freq)/4 -> 1
                // i = (sampleRate/freq)/2 -> -1
                // i = (sampleRate/freq)*3/4 -> -1
                // i = (sampleRate/freq) -> 1
                var coef = sampleRate / freq;
                return (i % coef) / coef < .5 ? 1 : -1;
            },
            triangleWave: function(freq, volume, i, sampleRate, seconds, maxI) {
                return Math.asin(Math.sin((2 * Math.PI) * (i / sampleRate) * freq));
            },
            sawtoothWave: function(freq, volume, i, sampleRate, seconds, maxI) {
                // sawtooth
                // i = 0 -> -1
                // i = (sampleRate/freq)/4 -> -.5
                // i = (sampleRate/freq)/2 -> 0
                // i = (sampleRate/freq)*3/4 -> .5
                // i = (sampleRate/freq) - delta -> 1
                var coef = sampleRate / freq;
                return -1 + 2 * ((i % coef) / coef);
            }
        },
        volume: {
            flat: function(data, freq, volume) {
                return volume * data;
            },
            linearFade: function(data, freq, volume, i, sampleRate, seconds, maxI) {
                return volume * ((maxI - i) / maxI) * data;
            },
            quadraticFade: function(data, freq, volume, i, sampleRate, seconds, maxI) {
                // y = -a(x - m)(x + m); and given point (m, 0)
                // y = -(1/m^2)*x^2 + 1;
                return volume * ((-1/Math.pow(maxI, 2))*Math.pow(i, 2) + 1) * data;
            }
        }
    });
    DataGenerator.style.defaultVal = DataGenerator.style.wave;
    DataGenerator.volume.defaultVal = DataGenerator.volume.linearFade;


    function makeToneDataURI(cfg) {

        cfg = myextend({
            channels: 1,
            sampleRate: 11025, // Hz
            bitDepth: 16, // bits/sample
            seconds: .5,
            volume: 20000,//32767,
            freq: 440
        }, cfg);

        //
        // Format Sub-Chunk
        //

        var fmtChunk = [
            'fmt ', // sub-chunk identifier
            asBytes(16, 4), // chunk-length
            asBytes(1, 2), // audio format (1 is linear quantization)
            asBytes(cfg.channels, 2),
            asBytes(cfg.sampleRate, 4),
            asBytes(cfg.sampleRate * cfg.channels * cfg.bitDepth / 8, 4), // byte rate
            asBytes(cfg.channels * cfg.bitDepth / 8, 2),
            asBytes(cfg.bitDepth, 2)
        ].join('');

        //
        // Data Sub-Chunk
        //

        var sampleData = DataGenerator(
            cfg.styleFn || DataGenerator.style.defaultVal,
            cfg.volumeFn || DataGenerator.volume.defaultVal,
            cfg);
        var samples = sampleData.length;

        var dataChunk = [
            'data', // sub-chunk identifier
            asBytes(samples * cfg.channels * cfg.bitDepth / 8, 4), // chunk length
            sampleData.join('')
        ].join('');

        //
        // Header + Sub-Chunks
        //

        var data = [
            'RIFF',
            asBytes(4 + (8 + fmtChunk.length) + (8 + dataChunk.length), 4),
            'WAVE',
            fmtChunk,
            dataChunk
        ].join('');

        if (canBlob) {
            // so chrome was blowing up, because it just blows up sometimes
            // if you make dataURIs that are too large, but it lets you make
            // really large blobs...
            var view = new Uint8Array(data.length);
            for (var i = 0; i < view.length; i++) {
                view[i] = data.charCodeAt(i);
            }
            var blob = new Blob([view], {type: 'audio/wav'});
            return  window.webkitURL.createObjectURL(blob);
        } else {
            return 'data:audio/wav;base64,' + btoa(data);
        }
    }

    function noteToFreq(stepsFromMiddleC) {
        return 440 * Math.pow(2, (stepsFromMiddleC+3) / 12);
    }

    var Notes = {
        sounds: {},
        getDataURI: function(n, cfg) {
            cfg = cfg || {};
            cfg.freq = noteToFreq(n);
            return makeToneDataURI(cfg);
        },
        getCachedSound: function(n, data) {
            var key = n, cfg;
            if (data && typeof data == "object") {
                cfg = data;
                var l = [];
                for (var attr in data) {
                    l.push(attr);
                    l.push(data[attr]);
                }
                l.sort();
                key += '-' + l.join('-');
            } else if (typeof data != 'undefined') {
                key = n + '.' + key;
            }

            var sound = this.sounds[key];
            if (!sound) {
                sound = this.sounds[key] = new Audio(this.getDataURI(n, cfg));
            }
            return sound;
        },
        noteToFreq: noteToFreq
    };

	window.makeToneDataURI = makeToneDataURI;
    window.DataGenerator = DataGenerator;
    window.Notes = Notes;

})();
