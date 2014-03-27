/*
 * This function wraps WebPage.evaluate, and offers the possibility to pass
 * parameters into the webpage function. The PhantomJS issue is here:
 * 
 *   http://code.google.com/p/phantomjs/issues/detail?id=132
 * 
 * This is from comment #43.
 * http://stackoverflow.com/questions/9838119/pass-arguments-with-page-evaluate
 */
function evaluate(page, func) {
	var args = [].slice.call(arguments, 2);
	var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
	return page.evaluate(fn);
}

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis, verbose) {
        var checktimeout = 250;
        var maxtimeOutMillis = timeOutMillis ? timeOutMillis : timeout, //< Default Max Timout is 3s
                start = new Date().getTime(),
                condition = false,
                interval = setInterval(function() {
                        if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
				// If not time-out yet and condition not yet fulfilled
                                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx(verbose)); //< defensive code
                        } else {
                                if (!condition) {
                                        // If condition still not fulfilled (timeout but condition is 'false')
                                        // console.log("'waitFor()' timeout");
                                        // force to return
                                        condition = true;
                                } else {
                                        // Condition fulfilled (timeout and/or condition is 'true')
                                        // console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                                        typeof(onReady) === "string" ? eval(onReady) : onReady(verbose); //< Do what it's supposed to do once the condition is fulfilled
                                        clearInterval(interval); //< Stop this interval
                                }
                        }
                }, checktimeout); //< repeat check every 250ms
}

/*
wget expected cookie format
*/
function cookie_parser(filename, verbose) {
	var t = new Date();
	if (filename == "") return;

	var f = null;
	var lines = null
	try {
		f = fs.open(filename, "r");
	} catch (e) {
		if (verbose >= 0) {
			console.log("["+t.toUTCString()+"]" + " [WARNING] cookie_parser: " + e);
		}
		return;
	}
	var content = f.read();
	var eol = system.os.name == 'windows' ? "\r\n" : "\n";
	var sep = system.os.name == 'windows' ? "\t" : "\t";
	if (content) {
		lines = content.split(eol);
		for (var i=0,len1=lines.length;i<len1;i++) {
			if (!lines[i].match(/^#/) && lines[i].length > 0) {
				var items = lines[i].split(sep);
				var cookieobj = {};
				for (var j=0,len2=items.length;j<len2;j++) {
					switch(j) {
						case 0: // domain
						cookieobj['domain'] = items[j];
						break;
						case 1: // httponly
						cookieobj['httponly'] = items[j];
						break;
						case 2: // path
						cookieobj['path'] = items[j];
						break;
						case 3: // secure
						cookieobj['secure'] = items[j];
						break;
						case 4: // timestamp
						cookieobj['expires'] = items[j];
						break;
						case 5: // cookie name
						cookieobj['name'] = items[j];
						break;
						case 6: // cookie value
						cookieobj['value'] = items[j];
						break;
						default:
						break;
					}
				}
				if (verbose >= 2) console.log("["+t.toUTCString()+"]" + " [DEBUG] cookie_parser: " + JSON.stringify(cookieobj));
				phantom.addCookie(cookieobj);
			}
		}
	}
}

/* PATTERN
var url = "http://devel-001.fe-ver.com/domxss/index000.html";
var url = "http://devel-001.fe-ver.com/domxss/index000.html?";
var url = "http://devel-001.fe-ver.com/domxss/index001.html?input1=123&input2=456";
*/
function parse_qs(url) {
	var t = new Date();
        var qs = url;
        var kv = [];
        var params = {};
        qs = qs.replace(/^http.*?\?/,"");
        if (qs.length && qs != url) {
                kv = qs.split('&');
                for (pairNum in kv) {
                        // console.log(kv[pairNum]);
                        var key = kv[pairNum].split('=')[0];
                        // console.log(key);
                        if (!key.length) continue;
                        if (typeof params[key] === 'undefined')
                        params[key] = [];
                        // console.log(kv[pairNum].substring(key.length+1));
                        params[key].push(kv[pairNum].substring(key.length+1));
                }
        }
	if (verbose >= 2) {
		for (p in params) {
                	console.log("["+t.toUTCString()+"]" + " [DEBUG] parse_qs(key:value): " + p + ":" + params[p]);
		}
	}
        return params;
}

/* PATTERN
var url = "http://devel-001.fe-ver.com/domxss/index000.html";
var url = "http://devel-001.fe-ver.com/domxss/index000.html?";
var url = "http://devel-001.fe-ver.com/domxss/index001.html?input1=123&input2=456";
*/
function get_url(url) {
	var p = /^http.*?\?/g;
	var m = p.exec(url);
	if (m == undefined) {
		return url;
	} else {
		return m[0].substring(0, m[0].length-1);
	}
}

/*
size of object.
*/
Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
    	}
	return size;
};
