#include <iostream>

/* Example - http://parmanoir.com/Taming_JavascriptCore_within_and_without_WebView */
#include "JavaScriptCore/JavaScript.h"
#include "JavaScriptCore/JSStringRef.h"
#include "JavaScriptCore/JSContextRef.h"

using namespace std;

int main() {

	JSGlobalContextRef ctx = JSGlobalContextCreate(NULL);

	// JSStringRef scriptJS = JSStringCreateWithUTF8CString("return 1;");
	// JSStringRef scriptJS = JSStringCreateWithUTF8CString("return new Array");
	// JSStringRef scriptJS = JSStringCreateWithUTF8CString("return { hello : 'world', value : 123 }");
	// JSStringRef scriptJS = JSStringCreateWithUTF8CString("return new Date"); 
	JSStringRef scriptJS = JSStringCreateWithUTF8CString("return function (a, b) { return a+b }"); 

	JSObjectRef fn = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS, NULL, 1, NULL); 
	JSValueRef result = JSObjectCallAsFunction(ctx, fn, NULL, 0, NULL, NULL); 
	double r = JSValueToNumber(ctx, result, NULL);
	JSStringRelease(scriptJS);

	cout << "r:" << r << endl;

	JSGlobalContextRelease(ctx);
	return 0;
}
