#include <iostream>

/* Example - http://parmanoir.com/Taming_JavascriptCore_within_and_without_WebView */
#include "JavaScriptCore/JavaScript.h"
#include "JavaScriptCore/JSStringRef.h"
#include "JavaScriptCore/JSValueRef.h"
#include "JavaScriptCore/JSContextRef.h"

using namespace std;

int main() {

	JSGlobalContextRef ctx = JSGlobalContextCreate(NULL);

/*!
@function JSEvaluateScript
@abstract Evaluates a string of JavaScript.
@param ctx The execution context to use.
@param script A JSString containing the script to evaluate.
@param thisObject The object to use as "this," or NULL to use the global object as "this."
@param sourceURL A JSString containing a URL for the script's source file. This is only used when reporting exceptions. Pass NULL if you do not care to include source file information in exceptions.
@param startingLineNumber An integer value specifying the script's starting line number in the file located at sourceURL. This is only used when reporting exceptions.
@param exception A pointer to a JSValueRef in which to store an exception, if any. Pass NULL if you do not care to store an exception.
@result The JSValue that results from evaluating script, or NULL if an exception is thrown.
JS_EXPORT JSValueRef JSEvaluateScript(JSContextRef ctx, JSStringRef script, JSObjectRef thisObject, JSStringRef sourceURL, int startingLineNumber, JSValueRef* exception);
*/

/*!
@function JSCheckScriptSyntax
@abstract Checks for syntax errors in a string of JavaScript.
@param ctx The execution context to use.
@param script A JSString containing the script to check for syntax errors.
@param sourceURL A JSString containing a URL for the script's source file. This is only used when reporting exceptions. Pass NULL if you do not care to include source file information in exceptions.
@param startingLineNumber An integer value specifying the script's starting line number in the file located at sourceURL. This is only used when reporting exceptions.
@param exception A pointer to a JSValueRef in which to store a syntax error exception, if any. Pass NULL if you do not care to store a syntax error exception.
@result true if the script is syntactically correct, otherwise false.
JS_EXPORT bool JSCheckScriptSyntax(JSContextRef ctx, JSStringRef script, JSStringRef sourceURL, int startingLineNumber, JSValueRef* exception);
*/
	/* PASSED */
	char* code001 = "\
	";

	/* PASSED */
	char* code002 = "\
	var o = new Object(); \
	o; \
	";

	/* PASSED */
	char* code003 = "\
	var s = new String(); \
	s; \
	";

	/* PASSED */
	char* code004 = "\
	var s = 'hello'; \
	s; \
	";

	/* PASSED */
	char* code005 = "\
	var b = true; \
	b; \
	";

	/* PASSED */
	char* code006 = "\
	var i = 1; \
	i; \
	";

	/* PASSED */
	char* code007 = "\
	var f = 1.0; \
	f; \
	";

	/* PASSED */
	char* code008 = "\
	var s1 = new String('hello'); \
	s1.isTainted(); \
	s1.tainted(true); \
	s1; \
	";

	/* PASSED */
	char* code009  = "\
	var s1 = 'hello'; \
	s1.isTainted(); \
	s1.tainted(true); \
	s1; \
	";

	/* PASSED */
	// object = object
	char* code010  = "\
	var s1 = new String('hello'); \
	s1.isTainted(); \
	s1.tainted(true); \
	var s2 = s1; \
	s2; \
	";

	/* PASSED */
	// string = string
	char* code011 = "\
	var s1 = 'hello'; \
	s1.isTainted(); \
	s1.tainted(true); \
	var s2 = s1; \
	s2; \
	";

	/* PASSED */
	// object + object (JSString + JSString)
	char* code012 = "\
	var s1 = new String('hello'); \
	s1.isTainted(); \
	s1.tainted(true); \
	var s2 = new String('hello') + s1; \
	s2; \
	";

	/* PASSED */
	// string + string (JSString + JSString)
	char* code013 = "\
	var s1 = 'hello'; \
	s1.isTainted(); \
	s1.tainted(true); \
	var s2 = 'hello' + s1; \
	s2; \
	";

	/* PASSED */
	// string + object (JSString + USString)
	char* code014 = "\
	var s1 = 'hello'; \
	s1.isTainted(); \
	s1.tainted(true); \
	var s2 = s1 + new String('hello'); \
	s2; \
	";

	/* PASSED */
	// object + string (JSString + JSString)
	char* code015 = "\
	var s1 = new String('hello'); \
	s1.isTainted(); \
	s1.tainted(true); \
	var s2 = s1 + 'hello'; \
	s2; \
	";

	/* PASSED */
	// string + string + string (JSValue + JSValue + JSValue)
	char* code016 = "\
	var s1 = 'hello'; \
	s1.isTainted(); \
	s1.tainted(true); \
	var s2 = s1 + 'hello' + s1; \
	s2; \
	";

	/* PASSED */
	// string + object + string (JSString + UString, JSString + JSString)
	char* code017 = "\
	var s1 = 'hello'; \
	s1.isTainted(); \
	s1.tainted(true); \
	var s2 = s1 + new String('hello') + s1; \
	s2; \
	";

	char* code = "\
	var s1 = new String('hello'); \
	s1; \
	";

	JSValueRef* exception = new JSValueRef;

	JSStringRef scriptJS = JSStringCreateWithUTF8CString(code);
	cout << "JSCheckScriptSyntax:" << JSCheckScriptSyntax(ctx, scriptJS, NULL, 0, NULL) << endl;
	JSValueRef result = JSEvaluateScript(ctx, scriptJS, NULL, NULL, 0, exception);
	cout << "typeid:" << typeid(result).name() << endl;
	cout << "JSValueRef:result:JSValueGetType:"  << JSValueGetType(ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsObject:"  << JSValueIsObject (ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsNumber:"  << JSValueIsNumber (ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsString:"  << JSValueIsString (ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsBoolean:" << JSValueIsBoolean(ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsTainted:" << JSValueIsTainted(ctx, result) << endl;
	JSValueSetTainted(ctx, result, true);
	cout << "JSValueRef:result:JSValueIsTainted:" << JSValueIsTainted(ctx, result) << endl;
	JSValueSetTainted(ctx, result, false);
	cout << "JSValueRef:result:JSValueIsTainted:" << JSValueIsTainted(ctx, result) << endl;

	JSStringRelease(scriptJS);
	JSGlobalContextRelease(ctx);
	return 0;
}
