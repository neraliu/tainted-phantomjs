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

describe("JSC Tainted Mode", function () {

    it("string have isTainted and tainted function (object)", function() {
	var s = new String("hello");
        expect(s.isTainted()).toNotEqual(null);
	expect(s.isTainted()).toBe(0);
	expect(s.tainted(Math.floor(Math.random()*1000+1))).not.toBe(0);
    });

    it("string have isTainted and tainted function (primitive)", function() {
	var s = "hello";
        expect(s.isTainted()).toNotEqual(null);
        expect(s.isTainted()).toBe(0);
        expect(s.tainted(Math.floor(Math.random()*1000+1))).not.toBe(0);
    });

    it("string can be tainted (object)", function() {
	var s = new String("hello");
	s.tainted(Math.floor(Math.random()*1000+1));
        expect(s.isTainted()).not.toBe(0);
        expect(typeof s == "object").not.toBe(0);
    });

    it("string can be tainted (primitive)", function() {
	var s = "hello";
	s.tainted(Math.floor(Math.random()*1000+1));
        expect(s.isTainted()).not.toBe(0);
        expect(typeof s == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated by assignment (object)", function() {
	var s1 = new String("hello");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1;
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s1 == "object").not.toBe(0);
        expect(typeof s2 == "object").not.toBe(0);
    });

    it("string's tainted flag can be propagated by assignment with string (object + primitive)", function() {
	var s1 = new String("hello");
	s1.tainted(Math.floor(Math.random()*1000+1));
	expect(s1.isTainted()).not.toBe(0);
	var s2 = "hello" + s1;
	expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
	var s3 = s1 + "hello";
	expect(s3.isTainted()).not.toBe(0);
        expect(typeof s3 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated by assignment with string (object + object)", function() {
	var s1 = new String("hello");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = new String("hello") + s1;
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
	var s3 = s1 + new String("hello");
        expect(s3.isTainted()).not.toBe(0);
        expect(typeof s3 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated by assignment (primitive)", function() {
	var s1 = "hello";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1;
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s1 == "string").not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated by addition with string (primitive + primitive)", function() {
	var s1 = "hello";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = "hello" + s1;
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
	var s3 = s1 + "hello";
        expect(s3.isTainted()).not.toBe(0);
        expect(typeof s3 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated by addition with string (primitive + object)", function() {
	var s1 = "hello";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = new String("hello") + s1;
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
	var s3 = s1 + new String("hello");
        expect(s3.isTainted()).not.toBe(0);
        expect(typeof s3 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through decodeURI (primitive)", function() {
	var s1 = "hello%22%26";
	s1.tainted(Math.floor(Math.random()*1000+1));
	expect(s1.isTainted()).not.toBe(0);
	var s2 = decodeURI(s1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through decodeURI (object)", function() {
	var s1 = new String("hello%22%26");
	s1.tainted(Math.floor(Math.random()*1000+1));
	expect(s1.isTainted()).not.toBe(0);
	var s2 = decodeURI(s1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through decodeURIComponent (primitive)", function() {
	var s1 = "hello%22%26";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = decodeURIComponent(s1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through decodeURIComponent (object)", function() {
	var s1 = new String("hello%22%26");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = decodeURIComponent(s1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through encodeURI (primitive)", function() {
	var s1 = "http://xyz.yahoo.com/path/index.php?a=1&b=2#fragment";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = encodeURI(s1);
        expect(s2.isTainted()).toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through encodeURI (object)", function() {
	var s1 = new String("http://xyz.yahoo.com/path/index.php?a=1&b=2#fragment");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = encodeURI(s1);
        expect(s2.isTainted()).toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through encodeURIComponent (primitive)", function() {
	var s1 = "path/index.php?a=1&b=2#fragment";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = encodeURIComponent(s1);
        expect(s2.isTainted()).toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through encodeURIComponent (object)", function() {
	var s1 = new String("path/index.php?a=1&b=2#fragment");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = encodeURIComponent(s1);
        expect(s2.isTainted()).toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through Object keys (primitive)", function() {
	var s1 = "key";
	var s2 = "value";
	s1.tainted(Math.floor(Math.random()*1000+1));
	s2.tainted(Math.floor(Math.random()*1000+1));
	var myObj = {s1:s2};
	expect(s1.isTainted()).not.toBe(0);
	expect(s2.isTainted()).not.toBe(0);
	for (var key in myObj) {
           var v = myObj[key];
	   expect(key.isTainted()).toBe(0);
	   expect(v.isTainted()).not.toBe(0);
        }
    	expect(Object.keys(myObj)[0].isTainted()).toBe(0);
    });

    it("string's tainted flag can be propagated through Object keys (object)", function() {
	var s1 = new String("key");
	var s2 = new String("value");
	s1.tainted(Math.floor(Math.random()*1000+1));
	s2.tainted(Math.floor(Math.random()*1000+1));
	var myObj = {s1:s2};
	expect(s1.isTainted()).not.toBe(0);
	expect(s2.isTainted()).not.toBe(0);
	for (var key in myObj) {
           var v = myObj[key];
	   expect(key.isTainted()).toBe(0);
	   expect(v.isTainted()).not.toBe(0);
    }
       expect(Object.keys(myObj)[0].isTainted()).toBe(0);
    });

    it("string's tainted flag can be propagated through escape function (primitive)", function() {
	var s1 = "http://xyz.yahoo.com/path/index.php?a=1&b=2#fragment";
	s1.tainted(Math.floor(Math.random()*1000+1));
	expect(s1.isTainted()).not.toBe(0);
	var s2 = escape(s1);
        expect(s2.isTainted()).toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through escape function (object)", function() {
	var s1 = new String("http://xyz.yahoo.com/path/index.php?a=1&b=2#fragment");
	s1.tainted(Math.floor(Math.random()*1000+1));
	expect(s1.isTainted()).not.toBe(0);
	var s2 = escape(s1);
        expect(s2.isTainted()).toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through unescape function (primitive)", function() {
	var s1 = "http://xyz.yahoo.com/path/index.php?a=1&b=2#fragment";
	s1.tainted(Math.floor(Math.random()*1000+1));
	expect(s1.isTainted()).not.toBe(0);
	var s2 = unescape(s1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through unescape function (object)", function() {
	var s1 = new String("http://xyz.yahoo.com/path/index.php?a=1&b=2#fragment");
	s1.tainted(Math.floor(Math.random()*1000+1));
	expect(s1.isTainted()).not.toBe(0);
	var s2 = unescape(s1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through the trim function (primitive)", function() {
	var s1 = " hello ";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1.trim();
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through the trim function (object)", function() {
	var s1 = new String(" hello ");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1.trim();
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through the slice function (primitive)", function() {
	var s1 = "hello";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1.slice(1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through the slice function (object)", function() {
	var s1 = new String("hello");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1.slice(1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);
    });

    it("string's tainted flag can be propagated through the split function (primitive)", function() {
	var s1 = "hello and goodbye";
	s1.tainted(Math.floor(Math.random()*1000+1));
	expect(s1.isTainted()).not.toBe(0);
	var s_arr = s1.split(" ");
	var s2 = s_arr[0];
	var s3 = s_arr[1];
        expect(s2.isTainted()).not.toBe(0);
        expect(s3.isTainted()).not.toBe(0);        
    });

    it("string's tainted flag can be propagated through the split function (object)", function() {
	var s1 = new String("hello and goodbye");
	s1.tainted(Math.floor(Math.random()*1000+1));
	expect(s1.isTainted()).not.toBe(0);
	var s_arr = s1.split(" ");
	var s2 = s_arr[0];
	var s3 = s_arr[1];
        expect(s2.isTainted()).not.toBe(0);
        expect(s3.isTainted()).not.toBe(0);        
    });

    it("string's tainted flag can be propagated through the single char access of the string (primitive)", function() {
	var s1 = "hello";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1[1];
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);        
    });

    it("string's tainted flag can be propagated through the single char access of the string (object)", function() {
	var s1 = new String("hello");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1[1];
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);        
    });

    it("string's tainted flag can be propagated through the charAt function (primitive)", function() {
	var s1 = "hello";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1.charAt(1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);        
    });

    it("string's tainted flag can be propagated through the charAt function (object)", function() {
	var s1 = new String("hello");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var s2 = s1.charAt(1);
        expect(s2.isTainted()).not.toBe(0);
        expect(typeof s2 == "string").not.toBe(0);        
    });

    it("string's tainted flag can be propagated through the match function (primitive)", function() {
	var s1 = "hel|lo|there";
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var res = s1.match(/([^|]+)/g);        
	for (var i=0, ln=res.length; i<ln; i++) {
		expect(res[i].isTainted()).not.toBe(0);
	}
    });

    it("string's tainted flag can be propagated through the match function (object)", function() {
	var s1 = new String("hel|lo|there");
	s1.tainted(Math.floor(Math.random()*1000+1));
        expect(s1.isTainted()).not.toBe(0);
	var res = s1.match(/([^|]+)/g);        
	for (var i=0, ln=res.length; i<ln; i++) {
		expect(res[i].isTainted()).not.toBe(0);
	}
    });

    it("string's tainted flag can be propagated through the replace function (primitive 1)", function() {
	var s1 = "hello there";
	s1.tainted(Math.floor(Math.random()*1000+1));
	var res = s1.replace(/hello/, "Y!");
        expect(res.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the replace function (primitive 2)", function() {
	var s1 = "hello there";
	s1.tainted(Math.floor(Math.random()*1000+1));
	var res = s1.replace("hello", "Y!");
	expect(res.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the replace function (object 1)", function() {
	var s1 = new String("hello there");
	s1.tainted(Math.floor(Math.random()*1000+1));
	var res = s1.replace(/hello/, "Y!");
        expect(res.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the replace function (object 2)", function() {
	var s1 = new String("hello there");
	s1.tainted(Math.floor(Math.random()*1000+1));
	var res = s1.replace("hello", "Y!");
	expect(res.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the RegExp object (primitive)", function() {
	var s1 = "hello hello";
	s1.tainted(Math.floor(Math.random()*1000+1));
	var pattern = new RegExp("h");
	var s2 = pattern.exec(s1);
	expect(s2[0].isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the RegExp object (object)", function() {
	var s1 = new String("hello hello");
	s1.tainted(Math.floor(Math.random()*1000+1));
	var pattern = new RegExp("h");
	var s2 = pattern.exec(s1);
	expect(s2[0].isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the array join/toString (primitive)", function() {
	var s1 = "hello";
	var s2 = "ciao";
	var s3 = "bye";
	s1.tainted(Math.floor(Math.random()*1000+1));
	s3.tainted(Math.floor(Math.random()*1000+1));
	var myarr = [s1, s2, s3];
	var s4 = myarr.join();
	expect(s4.isTainted()).not.toBe(0);
	var s5 = myarr.toString();
	expect(s5.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the array join/toString (object)", function() {
	var s1 = new String("hello");
	var s2 = new String("ciao");
	var s3 = new String("bye");
	s1.tainted(Math.floor(Math.random()*1000+1));
	s3.tainted(Math.floor(Math.random()*1000+1));
	var myarr = [s1, s2, s3];
	var s4 = myarr.join();
	expect(s4.isTainted()).not.toBe(0);
	var s5 = myarr.toString();
	expect(s5.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the concat function (primitive 1)", function() {
	var s1 = "hello ";
	var s2 = "there";
	s1.tainted(Math.floor(Math.random()*1000+1));
	var res = s1.concat(s2);
        expect(res.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the concat function (primitive 2)", function() {
	var s1 = "hello ";
	var s2 = "there";
	s2.tainted(Math.floor(Math.random()*1000+1));
	var res = s1.concat(s2);
        expect(res.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the concat function (object 1)", function() {
	var s1 = new String("hello ");
	var s2 = new String("there");
	s1.tainted(Math.floor(Math.random()*1000+1));
	var res = s1.concat(s2);
        expect(res.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the concat function (object 2)", function() {
	var s1 = new String("hello ");
	var s2 = new String("there");
	s2.tainted(Math.floor(Math.random()*1000+1));
	var res = s1.concat(s2);
        expect(res.isTainted()).not.toBe(0);
    });

    it("string's tainted flag can be propagated through the array map (primitive)", function() {
	var s1 = "hello";
	var s2 = "ciao";
	var s3 = "bye";
	s1.tainted(Math.floor(Math.random()*1000+1));
	s3.tainted(Math.floor(Math.random()*1000+1));
	var myarr = [s1, s2, s3];
	var newarr = myarr.map(function(x){return "Y! " + x});
	var s4 = myarr.join();
        expect(newarr[0].isTainted()).not.toBe(0);
        expect(newarr[1].isTainted()).toBe(0);
        expect(newarr[2].isTainted()).not.toBe(0); 
    });

    it("string's tainted flag can be propagated through the array map (object)", function() {
	var s1 = new String("hello");
	var s2 = new String("ciao");
	var s3 = new String("bye");
	s1.tainted(Math.floor(Math.random()*1000+1));
	s3.tainted(Math.floor(Math.random()*1000+1));
	var myarr = [s1, s2, s3];
	var newarr = myarr.map(function(x){return "Y! " + x});
	var s4 = myarr.join();
        expect(newarr[0].isTainted()).not.toBe(0);
        expect(newarr[1].isTainted()).toBe(0);
        expect(newarr[2].isTainted()).not.toBe(0); 
    });

    it("string's tainted flag can be propagated through the array operations (primitive)", function() {
   	var s1 = "hello";
	var s2 = "ciao";
	var s3 = "bye";
	s1.tainted(Math.floor(Math.random()*1000+1));
	s3.tainted(Math.floor(Math.random()*1000+1));
	var myarr = [s1, s2, s3];
        expect(myarr[0].isTainted()).not.toBe(0);
        expect(myarr[1].isTainted()).toBe(0);
        expect(myarr[2].isTainted()).not.toBe(0);        
	var myarr2 = myarr;
        expect(myarr2[0].isTainted()).not.toBe(0);
        expect(myarr2[1].isTainted()).toBe(0);
        expect(myarr2[2].isTainted()).not.toBe(0);                  
    });

    it("string's tainted flag can be propagated through the array operations (object)", function() {
   	var s1 = new String("hello");
	var s2 = new String("ciao");
	var s3 = new String("bye");
	s1.tainted(Math.floor(Math.random()*1000+1));
	s3.tainted(Math.floor(Math.random()*1000+1));
	var myarr = [s1, s2, s3];
        expect(myarr[0].isTainted()).not.toBe(0);
        expect(myarr[1].isTainted()).toBe(0);
        expect(myarr[2].isTainted()).not.toBe(0);        
	var myarr2 = myarr;
        expect(myarr2[0].isTainted()).not.toBe(0);
        expect(myarr2[1].isTainted()).toBe(0);
        expect(myarr2[2].isTainted()).not.toBe(0);                  
    });

    // reference - http://www.w3schools.com/jsref/jsref_obj_string.asp 
    it("object string's functions test", function() {
	var s10 = new String("hello");
        expect(s10.isTainted()).toBe(0);
	var s11 = new String("hello");
	s11.tainted(Math.floor(Math.random()*1000+1));
        expect(s11.isTainted()).not.toBe(0);
	var s12 = new String("hello");
        expect(s12.isTainted()).toBe(0);
	var s13 = new String("hello");
	s13.tainted(Math.floor(Math.random()*1000+1));
        expect(s13.isTainted()).not.toBe(0);

	var s20 = s10.toString();
        expect(s20.isTainted()).toBe(0);
	var s21 = s11.toString();
        expect(s21.isTainted()).not.toBe(0);

	var s30 = s10.valueOf();
        expect(s30.isTainted()).toBe(0);
	var s31 = s11.valueOf();
        expect(s31.isTainted()).not.toBe(0);

	var s40 = s10.toLowerCase();
	expect(s40.isTainted()).toBe(0);
	var s41 = s11.toLowerCase();
	expect(s41.isTainted()).not.toBe(0);

	var s50 = s10.toUpperCase();
        expect(s50.isTainted()).toBe(0);
	var s51 = s11.toUpperCase();
        expect(s51.isTainted()).not.toBe(0);

	var s60 = s10.substr(0,1);
        expect(s60.isTainted()).toBe(0);
	var s61 = s11.substr(0,1);
        expect(s61.isTainted()).not.toBe(0);

	var s70 = s10.substring(0,1);
        expect(s70.isTainted()).toBe(0);
	var s71 = s11.substring(0,1);
	expect(s71.isTainted()).not.toBe(0);

	var s80 = s10.charAt(2);
        expect(s80.isTainted()).toBe(0);
	var s81 = s11.charAt(2);
        expect(s81.isTainted()).not.toBe(0);

	var s90 = s10.concat(s12);
        expect(s90.isTainted()).toBe(0);
	var s91 = s11.concat(s10);
        expect(s91.isTainted()).not.toBe(0);
	var s92 = s10.concat(s11);
        expect(s92.isTainted()).not.toBe(0);
	var s93 = s11.concat(s13);
        expect(s93.isTainted()).not.toBe(0);

	var arr10 = s10.match(/l/g);
	for(var i=0;i<arr10.length;++i) {
        	expect(arr10[i].isTainted()).toBe(0);
	}
	var arr11 = s11.match(/l/g);
	for(var i=0;i<arr11.length;++i) {
		expect(arr11[i].isTainted()).not.toBe(0);
	}

	var s100 = s10.slice(1,3);
        expect(s100.isTainted()).toBe(0);
	var s101 = s11.slice(1,3);
        expect(s101.isTainted()).not.toBe(0);

	var arr20 = s10.split("l");
	for(var i=0;i<arr20.length;++i) {
        	expect(arr20[i].isTainted()).toBe(0);
	}
	var arr21 = s11.split("l");
	for(var i=0;i<arr21.length;++i) {
		expect(arr21[i].isTainted()).not.toBe(0);
	}

	var s110 = s10.replace("l", "o");
        expect(s110.isTainted()).toBe(0);
	var s111 = s11.replace("l", "o");
        expect(s111.isTainted()).not.toBe(0);
    });

    it("string's concat with more than 3 strings at the same time (primitive)", function() {
	var s1 = "hello" + "hello" + "hello" + "hello" + "hello" + document.location;
	expect(s1.isTainted()).not.toBe(0);
	var s2 = "hello" + "hello" + "hello" + "hello" + "hello";
	expect(s2.isTainted()).toBe(0);
	var s3 = "hello";
	s3.tainted(Math.floor(Math.random()*1000+1));
	expect(s3.isTainted()).not.toBe(0);
	var s4 = "hello" + "hello" + document.location + "hello" + "hello";
	expect(s4.isTainted()).not.toBe(0);
	var s5 = "hello" + "hello" + s3 + "hello" + "hello";
	expect(s5.isTainted()).not.toBe(0);
    });

    it("string's concat with more than 3 strings at the same time (object)", function() {
	var s1 = new String("hello") + new String("hello") + new String("hello") + new String("hello") + new String("hello") + document.location;
	expect(s1.isTainted()).not.toBe(0);
	var s2 = new String("hello") + new String("hello") + new String("hello") + new String("hello") + new String("hello");
	expect(s2.isTainted()).toBe(0);
	var s3 = new String("hello");
	s3.tainted(Math.floor(Math.random()*1000+1));
	expect(s3.isTainted()).not.toBe(0);
	var s4 = new String("hello") + new String("hello") + document.location + new String("hello") + new String("hello");
	expect(s4.isTainted()).not.toBe(0);
	var s5 = new String("hello") + new String("hello") + s3 + new String("hello") + new String("hello");
	expect(s5.isTainted()).not.toBe(0);
    });

    it("document.location / window.location / location / document.referrer / document.cookie is tainted", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt?ab=cd";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
                expect(status == 'success').toEqual(true);

		expect(typeof document.location == "object").not.toBe(0);
		var loc1 = document.location;
		loc1 = loc1 + "";
		expect(typeof loc1 == "string").not.toBe(0);
		expect(loc1.isTainted()).not.toBe(0);

		expect(typeof window.location == "object").not.toBe(0);
		var loc2 = window.location;
		loc2 = loc2 + "";
		expect(typeof loc2 == "string").not.toBe(0);
		expect(loc2.isTainted()).not.toBe(0);

        	expect(typeof location == "object").not.toBe(0);
		var loc3 = location;
		loc3 = loc3 + "";
		expect(typeof loc3 == "string").not.toBe(0);
		expect(loc3.isTainted()).not.toBe(0);

		expect(typeof document.URL == "string").not.toBe(0);
        	expect(document.URL.isTainted()).not.toBe(0);
		expect(typeof document.documentURI == "string").not.toBe(0);
        	expect(document.documentURI.isTainted()).not.toBe(0);
		expect(typeof document.taintedMessage == "string").not.toBe(0);

        	expect(typeof document.cookie == "string").not.toBe(0);
        	expect(document.cookie.isTainted()).not.toBe(0);

        	expect(typeof document.referrer == "string").not.toBe(0);
        	expect(document.referrer.isTainted()).not.toBe(0);

        	expect(typeof document.location.href == "string").not.toBe(0);
        	expect(document.location.href.isTainted()).not.toBe(0);
        	// expect(typeof document.location.protocol == "string").not.toBe(0);
		// expect(document.location.protocol.isTainted()).not.toBe(0);
        	// expect(typeof document.location.host == "string").not.toBe(0);
        	// expect(document.location.host.isTainted()).not.toBe(0);
        	// expect(typeof document.location.hostname == "string").not.toBe(0);
        	// expect(document.location.hostname.isTainted()).not.toBe(0);
        	// expect(typeof document.location.port == "string").not.toBe(0);
        	// expect(document.location.port.isTainted()).not.toBe(0);
        	// expect(typeof document.location.pathname == "string").not.toBe(0);
        	// expect(document.location.pathname.isTainted()).not.toBe(0);
        	expect(typeof document.location.search == "string").not.toBe(0);
        	expect(document.location.search.isTainted()).not.toBe(0);
        	expect(typeof document.location.hash == "string").not.toBe(0);
        	expect(document.location.hash.isTainted()).not.toBe(0);
        	// expect(typeof document.location.origin == "string").not.toBe(0);
        	// expect(document.location.origin.isTainted()).not.toBe(0);

        	expect(typeof window.location.href == "string").not.toBe(0);
        	expect(window.location.href.isTainted()).not.toBe(0);
        	// expect(typeof window.location.protocol == "string").not.toBe(0);
        	// expect(window.location.protocol.isTainted()).not.toBe(0);
        	// expect(typeof window.location.host == "string").not.toBe(0);
        	// expect(window.location.host.isTainted()).not.toBe(0);
        	// expect(typeof window.location.hostname == "string").not.toBe(0);
        	// expect(window.location.hostname.isTainted()).not.toBe(0);
        	// expect(typeof window.location.port == "string").not.toBe(0);
        	// expect(window.location.port.isTainted()).not.toBe(0);
		// expect(typeof window.location.pathname == "string").not.toBe(0);
		// expect(window.location.pathname.isTainted()).not.toBe(0);
        	expect(typeof window.location.search == "string").not.toBe(0);
        	expect(window.location.search.isTainted()).not.toBe(0);
        	expect(typeof window.location.hash == "string").not.toBe(0);
        	expect(window.location.hash.isTainted()).not.toBe(0);
        	// expect(typeof window.location.origin == "string").not.toBe(0);
        	// expect(window.location.origin.isTainted()).not.toBe(0);

        	expect(typeof location.href == "string").not.toBe(0);
        	expect(location.href.isTainted()).not.toBe(0);
        	// expect(typeof location.protocol == "string").not.toBe(0);
        	// expect(location.protocol.isTainted()).not.toBe(0);
        	// expect(typeof location.host == "string").not.toBe(0);
        	// expect(location.host.isTainted()).not.toBe(0);
        	// expect(typeof location.hostname == "string").not.toBe(0);
        	// expect(location.hostname.isTainted()).not.toBe(0);
        	// expect(typeof location.port == "string").not.toBe(0);
        	// expect(location.port.isTainted()).not.toBe(0);
		// expect(typeof location.pathname == "string").not.toBe(0);
		// expect(location.pathname.isTainted()).not.toBe(0);
        	expect(typeof location.search == "string").not.toBe(0);
        	expect(location.search.isTainted()).not.toBe(0);
        	expect(typeof location.hash == "string").not.toBe(0);
        	expect(location.hash.isTainted()).not.toBe(0);
        	// expect(typeof location.origin == "string").not.toBe(0);
        	// expect(location.origin.isTainted()).not.toBe(0);

                handled = true;
            });
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

    it("document.location / location is tainted and be propagated", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt?ab=cd";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
                expect(status == 'success').toEqual(true);
        	expect(typeof location.hash == "string").not.toBe(0);
        	expect(location.hash.isTainted()).not.toBe(0);
		var hash = location.hash;
        	expect(hash.isTainted()).not.toBe(0);
                handled = true;
            });
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

    it("has no user input and document is not tainted.", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
	    <script>\
            var nouserinput = "nouserinput";\
            document.write(nouserinput);\
            </script>\
	    ');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt?ab=cd";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
                expect(status == 'success').toEqual(true);
		var tainted = page.evaluate(function () {
		    return document.tainted;
		});
        	expect(tainted).toBe(0);
                handled = true;
            });
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

    it("document.location is tainted as user input and propagated to document.write", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
	    <script>\
            document.write(document.location);\
            </script>\
	    ');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt?ab=cd";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
                expect(status == 'success').toEqual(true);
		var tainted = page.evaluate(function () {
		    return document.tainted;
		});
        	expect(tainted).not.toBe(0);
                handled = true;
            });
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

    it("document.location is tainted as user input and propagated to document.write", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
	    <script>\
            document.write("hello", document.location);\
            </script>\
	    ');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt?ab=cd";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
                expect(status == 'success').toEqual(true);
		var tainted = page.evaluate(function () {
		    return document.tainted;
		});
        	expect(tainted).not.toBe(0);
                handled = true;
            });
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

    it("document.location is tainted as user input and propagated to document.write", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
	    <script>\
            document.write("hello"+document.location.href.substring(document.location.href.indexOf("default=")+8));\
            </script>\
	    ');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt?default=cd";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
                expect(status == 'success').toEqual(true);
		var tainted = page.evaluate(function () {
		    return document.tainted;
		});
        	expect(tainted).not.toBe(0);
                handled = true;
            });
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

/*
    it("HTML element test", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
    	    <html>\
	    <div id="testnode1">testnode1</div>\
	    <div id="testnode2">testnode2</div>\
	    <div id="testnode3">testnode3</div>\
	    <div id="testnode4">testnode4</div>\
            <input id="testinput4" type="text"/>\
	    <div id="testnode5">testnode5</div>\
            <textarea id="testinput5"></textarea>\
	    <script>\
	    var node1 = document.getElementById("testnode1");\
	    node1.innerHTML = document.location;\
	    var node2 = document.getElementById("testnode2");\
	    node2.innerHTML = document.location + "";\
	    var node3 = document.getElementById("testnode3");\
	    node3.innerHTML = "no user input";\
	    var input4 = document.getElementById("testinput4").value;\
	    var node4 = document.getElementById("testnode4");\
	    node4.innerHTML = input4;\
	    var input5 = document.getElementById("testinput5").value;\
	    var node5 = document.getElementById("testnode5");\
	    node5.innerHTML = input5;\
            </script>\
            </html>\
	    ');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt?ab=cd";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
                expect(status == 'success').toEqual(true);
		var tainted1 = page.evaluate(function () {
		    return document.getElementById('testnode1').tainted;
		});
        	expect(tainted1).not.toBe(0);
		var tainted2 = page.evaluate(function () {
		    return document.getElementById('testnode2').tainted;
		});
        	expect(tainted2).not.toBe(0);
		var tainted3 = page.evaluate(function () {
		    return document.getElementById('testnode3').tainted;
		});
        	expect(tainted3).toBe(0);
		var tainted4 = page.evaluate(function () {
		    return document.getElementById('testnode4').tainted;
		});
        	expect(tainted4).not.toBe(0);
		var tainted5 = page.evaluate(function () {
		    return document.getElementById('testnode5').tainted;
		});
        	expect(tainted5).not.toBe(0);
                handled = true;
            });
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });
*/

    it("window.name is not tainted by user input", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
	    <script>\
	    window.name = "no user input";\
            </script>\
	    ');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
		expect(status == 'success').toEqual(true);
            });
	    // make sure the js has been run?
            page.onLoadFinished = function(status) {
                expect(status == 'success').toEqual(true);
		var tainted = page.evaluate(function () {
		    return document.tainted;
		});
        	expect(tainted).toBe(0);
                handled = true;
	    };
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

    it("window.name is tainted by user input", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
	    <script>\
	    window.name = document.location;\
            </script>\
	    ');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
		expect(status == 'success').toEqual(true);
            });
	    // make sure the js has been run?
            page.onLoadFinished = function(status) {
                expect(status == 'success').toEqual(true);
		var tainted = page.evaluate(function () {
		    return document.tainted;
		});
        	expect(tainted).not.toBe(0);
                handled = true;
	    };
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

    it("eval test (no user input)", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
		<script type="text/javascript">\
		eval("alert(0);");\
	    	</script>\
	    ');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
		expect(status == 'success').toEqual(true);
            });
	    // make sure the js has been run?
            page.onLoadFinished = function(status) {
                expect(status == 'success').toEqual(true);
		var tainted = page.evaluate(function () {
			return document.tainted;
		});
		// the code break here?
        	expect(tainted).toBe(0);
                handled = true;
	    };
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

    it("document.cookie sink test", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
		<script>\
			var c = document.cookie;\
			document.cookie = c;\
		</script>\
	    ');
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
		expect(status == 'success').toEqual(true);
            });
            page.onLoadFinished = function(status) {
                expect(status == 'success').toEqual(true);
		var tainted = page.evaluate(function () {
                        return document.tainted;
		});
        	expect(tainted).not.toBe(0);
                handled = true;
	    };
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });

    it("location sink test", function() {
	var server = require('webserver').create();
	server.listen(12345, function(request, response) {
            response.write('\
		<script>\
		    var v = document.location;\
		    document.location = v;\
		</script>\
	    ');
	// all passes below

	// var v = location;\
	// location = v;\
	// var v = location.href;\
	// location.href = v;\
	// var v = location.pathname;\
	// location.pathname = v;\
	// var v = location.search;\
	// location.search = v;\
	// var v = location.protocol;\
	// location.protocol = v;\
	// var v = location.hostname;\
	// location.hostname = v;\
	// var v = location.host;\
	// location.host = v;\
	// var v = location.port;\
	// location.port = v;\
	// var v = location.hash;\
	// location.hash = v;\
	// var v = document.location;\
	// document.location = v;\
	// var v = document.location.hash;\
	// document.location.hash = v;\
	// var v = window.location;\
	// window.location = v;\
	// var v = window.location.hash;\
	// window.location.hash = v;\
            response.close();
        });

    	var page = new WebPage();
        var url = "http://localhost:12345/foo/headers.txt";

        var handled = false;
	runs(function() {
            expect(handled).toEqual(false);
            page.open(url, function (status) {
		expect(status == 'success').toEqual(true);
            });
            page.onLoadFinished = function(status) {
                expect(status == 'success').toEqual(true);
		var tainted = page.evaluate(function () {
                        return document.tainted;
		});
        	expect(tainted).not.toBe(0);
                handled = true;
	    };
        });

        waits(50);

        runs(function() {
            expect(handled).toEqual(true);
            server.close();
        });
    });
});
