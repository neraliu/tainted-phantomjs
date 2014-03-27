#include <iostream>

/* Example - http://parmanoir.com/Taming_JavascriptCore_within_and_without_WebView */
#include "JavaScriptCore/JavaScript.h"
#include "JavaScriptCore/JSStringRef.h"
#include "JavaScriptCore/JSContextRef.h"

using namespace std;

int main() {

	JSGlobalContextRef ctx = JSGlobalContextCreate(NULL);
	
	JSStringRef scriptJS = JSStringCreateWithUTF8CString("return arguments[0].constructor == Array.prototype.constructor"); 
	JSObjectRef fn = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS, NULL, 1, NULL); 

	JSValueRef arg1 = JSValueMakeBoolean(ctx, false);
	JSValueRef arguments[1] = { arg1 };
	JSObjectRef jsObject = JSObjectMakeArray(ctx, 1, arguments, NULL);
	JSValueRef result = JSObjectCallAsFunction(ctx, fn, NULL, 1, (JSValueRef*)&jsObject, NULL);

	JSStringRelease(scriptJS);

	JSGlobalContextRelease(ctx);
	return 0;
}
