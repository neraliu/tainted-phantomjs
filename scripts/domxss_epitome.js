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
phantom.injectJs("domxss-common.js");

/*
overriding the uri parsing
*/
url = 'http://todomvc.com/labs/architecture-examples/epitome/#!/';
uri = parseUri(url);

/*
overiding the user action/wait here
*/
tpjs.action = function(page, verbose) {

	// [DEMO] - focus the element before sending keyboard events
       	console.log("["+t.toUTCString()+"]" + " [TPJS] [ACTION] Triggering...");
       	evaluate(page, function(verbose) {
       		console.log("[ACTION] evaluate start...");

		var b = document.querySelectorAll('button.destroy');
                for(var i=0,l=b.length;i<l;i++) { b[i].click(); }

               	// tainted the input
		$("#new-todo").focus();
               	var i = "\"><img src='' onerror=alert(0)>";
               	i.tainted(9999);
		$("#new-todo").val(i);

		console.log("[ACTION] evaluate end...");
	});

       	page.sendEvent('keypress', page.event.key.Enter);
       	// page.sendEvent('keypress', page.event.key.Backspace); // this works
       	console.log("["+t.toUTCString()+"]" + " [TPJS] [ACTION] Triggering... ends");
}

tpjs.wait = function(page, verbose) {
	evaluate(page, function(verbose) {
       		// [ACTION] - condition to wait for the completion of the javascript
		return false;
	});
}

/*
it may have potential issue of adding too much test cases
*/
var test_cases = new Array();
test_cases.push(DOMXSS_ONLOAD);                 // onload
test_cases.push(DOMXSS_END);                    // end
test_domxss(uri, timeout, 0, test_domxss, verbose);
