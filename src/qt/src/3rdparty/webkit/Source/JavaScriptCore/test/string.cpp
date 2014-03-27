#include <iostream>

/* Example - http://parmanoir.com/Taming_JavascriptCore_within_and_without_WebView */
#include "JavaScriptCore/JavaScript.h"
#include "JavaScriptCore/JSStringRef.h"
#include "JavaScriptCore/JSContextRef.h"

using namespace std;

int main() {

	JSGlobalContextRef ctx = JSGlobalContextCreate(NULL);

	JSStringRef scriptJS1 = JSStringCreateWithUTF8CString("return new String('hello')");
	JSObjectRef fn1 = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS1, NULL, 1, NULL); 
        JSValueRef result1 = JSObjectCallAsFunction(ctx, fn1, NULL, 0, NULL, NULL);
	cout << "JSValueIsObject:" << JSValueIsObject(ctx, result1) << endl;
	
	JSStringRef scriptJS2 = JSStringCreateWithUTF8CString("return 'hello'");
	JSObjectRef fn2 = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS2, NULL, 1, NULL); 
        JSValueRef result2 = JSObjectCallAsFunction(ctx, fn2, NULL, 0, NULL, NULL);
	cout << "JSValueIsObject:" << JSValueIsObject(ctx, result2) << endl;

	JSStringRef scriptJS3 = JSStringCreateWithUTF8CString("return \"hello\"");
	JSObjectRef fn3 = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS3, NULL, 1, NULL); 
        JSValueRef result3 = JSObjectCallAsFunction(ctx, fn3, NULL, 0, NULL, NULL);
	cout << "JSValueIsObject:" << JSValueIsObject(ctx, result3) << endl;

	JSStringRef scriptJS4 = JSStringCreateWithUTF8CString("return 'hello' + new String('hello')");
	JSObjectRef fn4 = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS4, NULL, 1, NULL); 
        JSValueRef result4 = JSObjectCallAsFunction(ctx, fn4, NULL, 0, NULL, NULL);
	cout << "JSValueIsObject:" << JSValueIsObject(ctx, result4) << endl;

	JSStringRef scriptJS5 = JSStringCreateWithUTF8CString("return new String('hello') + 'hello'");
	JSObjectRef fn5 = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS5, NULL, 1, NULL); 
        JSValueRef result5 = JSObjectCallAsFunction(ctx, fn5, NULL, 0, NULL, NULL);
	cout << "JSValueIsObject:" << JSValueIsObject(ctx, result5) << endl;

	JSStringRef scriptJS6 = JSStringCreateWithUTF8CString("return new String('hello') + new String('hello')");
	JSObjectRef fn6 = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS6, NULL, 1, NULL); 
        JSValueRef result6 = JSObjectCallAsFunction(ctx, fn6, NULL, 0, NULL, NULL);
	cout << "JSValueIsObject:" << JSValueIsObject(ctx, result6) << endl;

	JSStringRelease(scriptJS1);
	JSStringRelease(scriptJS2);
	JSStringRelease(scriptJS3);
	JSStringRelease(scriptJS4);
	JSStringRelease(scriptJS5);
	JSStringRelease(scriptJS6);

	JSGlobalContextRelease(ctx);
	return 0;
}
