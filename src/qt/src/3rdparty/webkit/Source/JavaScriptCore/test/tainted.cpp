#include <iostream>

/* Example - http://parmanoir.com/Taming_JavascriptCore_within_and_without_WebView */
#include "JavaScriptCore/JavaScript.h"
#include "JavaScriptCore/JSStringRef.h"
#include "JavaScriptCore/JSValueRef.h"
#include "JavaScriptCore/JSContextRef.h"

using namespace std;

int main() {

	JSGlobalContextRef ctx = JSGlobalContextCreate(NULL);

	char* code = "\
	var s1 = 'hello'; \
	var s2 = s1; \
	s2; \
	";

	JSStringRef scriptJS = JSStringCreateWithUTF8CString(code);
	JSValueRef result = JSEvaluateScript(ctx, scriptJS, NULL, NULL, 0, NULL);

	cout << "typeid:" << typeid(result).name() << endl;
	cout << "JSValueRef:result:JSValueGetType:"  << JSValueGetType(ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsObject:"  << JSValueIsObject (ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsNumber:"  << JSValueIsNumber (ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsString:"  << JSValueIsString (ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsBoolean:" << JSValueIsBoolean(ctx, result) << endl;
	cout << "JSValueRef:result:JSValueIsTainted:" << JSValueIsTainted(ctx, result) << endl;
	JSValueSetTainted(ctx, result, true);
	cout << "JSValueRef:result:JSValueIsTainted:" << JSValueIsTainted(ctx, result) << endl;

	JSStringRelease(scriptJS);
	JSGlobalContextRelease(ctx);
	return 0;
}
