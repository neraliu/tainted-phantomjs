/*
Copyright (C) 2014 Yahoo! Inc. All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software
   must display the following acknowledgement:
   This product includes software developed by the Yahoo! Inc..
4. Neither the name of the Yahoo! Inc. nor the
   names of its contributors may be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY YAHOO! INC. ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL YAHOO! INC. BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Author: Nera Liu <neraliu@yahoo-inc.com>
*/
phantom.injectJs("common-lib.js");
phantom.injectJs("parseUri.js");
phantom.injectJs("domxss-db.js");
phantom.injectJs("tpjs.js");

var system = require('system');
var fs = require('fs');

var t = new Date();

var links;
var verbose = "default";
var cookiesfile = "";
var timeout = 1000;
var fuzz = 0;
var url = "";
var renderpath = "./";

var tpjs = new TPJS.TPJSObject();

if (system.args.length < 2) {
console.log("["+t.toUTCString()+"]" + " [WARNING] Usage: domxss.js [url] [cookies file in mozilla format] [timeout in msec] [fuzz:1|0] [rendering path] [verbose:default|info|debug|json]");
	phantom.exit(false);
} else {
	url = system.args[1];
	if (system.args.length == 3) {
		cookiesfile = system.args[2];
	} else if (system.args.length == 4) {
		cookiesfile = system.args[2];
		timeout = system.args[3];
	} else if (system.args.length == 5) {
		cookiesfile = system.args[2];
		timeout = system.args[3];
		fuzz = system.args[4];
	} else if (system.args.length == 6) {
		cookiesfile = system.args[2];
		timeout = system.args[3];
		fuzz = system.args[4];
		renderpath = system.args[5];
	} else if (system.args.length == 7) {
		cookiesfile = system.args[2];
		timeout = system.args[3];
		fuzz = system.args[4];
		renderpath = system.args[5];
		verbose = system.args[6];
	}
}
if (verbose == "default") { verbose = 0; // TPJS, TRACE, ERROR, WARNING
} else if (verbose == "info") { verbose = 1; // INFO
} else if (verbose == "debug") { verbose = 2; // DEBUG
} else if (verbose == "json") { verbose = -1; } // JSON

if (verbose >= 0) {
	console.log("["+t.toUTCString()+"]" + " [TPJS] Running Tainted Phantomjs....");
	console.log("["+t.toUTCString()+"]" + " [TPJS] Running Tainted Phantomjs with URL: " + url);
	console.log("["+t.toUTCString()+"]" + " [TPJS] Running Tainted Phantomjs with cookie file: " + cookiesfile);
	console.log("["+t.toUTCString()+"]" + " [TPJS] Running Tainted Phantomjs with verbose: " + verbose);
	console.log("["+t.toUTCString()+"]" + " [TPJS] Running Tainted Phantomjs with timeout: " + timeout);
	console.log("["+t.toUTCString()+"]" + " [TPJS] Running Tainted Phantomjs with fuzz: " + fuzz);
	console.log("["+t.toUTCString()+"]" + " [TPJS] Running Tainted Phantomjs with rendering Path: " + renderpath);
} else if (verbose == -1) {
	var json_result = {}; 
	json_result['tpjs'] = {};
	json_result['tpjs']['url'] = url;
	json_result['tpjs']['cookiesfile'] = cookiesfile;
	json_result['tpjs']['verbose'] = verbose;
	json_result['tpjs']['timeout'] = timeout;
	json_result['tpjs']['fuzz'] = fuzz;
	json_result['tpjs']['renderpath'] = renderpath;
	var j = JSON.stringify(json_result);
	fs.write("/dev/stdout", "{", "w"); // open global json {
	fs.write("/dev/stdout", j.substr(1).substr(0, j.length-2), "w");
	fs.write("/dev/stdout", ",", "w");
}

/* we can create one instance of page for testing all the patterns */
var page = require('webpage').create();
function test_domxss(url, uri, timeout, tindex, callback, verbose) {

	var tainted = false;
	var onalert = false;
	var t = new Date();
	var no_of_navigation = 0;

	var l = ""; var no_of_query_string_params = -1;
	var ts = Date.now().toString();
	if (uri.port != "") {
		l = uri.protocol+"://"+uri.host+":"+uri.port+uri.path+"?"+ts+"&";
	} else {
		l = uri.protocol+"://"+uri.host+uri.path+"?"+ts+"&";
	}
	if (test_cases[tindex] == DOMXSS_END) {
		if (verbose >= 1) {
			console.log("["+t.toUTCString()+"]" + " [INFO] --------------------");
			console.log("["+t.toUTCString()+"]" + " [INFO] Exiting PhantomsJS...");
		} else if (verbose == -1) {
			fs.write("/dev/stdout", "}", "w"); // close test's json {
			fs.write("/dev/stdout", "}", "w"); // close global json {
		}
		phantom.exit(false);
	} else {
		if (verbose >= 0) {
                	console.log("["+t.toUTCString()+"]" + " [TPJS] --------------------");
			console.log("["+t.toUTCString()+"]" + " [TPJS] TEST #" + tindex + ":" + test_cases[tindex] + ": domxss-db.js(" + domxss_patterns[test_cases[tindex]] + ")");
		} else if (verbose == -1) {
			if (test_cases[tindex] != DOMXSS_ONLOAD) {
				fs.write("/dev/stdout", "},", "w"); // close test's json {
			}
			fs.write("/dev/stdout", "\"test"+tindex+"\":{", "w"); // open test's json {
			fs.write("/dev/stdout", "\"testid\":"+test_cases[tindex]+",", "w");
		}

     		while (1) {
			if (test_cases[tindex] == DOMXSS_ONLOAD) {
				l = url;
				break;
			} else if (test_cases[tindex] >= DOMXSS_QS_PATTERN_001 && test_cases[tindex] <= DOMXSS_QS_PATTERN_END) {
				no_of_query_string_params = 0;
				for (k in uri.queryKey) {
					no_of_query_string_params++;
					l = l + k + "=" + encodeURIComponent(domxss_patterns[test_cases[tindex]]) + "&";
                		}
     				if (no_of_query_string_params > 0) {
					break;
				} else {
					tindex++; continue;
				}
			} else if (test_cases[tindex] >= DOMXSS_HASH_PATTERN_001 && test_cases[tindex] <= DOMXSS_HASH_PATTERN_END) {
				l = l + "#"+encodeURIComponent(domxss_patterns[test_cases[tindex]]);
				break;
			}
		}

		if (verbose >= 0) {
                	console.log("["+t.toUTCString()+"]" + " [TPJS] TEST URL: " + l);
		} else if (verbose == -1) {
			fs.write("/dev/stdout", "\"url\":\""+l.replace(/'/g, '%27')+"\",", "w");
		}

		page.open(l, function (status) {
               		if (status !== 'success') {
				if (verbose >= 0) { console.log("["+t.toUTCString()+"]" + " [ERROR] Unable to access network"); }
				else if (verbose == -1) { 
					fs.write("/dev/stdout", "\"status\":\"fail\"}", "w");  // close test's json {
					fs.write("/dev/stdout", "}", "w"); // close global's json {
				}
				phantom.exit(false);
			}
		});
	}

	/*
	 onXXX handlers below 
	*/
	page.onConsoleMessage = function(msg, lineNum, sourceId) {
		if (verbose >= 0) {
			if (typeof lineNum === "undefined" || typeof sourceId === "undefined") {
				console.log("["+t.toUTCString()+"]" + " [TPJS] [CONSOLE] " + msg);
			} else {
				console.log("["+t.toUTCString()+"]" + " [TPJS] [CONSOLE] " + msg + " (from line #" + lineNum + " in '" + sourceId + "')");
			}
		} else if (verbose == -1 && msg.match(/^\"tpjs-/)) {
			fs.write("/dev/stdout", msg, "w");
		}
	};

	page.onError = function(msg, trace) {
		if (verbose >= 2) {
			var msgStack = ['ERROR: ' + msg];
			if (trace) {
				msgStack.push('TRACE:');
				trace.forEach(function(t) {
					msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
				});
			}
			console.error(msgStack.join('\n'));
		}
	};

	page.onInitialized = function() {
		evaluate(page, function(verbose) {
			document.addEventListener('DOMContentLoaded', function() {
				// console.log("DOM content has loaded.");
			}, false);
		}, verbose);
	};

	page.onLoadFinished = function(status) {
		if (status !== 'success') {
			if (verbose >= 0) { console.log("["+t.toUTCString()+"]" + " [ERROR] Unable to access network"); }
		} else {
			page.injectJs('jquery-1.9.1.min.js');
			page.injectJs('x2js-v1.0.11/xml2json.js');

			/* 
			   the first function never returns true, 
			   it will wait till timeout to make sure the javascript has enough time to run and execute. 
			   when timeout expires, it detects whether the document is tainted or not.
			*/

			tpjs.action(page, verbose);

			waitFor(function(verbose) {
				return tpjs.wait(page, verbose);
			}, function(verbose) {
				var tainted = false;
				evaluate(page, function(verbose) {
					var t = new Date();
					var tainted = false;

					var json_result = {}; var gindex = 0;
					json_result['tpjs-trace'] = {};

					if (document.tainted) tainted = true;
					var allobj = $("*");
					for(var i=0;i<allobj.length;++i) {
						if (allobj[i].tainted) {
							if (verbose >= 0) { console.log("[TRACE] " + allobj[i] + " id:" + allobj[i].id + " tainted:" + allobj[i].tainted); }
							else if (verbose == -1) { json_result['tpjs-trace'][gindex] = allobj[i] + " id:" + allobj[i].id + " tainted:" + allobj[i].tainted; ++gindex; }
                                                        /*
                                                        for(var j in allobj[i]) {
								if (verbose >= 0) { console.log("[TRACE] " + j + "," + allobj[i][j]); }
                                                        }
                                                        */
                                                        tainted = true;
                                                }
                                        }
					if (tainted) {
						// if (verbose >= 0) {
							// console.log("[TRACE] " + document.taintedTrace);
						// }
						var sinks = new Array();
						var sources = new Array();
						var propagates = new Array();
						var clears = new Array();
						var resets = new Array();
						var calls = new Array();

						var x2js = new X2JS();
						var jsResult = x2js.xml_str2json('<result>'+document.taintedTrace+'</result>');
						var lastindex = 0;
						for (var index in jsResult.result.trace) {
							var s = jsResult.result.trace[index];
							if (typeof s !== 'undefined') {
                                                                if (s.action == "source") sources.push(index);
                                                                if (s.action == "sink") sinks.push(index);
                                                                if (s.action == "propagate") propagates.push(index);
                                                                if (s.action == "clear") clears.push(index);
                                                                if (s.action == "reset") resets.push(index);
                                                                if (s.action == "call") calls.push(index);
                                                                lastindex = index;
							}
						}
						if (verbose >= 0) { console.log("[TRACE] ================="); }
						for (var i=0;i<sources.length;++i) {
							var s = jsResult.result.trace[sources[i]];
							if (verbose >= 0) { console.log("[TRACE] "+s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc+","+s.value); }
							else if (verbose == -1) { json_result['tpjs-trace'][gindex] = s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc; ++gindex;}
						}
						if (verbose >= 0) { console.log("[TRACE] ================="); }
						for (var i=0;i<sinks.length;++i) {
							var s = jsResult.result.trace[sinks[i]];
							if (verbose >= 0) { console.log("[TRACE] "+s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc+","+s.value); }
							else if (verbose == -1) { json_result['tpjs-trace'][gindex] = s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc; ++gindex;}
						}
						if (verbose >= 0) { console.log("[TRACE] ================="); }
						for (var i=0;i<propagates.length;++i) {
							var s = jsResult.result.trace[propagates[i]];
							if (verbose >= 0) { console.log("[TRACE] "+s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc+","+s.value); }
							else if (verbose == -1) { json_result['tpjs-trace'][gindex] = s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc; ++gindex;}
						}
						if (verbose >= 0) { console.log("[TRACE] ================="); }
						for (var i=0;i<clears.length;++i) {
							var s = jsResult.result.trace[clears[i]];
							if (verbose >= 0) { console.log("[TRACE] "+s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc+","+s.value); }
							else if (verbose == -1) { json_result['tpjs-trace'][gindex] = s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc; ++gindex;}
						}
						if (verbose >= 0) { console.log("[TRACE] ================="); }
						for (var i=0;i<resets.length;++i) {
							var s = jsResult.result.trace[resets[i]];
							if (verbose >= 0) { console.log("[TRACE] "+s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc+","+s.value); }
							else if (verbose == -1) { json_result['tpjs-trace'][gindex] = s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc; ++gindex;}
						}
						for (var i=0;i<calls.length;++i) {
							var s = jsResult.result.trace[calls[i]];
							if (verbose >= 0) { console.log("[TRACE] "+s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc+","+s.value); }
							else if (verbose == -1) { json_result['tpjs-trace'][gindex] = s.action+","+s.taintedno+","+s.internalfunc+","+s.jsfunc; ++gindex;}
						}
					}

					if (verbose == -1) { 
						var fs = require('fs');
						var j = JSON.stringify(json_result);
						fs.write("/dev/stdout", j.substr(1).substr(0, j.length-2)+",", "w");
					}
                                        document.clearTaintedTrace();
				}, verbose);

				tainted = page.evaluate(function() {
					var tainted = false;
					if (document.tainted) tainted = true;
					var allobj = $("*");
					for(var i=0;i<allobj.length;++i) {
						if (allobj[i].tainted) {
                                                        tainted = true;
                                                }
                                        }
					return tainted;
				});

				var json_result = {};
				json_result['result'] = {};
				if (verbose >= 2) {
					var body = page.evaluate(function () {
						return document.body.innerHTML;
					});
					console.log("["+t.toUTCString()+"]" + " [DEBUG] " + body);
				}
				page.render(renderpath + 'screenshot.png');

				if (verbose >= 0) {
					console.log("["+t.toUTCString()+"]" + " [TPJS] [RESULT] document.tainted? " + tainted);
					console.log("["+t.toUTCString()+"]" + " [TPJS] [RESULT] document.onAlert? " + onalert);
				} else if (verbose == -1) {
					json_result['result']['tainted'] = tainted;
					json_result['result']['onalert'] = onalert;
				}
				if (onalert && tainted) {
					if (verbose >= 0) { console.log("["+t.toUTCString()+"]" + " [TPJS] [RESULT] document.domxss.vulnerable? true"); }
					else if (verbose == -1) { 
						json_result['result']['domxss.vulnerable'] = true; 
						var j = JSON.stringify(json_result);
						fs.write("/dev/stdout", j.substr(1).substr(0, j.length-2), "w");
						fs.write("/dev/stdout", "}", "w"); // close test's json {
						fs.write("/dev/stdout", "}", "w"); // close global json {
					}
					phantom.exit(false);
				} else if (!onalert && tainted) {
					if (verbose >= 0) { console.log("["+t.toUTCString()+"]" + " [TPJS] [RESULT] document.domxss.vulnerable? true|false"); }
					else if (verbose == -1) { 
						json_result['result']['domxss.vulnerable'] = false;
						var j = JSON.stringify(json_result);
						fs.write("/dev/stdout", j.substr(1).substr(0, j.length-2), "w");
					}
					callback(url, uri, timeout, tindex+1, callback, verbose);
				} else {
					if (verbose >= 0) { console.log("["+t.toUTCString()+"]" + " [TPJS] [RESULT] document.domxss.vulnerable? false"); }
					else if (verbose == -1) { 
						json_result['result']['domxss.vulnerable'] = false; 
						var j = JSON.stringify(json_result);
						fs.write("/dev/stdout", j.substr(1).substr(0, j.length-2), "w");
					}
					callback(url, uri, timeout, tindex+1, callback, verbose);
				}

			}, timeout, verbose);
		}
	};

	page.onLoadStarted = function() {
		var currentUrl = page.evaluate(function() {
			return window.location.href;
		});
		if (verbose >= 1) {
			console.log("["+t.toUTCString()+"]" + " [INFO] Current page " + currentUrl + " will gone...");
			console.log("["+t.toUTCString()+"]" + " [INFO] Now loading a new page...");
		}
	};

	page.onNavigationRequested = function(url, type, willNavigate, main) {
		++no_of_navigation;
		if (no_of_navigation >= 10) {
			if (verbose >= 0) { console.log("["+t.toUTCString()+"]" + " [ERROR] navigate too much"); }
			phantom.exit();
		}
		if (verbose >= 1) {
			console.log("["+t.toUTCString()+"]" + " [INFO] Trying to navigate to: " + url);
			console.log("["+t.toUTCString()+"]" + " [INFO] Caused by: " + type);
			console.log("["+t.toUTCString()+"]" + " [INFO] Will actually navigate: " + willNavigate);
		}
	};

	page.onPageCreated = function(newPage) {
		if (verbose >= 2) {
			console.log("["+t.toUTCString()+"]" + " [DEBUG] A new child page was created! Its requested URL is not yet available, though.");
			newPage.onClosing = function(closingPage) {
				// console.log("["+t.toUTCString()+"]" + " [DEBUG] A child page is closing: " + closingPage.url);
			};
		}
	};

	page.onPrompt = function(msg, defaultVal) {
		if (msg === "What's your name?") {
			return 'PhantomJS';
		}
		return defaultVal;
	};

	page.onResourceRequested = function(request) {
		if (verbose >= 2) {
			console.log("["+t.toUTCString()+"]" + " [DEBUG] Request (#" + request.id + "): " + JSON.stringify(request));
		}
	};

	page.onResourceReceived = function(response) {
		if (verbose >= 2) {
			console.log("["+t.toUTCString()+"]" + " [DEBUG] Response (#" + response.id + ", stage '" + response.stage + "'): " + JSON.stringify(response));
		}
	};

	page.onUrlChanged = function(targetUrl) {
		if (verbose >= 2) {
			console.log("["+t.toUTCString()+"]" + " [DEBUG] New URL: " + targetUrl);
		}
	};

	page.onAlert = function(msg) {
		onalert = true;
		if (verbose >= 0) {
			console.log("["+t.toUTCString()+"]" + " [TPJS] OnAlert: " + msg);
		}
	};

	return false;
}

phantom.cookiesEnabled = true;
cookie_parser(cookiesfile, verbose);
var qs = "";
var uri = parseUri(url);
for (var k in uri) {
	if (k == "queryKey") {
		for (var q in uri[k]) {
			if (verbose >= 2) { console.log("["+t.toUTCString()+"]" + " [DEBUG] uri.queryKey:" + q + "-->" + uri[k][q]); }
			qs[q] = uri[k][q];
		}
	} else {
		if (verbose >= 2) { console.log("["+t.toUTCString()+"]" + " [DEBUG] uri." + k + "-->" + uri[k]); }
	}
}
