#include <iostream>

/* Example - http://parmanoir.com/Taming_JavascriptCore_within_and_without_WebView */
#include "JavaScriptCore/JavaScript.h"
#include "JavaScriptCore/JSStringRef.h"
#include "JavaScriptCore/JSContextRef.h"

using namespace std;

int main() {

	JSGlobalContextRef ctx = JSGlobalContextCreate(NULL);
	
	JSStringRef scriptJS = JSStringCreateWithUTF8CString("");
	JSObjectRef fn = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS, NULL, 1, NULL); 

	JSValueRef arg1 = JSValueMakeNumber(ctx, 2);
	cout << "JSValueIsNumber:" << JSValueIsNumber(ctx, arg1) << endl;

	JSStringRelease(scriptJS);

	JSGlobalContextRelease(ctx);
	return 0;
}
