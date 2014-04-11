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
var DOMXSS_END = 0;
var DOMXSS_ONLOAD = 1;

// http://crackschool.exploited360.com:8998/index.php?name=
var DOMXSS_QS_PATTERN_001 = 1000; 
var DOMXSS_QS_PATTERN_002 = 1001; 
var DOMXSS_QS_PATTERN_003 = 1002; 
var DOMXSS_QS_PATTERN_END = 1999;

var DOMXSS_HASH_PATTERN_001 = 2000; // 
var DOMXSS_HASH_PATTERN_002 = 2001; // 
var DOMXSS_HASH_PATTERN_003 = 2002; // 
var DOMXSS_HASH_PATTERN_END = 2999;

var domxss_patterns = {
	1 : 'window.onload()',
	// QS patterns
	1000 : '<img src="" onerror="alert(0)">',
	1001 : "');alert('0",
	1002 : '");alert("0',
	// HASH patterns
	2000 : '<img src="" onerror="alert(0)">',
	2001 : '");alert("0',
	2002 : "');alert('0",
}
