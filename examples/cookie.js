var page = require('webpage').create();

phantom.cookiesEnabled = true;
phantom.addCookie({
    'name':     'cookie-name',
    'value':    'cookie-value',
    'domain':   'devel-001.fe-ver.com',           
    'path':     '/',
    'httponly': true,
    'secure':   false,
    'expires':  (new Date()).getTime() + 3600   
});
/*
phantom.addCookie({
    'name':     'Y',
    'value':    'v=1&n=6aac464andmss&l=d4h0b8k/o&p=m2gvvhk413000400&jb=21|33|13&iz=0000&r=4p&lg=en-US&intl=us',
    'domain':   '.yahoo.com',           
    'path':     '/',
    'httponly': true,
    'secure':   false,
    'expires':  (new Date()).getTime() + 3600   
});
phantom.addCookie({
    'name':     'T',
    'value':    'z=XJSXRBbOnXRBoQLo.hMQftaNDZPBjEzMTYwMzcyMQ--&a=YAE&sk=DAAkpH6FBYSA94&ks=EAApEoc3igBI2KnMijkp6Rfcw--~E&d=c2wBTXpFNEFUWTBOakUzTkRBMU5nLS0BYQFZQUUBZwEyVkZLTTZRSEFUR0xWQ0g2TUU3Q0oyNklPQQFzY2lkAXZrNkJZaTZmcjZIbURhRDRWajFlRlZtWGM5TS0Bb2sBWlcwLQF0aXABMzEuZnREAXp6AVhKU1hSQmZXQQ--',
    'domain':   '.yahoo.com',           
    'path':     '/',
    'httponly': true,
    'secure':   false,
    'expires':  (new Date()).getTime() + 3600   
});
*/
// console.log(phantom.cookies);

var url = 'http://devel-001.fe-ver.com/cookie.html';
page.open(url, function (status) {
	if (status !== 'success') {
		console.log('Unable to access network');
	} else {
		for (var i in page.cookies) {
			console.log(page.cookies[i]['name'] + " " + page.cookies[i]['value']);
		}
		var body = page.evaluate(function () {
			return document.body.innerHTML;
        	});
		console.log(body);
    	}
	phantom.exit();
});
